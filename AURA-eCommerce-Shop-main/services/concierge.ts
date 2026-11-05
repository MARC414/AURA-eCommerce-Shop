/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Local concierge.
 *
 * Deliberately not an LLM call. It retrieves a reviewed answer from
 * `data/knowledge-base.json` and refuses when nothing matches. A free,
 * offline, deterministic assistant that cannot invent a delivery date,
 * an ingredient, or a certification is worth more here than a fluent
 * one that can.
 */

import knowledgeBase from '../data/knowledge-base.json';

interface Entry {
  id: string;
  tags: string[];
  question: string;
  answer: string;
}

const ENTRIES: Entry[] = knowledgeBase.entries;

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'your', 'can', 'could', 'would',
  'does', 'did', 'how', 'what', 'when', 'where', 'who', 'why', 'this', 'that',
  'with', 'have', 'has', 'any', 'get', 'got', 'about', 'there', 'their', 'they',
  'from', 'will', 'shall', 'should', 'much', 'many', 'very', 'just', 'some', 'into'
]);

function tokenise(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 2 && !STOP_WORDS.has(token));
}

function scoreEntry(entry: Entry, query: string, tokens: string[]): number {
  let total = 0;
  for (const tag of entry.tags) {
    // Multi-word tags are strong signals when they appear verbatim.
    if (tag.includes(' ') && query.includes(tag)) total += 5;
  }
  for (const token of tokens) {
    if (entry.tags.includes(token)) total += 3;
    else if (entry.question.toLowerCase().includes(token)) total += 2;
    else if (entry.tags.some(tag => tag.includes(token))) total += 1;
  }
  return total;
}

export interface ConciergeReply {
  text: string;
  matchedId: string | null;
  confidence: 'high' | 'low' | 'none';
}

export function askConcierge(question: string): ConciergeReply {
  const normalised = question.trim().toLowerCase();
  if (!normalised) {
    return { text: knowledgeBase.greeting, matchedId: null, confidence: 'none' };
  }

  const tokens = tokenise(normalised);
  let best: Entry | null = null;
  let bestScore = 0;

  for (const entry of ENTRIES) {
    const score = scoreEntry(entry, normalised, tokens);
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  if (!best || bestScore < 2) {
    return { text: knowledgeBase.fallback, matchedId: null, confidence: 'none' };
  }

  return {
    text: best.answer,
    matchedId: best.id,
    confidence: bestScore >= 4 ? 'high' : 'low'
  };
}

/** Short, reviewable prompts shown as chips before the visitor types. */
export const CONCIERGE_SUGGESTIONS: string[] = [
  'Can I buy something now?',
  'What is the difference between Shop and Discover?',
  'Is it safe to enter my card details?',
  'What is in the product?'
];

export const CONCIERGE_GREETING = knowledgeBase.greeting;
export const CONCIERGE_FALLBACK = knowledgeBase.fallback;
