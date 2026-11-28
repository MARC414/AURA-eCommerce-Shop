/**
 * Standardized SEO Service for OPAR.
 *
 * Centralizes dynamic resolution of:
 * - Unique, 120–160 character meta descriptions (never duplicating across routes or fabricating claims)
 * - Canonical & OpenGraph URL resolution (origin-aware via SITE_URL/APP_URL or root-relative preview paths)
 * - OpenGraph, Twitter/X, robots directives, and Schema.org JSON-LD alignment
 * - Sitewide build-time uniqueness & completeness auditing across every generated template
 */

const FORBIDDEN_SEO_PATTERNS = [
  /\banti[-\s]?acne\b/i,
  /\bclinically\s+proven\b/i,
  /(?<!\b(?:not|no|never|without)\s+(?:publish\s+)?(?:any\s+|treatment,\s*prevention\s+or\s+)?)\bcures?\b/i,
  /(?<!\b(?:not|no|never|without)\s+)\btreats?\s+(?:acne|anxiety|depression|disease|illness|insomnia)\b/i,
  /\bverified\s+buyer\b/i,
  /\b5[-\s]?star\b/i
];

export const DEFAULT_MIN_DESCRIPTION = 120;
export const DEFAULT_MAX_DESCRIPTION = 160;

export function getConfiguredOrigin(explicitOrigin = undefined) {
  const candidate = String(
    explicitOrigin !== undefined
      ? (explicitOrigin || '')
      : (process.env.SITE_URL || process.env.APP_URL || '')
  ).trim();
  if (!candidate) return '';
  let parsed;
  try {
    parsed = new URL(candidate);
  } catch {
    throw new Error(`Invalid SEO origin URL: ${candidate}`);
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    throw new Error(`SEO origin must use HTTP or HTTPS: ${candidate}`);
  }
  return `${parsed.origin}${parsed.pathname === '/' ? '' : parsed.pathname.replace(/\/+$/, '')}`;
}

export function normalizeRoutePath(rawPath) {
  if (rawPath === null || rawPath === undefined) return null;
  const trimmed = String(rawPath).trim();
  if (!trimmed) return null;

  let pathname = trimmed;
  if (/^https?:\/\//i.test(trimmed)) {
    pathname = new URL(trimmed).pathname;
  } else {
    pathname = trimmed.split('#')[0].split('?')[0];
  }

  pathname = pathname.replace(/\/{2,}/g, '/');
  if (!pathname.startsWith('/')) pathname = `/${pathname}`;
  if (pathname !== '/' && !/\.[a-z0-9]+$/i.test(pathname) && !pathname.endsWith('/')) {
    pathname = `${pathname}/`;
  }
  return pathname;
}

export function resolveCanonicalUrl(rawPath, { origin = undefined } = {}) {
  const pathname = normalizeRoutePath(rawPath);
  if (!pathname) return null;
  const base = getConfiguredOrigin(origin);
  return base ? `${base}${pathname}` : pathname;
}

function cleanText(value = '') {
  return String(value).replace(/\s+/g, ' ').trim();
}

function assertCleanSeoCopy(text, label = 'SEO copy') {
  for (const pattern of FORBIDDEN_SEO_PATTERNS) {
    if (pattern.test(text)) {
      throw new Error(`${label} contains prohibited claim wording (${pattern}).`);
    }
  }
}

function ensureSentenceEnd(text) {
  if (!text) return '';
  return /[.!?…]$/.test(text) ? text : `${text}.`;
}

function smartTruncate(text, maxLength) {
  const clean = cleanText(text);
  if (clean.length <= maxLength) return clean;
  const slice = clean.slice(0, maxLength - 1);
  const lastSpace = slice.lastIndexOf(' ');
  const cut = lastSpace >= Math.floor(maxLength * 0.65) ? slice.slice(0, lastSpace) : slice;
  return `${cut.replace(/[,:;—–\-\s]+$/, '')}…`;
}

