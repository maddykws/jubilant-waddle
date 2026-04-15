#!/usr/bin/env node
// run-apify-recruiters.mjs — Execute Apify LinkedIn recruiter search
// Reads Apify token from config/profile.yml and input from apify-recruiter-search.json
// Usage: node run-apify-recruiters.mjs [actor-id]
// Default actor: curious_coder/linkedin-search-scraper

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));

// ── Load Apify token from profile.yml (gitignored) ───────────────────────────
const profile = readFileSync(join(__dir, 'config/profile.yml'), 'utf8');
const tokenMatch = profile.match(/token:\s*"([^"]+)"/);
if (!tokenMatch) {
  console.error('❌  apify.token not found in config/profile.yml');
  process.exit(1);
}
const APIFY_TOKEN = tokenMatch[1];

// ── Load search input ─────────────────────────────────────────────────────────
const input = JSON.parse(readFileSync(join(__dir, 'apify-recruiter-search.json'), 'utf8'));
// Strip comment fields
delete input._comment;
delete input._actor_suggestions;
delete input._usage;

// ── Actor selection ───────────────────────────────────────────────────────────
const ACTOR = process.argv[2] || 'curious_coder~linkedin-search-scraper';
const URL = `https://api.apify.com/v2/acts/${ACTOR}/run-sync-get-dataset-items?token=${APIFY_TOKEN}`;

console.log(`▶  Actor:  ${ACTOR}`);
console.log(`▶  Queries: ${input.searchQueries.length}`);
console.log(`▶  Calling Apify...\n`);

try {
  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`❌  HTTP ${res.status} — ${body.slice(0, 500)}`);
    process.exit(1);
  }
  const items = await res.json();

  mkdirSync(join(__dir, 'output'), { recursive: true });
  const outPath = join(__dir, 'output/nc-recruiters.json');
  writeFileSync(outPath, JSON.stringify(items, null, 2));
  console.log(`✅  ${items.length} profiles written to output/nc-recruiters.json`);

  // Compact table
  console.log('\n── Top results ──');
  items.slice(0, 25).forEach((p, i) => {
    const name  = p.name || p.fullName || p.title || '?';
    const title = p.headline || p.position || p.subtitle || '';
    const loc   = p.location || p.locationName || '';
    const url   = p.url || p.profileUrl || p.link || '';
    console.log(`${String(i + 1).padStart(2)}.  ${name}  —  ${title.slice(0, 60)}  —  ${loc}`);
    if (url) console.log(`    ${url}`);
  });
} catch (err) {
  console.error(`❌  ${err.message}`);
  process.exit(1);
}
