# AURA — Cloudflare Pages Deployment Guide

**Version:** 1.0 (2026-11-08)  
**Purpose:** Instructions for deploying the AURA preview site to Cloudflare Pages.

---

## 1. Prerequisites & Host Readiness

The codebase is pre-configured and ready for Cloudflare Pages:
- **Build output:** `dist/` (contains pre-rendered product pages, catalog pages, and the React SPA bundle)
- **SPA Fallback Routing:** `_redirects` in `dist/` routes unmatched paths to `/index.html` with HTTP 200, while existing static files (`/shop/*`, `/discover/*`, `/templates/*`, `/assets/*`) are served directly.
- **Preview Headers & Search Protection:** `_headers` in `dist/` injects `X-Robots-Tag: noindex, nofollow` and security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`) so staging URLs are not indexed by search engines.
- **Node Environment:** `.nvmrc` and `.node-version` pin Node.js 20.

---

## 2. Deployment Method A — Direct GitHub Connection (Recommended)

This provides automatic preview deployments on every Git push to `master`/`main`.

### Step 1: Open Cloudflare Dashboard
1. Log in to [dash.cloudflare.com](https://dash.cloudflare.com/).
2. Select **Compute (Workers) > Workers & Pages** in the left sidebar.
3. Click **Create** > select the **Pages** tab.
4. Click **Connect to Git**.

### Step 2: Select Repository
- Authorize your GitHub account (or select your existing connection).
- Select the repository: `MARC414/AURA-eCommerce-Shop`.

### Step 3: Configure Build Settings
Fill in the build configuration:
- **Project name:** `aura-quiet-living` (or your preferred project name)
- **Production branch:** `main` (or `master`, whichever is your primary branch)
- **Framework preset:** `Vite` (or `None`)
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Root directory:** `/` (leave blank or `/`)

### Step 4: Environment Variables (Optional)
If you wish to provide a Gemini API Key for the concierge client-side features:
- Variable: `GEMINI_API_KEY`
- Value: `<your-api-key>`

### Step 5: Save and Deploy
- Click **Save and Deploy**.
- Cloudflare will build the site and provide a free preview URL, e.g.:
  `https://aura-quiet-living.pages.dev`

---

## 3. Deployment Method B — Direct Upload (No Git Connection Required)

If you prefer to deploy immediately from your local machine without setting up Cloudflare Git authorization:

### Option 1: Drag & Drop via Cloudflare Dashboard
1. On your local machine, run:
   ```bash
   npm run build
   ```
2. In the Cloudflare Dashboard, go to **Workers & Pages > Create > Pages > Upload assets**.
3. Name your project (e.g. `aura-preview`).
4. Drag and drop the `dist` folder into Cloudflare.
5. Click **Deploy site**.

### Option 2: Command Line using Wrangler
1. Build the assets:
   ```bash
   npm run build
   ```
2. Deploy directly with Wrangler:
   ```bash
   npx wrangler pages deploy dist --project-name aura-quiet-living
   ```

---

## 4. Verification Checklist After Deployment

After Cloudflare finishes deploying, verify the following:

1. **Homepage:** Visit `https://<your-project>.pages.dev/` — verify that the homepage renders smoothly.
2. **Pre-rendered Product Pages:**
   - Dropshipping product: `https://<your-project>.pages.dev/shop/turmeric-cleansing-soap/`
   - Affiliate product: `https://<your-project>.pages.dev/discover/turmeric-cleansing-pads/`
   - Third preview: `https://<your-project>.pages.dev/shop/aloe-vera-soap/`
   - Capsule preview: `https://<your-project>.pages.dev/shop/ashwagandha-with-black-pepper/`
3. **Category & Hub Indexes:**
   - `https://<your-project>.pages.dev/shop/`
   - `https://<your-project>.pages.dev/discover/`
   - `https://<your-project>.pages.dev/templates/`
4. **Header Verification:** Inspect network tab in browser dev tools:
   - Check that `X-Robots-Tag: noindex, nofollow` is present in response headers.
   - Check that `robots.txt` disallows crawlers during development.