export function normalizeMetaDescription(
  rawDescription,
  {
    context = '',
    fallback = '',
    minLength = DEFAULT_MIN_DESCRIPTION,
    maxLength = DEFAULT_MAX_DESCRIPTION,
    enforceRange = true
  } = {}
) {
  let desc = cleanText(rawDescription);
  if (!desc) desc = cleanText(fallback) || cleanText(context);
  assertCleanSeoCopy(desc, 'Meta description');

  if (enforceRange && desc.length < minLength) {
    const extraContext = cleanText(context);
    if (extraContext && !desc.toLowerCase().includes(extraContext.toLowerCase())) {
      const candidate = `${ensureSentenceEnd(desc)} ${ensureSentenceEnd(extraContext)}`.trim();
      desc = candidate.length <= maxLength
        ? candidate
        : `${ensureSentenceEnd(desc)} ${extraContext}`;
    }
    if (desc.length < minLength) {
      const extraFallback = cleanText(fallback);
      if (extraFallback && !desc.toLowerCase().includes(extraFallback.toLowerCase())) {
        desc = `${ensureSentenceEnd(desc)} ${ensureSentenceEnd(extraFallback)}`.trim();
      }
    }
  }

  if (desc.length > maxLength) {
    desc = smartTruncate(desc, maxLength);
  }
  assertCleanSeoCopy(desc, 'Normalized meta description');
  return desc;
}

function resolveJsonLdUrls(node, origin) {
  if (!node) return node;
  if (Array.isArray(node)) return node.map(item => resolveJsonLdUrls(item, origin));
  if (typeof node !== 'object') return node;

  const next = {};
  for (const [key, value] of Object.entries(node)) {
    if ((key === 'url' || key === 'item') && typeof value === 'string' && value.startsWith('/')) {
      next[key] = resolveCanonicalUrl(value, { origin });
    } else if (Array.isArray(value) || (value && typeof value === 'object')) {
      next[key] = resolveJsonLdUrls(value, origin);
    } else {
      next[key] = value;
    }
  }
  return next;
}

export function resolveDocumentSeo({
  title,
  description,
  canonical = null,
  route = null,
  brandName = 'OPAR',
  keywords = null,
  image = null,
  robots = null,
  indexable = false,
  jsonLd = null,
  previewLabel = '',
  seo = null,
  origin = undefined
} = {}) {
  const seoOpts = seo && typeof seo === 'object' ? seo : {};
  const effectiveOrigin = getConfiguredOrigin(seoOpts.origin !== undefined ? seoOpts.origin : origin);
  const rawRoute = canonical ?? seoOpts.canonical ?? route ?? null;
  const resolvedCanonical = resolveCanonicalUrl(rawRoute, { origin: effectiveOrigin });
  const isSpecimen = Boolean(previewLabel);

  const rawTitle = cleanText(seoOpts.title || title || brandName);
  const fullTitle = rawTitle.includes(brandName) ? rawTitle : `${rawTitle} — ${brandName}`;

  const rawDesc = cleanText(seoOpts.description || description || '');
  const scopePrefix = isSpecimen ? `${cleanText(previewLabel)} specimen: ` : '';
  const contextualDesc = normalizeMetaDescription(`${scopePrefix}${rawDesc}`, {
    context: seoOpts.context || '',
    fallback: seoOpts.fallback || `${brandName} curated objects, documented sourcing, and written invoice inquiry.`,
    minLength: seoOpts.minLength ?? DEFAULT_MIN_DESCRIPTION,
    maxLength: seoOpts.maxLength ?? DEFAULT_MAX_DESCRIPTION,
    enforceRange: Boolean(rawRoute) || Boolean(seoOpts.enforceRange)
  });

  const resolvedRobots = robots || seoOpts.robots || (isSpecimen ? 'noindex, nofollow' : (indexable ? 'index, follow' : 'noindex, follow'));

  let resolvedJsonLd = jsonLd ?? seoOpts.jsonLd ?? null;
  if (!resolvedJsonLd && seoOpts.type === 'home' && resolvedCanonical) {
    resolvedJsonLd = [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: brandName,
        url: resolvedCanonical,
        description: contextualDesc
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: brandName,
        url: resolvedCanonical,
        description: contextualDesc
      }
    ];
  }
  if (resolvedJsonLd && effectiveOrigin) {
    resolvedJsonLd = resolveJsonLdUrls(resolvedJsonLd, effectiveOrigin);
  }

  const hasProductSchema = Boolean(
    resolvedJsonLd && (Array.isArray(resolvedJsonLd)
      ? resolvedJsonLd.some(node => node['@type'] === 'Product')
      : resolvedJsonLd['@type'] === 'Product')
  );
  const hasArticleSchema = Boolean(
    resolvedJsonLd && (Array.isArray(resolvedJsonLd)
      ? resolvedJsonLd.some(node => node['@type'] === 'Article')
      : resolvedJsonLd['@type'] === 'Article')
  );

  const ogType = seoOpts.ogType || (hasProductSchema ? 'product' : hasArticleSchema ? 'article' : 'website');
  const resolvedImage = image ? (effectiveOrigin && image.startsWith('/') ? `${effectiveOrigin}${image}` : image) : null;
  const normalizedKeywords = cleanText(keywords || seoOpts.keywords || '');

  return {
    title: rawTitle,
    fullTitle,
    description: contextualDesc,
    canonical: resolvedCanonical,
    robots: resolvedRobots,
    keywords: normalizedKeywords || null,
    ogType,
    siteName: brandName,
    image: resolvedImage,
    twitterCard: resolvedImage ? 'summary_large_image' : 'summary',
    jsonLd: resolvedJsonLd
  };
}

export function renderSeoHeadTags(seo, escapeHtml) {
  const jsonLdTag = seo.jsonLd
    ? `\n  <script type="application/ld+json">${JSON.stringify(seo.jsonLd).replace(/<\//g, '<\\/')}</script>`
    : '';
  const keywordsTag = seo.keywords
    ? `\n  <meta name="keywords" content="${escapeHtml(seo.keywords)}">`
    : '';
  const canonicalTag = seo.canonical
    ? `\n  <link rel="canonical" href="${escapeHtml(seo.canonical)}">`
    : '';
  const ogImageTag = seo.image
    ? `\n  <meta property="og:image" content="${escapeHtml(seo.image)}">`
    : '';
  const ogUrlTag = seo.canonical
    ? `\n  <meta property="og:url" content="${escapeHtml(seo.canonical)}">`
    : '';
  const twitterImageTag = seo.image
    ? `\n  <meta name="twitter:image" content="${escapeHtml(seo.image)}">`
    : '';

  return `<title>${escapeHtml(seo.fullTitle)}</title>
  <meta name="description" content="${escapeHtml(seo.description)}">${keywordsTag}${canonicalTag}
  <meta name="robots" content="${escapeHtml(seo.robots)}">
  <meta property="og:type" content="${escapeHtml(seo.ogType)}">
  <meta property="og:site_name" content="${escapeHtml(seo.siteName)}">
  <meta property="og:title" content="${escapeHtml(seo.fullTitle)}">
  <meta property="og:description" content="${escapeHtml(seo.description)}">${ogImageTag}${ogUrlTag}
  <meta name="twitter:card" content="${escapeHtml(seo.twitterCard)}">
  <meta name="twitter:title" content="${escapeHtml(seo.fullTitle)}">
  <meta name="twitter:description" content="${escapeHtml(seo.description)}">${twitterImageTag}${jsonLdTag}`;
}

export function createSeoRegistry() {
  const canonicals = new Map();
  const descriptions = new Map();

  return {
    register(routePath, html) {
      const canonicalMatch = /<link rel="canonical" href="([^"]*)">/.exec(html);
      const descriptionMatch = /<meta name="description" content="([^"]*)">/.exec(html);
      if (!canonicalMatch || !canonicalMatch[1].trim()) {
        throw new Error(`SEO error: ${routePath} is missing a canonical tag.`);
      }
      if (!descriptionMatch || !descriptionMatch[1].trim()) {
        throw new Error(`SEO error: ${routePath} is missing a meta description.`);
      }
      const canon = canonicalMatch[1].trim();
      const desc = descriptionMatch[1].trim();
      if (canonicals.has(canon)) {
        throw new Error(`SEO duplicate canonical "${canon}" on ${routePath} (already used by ${canonicals.get(canon)}).`);
      }
      if (descriptions.has(desc)) {
        throw new Error(`SEO duplicate meta description on ${routePath} (already used by ${descriptions.get(desc)}).`);
      }
      canonicals.set(canon, routePath);
      descriptions.set(desc, routePath);
      return { canonical: canon, description: desc };
    },
    size() {
      return canonicals.size;
    }
  };
}

export function auditRenderedPages(renderedPages) {
  const registry = createSeoRegistry();
  const shortDescriptions = [];
  const longDescriptions = [];

  for (const page of renderedPages) {
    const { description } = registry.register(page.path, page.html);
    if (description.length < DEFAULT_MIN_DESCRIPTION) {
      shortDescriptions.push({ path: page.path, length: description.length });
    } else if (description.length > DEFAULT_MAX_DESCRIPTION) {
      longDescriptions.push({ path: page.path, length: description.length });
    }
  }

  return {
    total: registry.size(),
    shortDescriptions,
    longDescriptions
  };
}
