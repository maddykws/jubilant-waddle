/**
 * scrape-dice.mjs
 * Scrapes Dice.com job listings via Apify and appends new matches to data/pipeline.md
 *
 * Usage:
 *   node scrape-dice.mjs                    # default: AI/ML roles, last 3 days
 *   node scrape-dice.mjs --dry-run          # preview matches without writing
 *   node scrape-dice.mjs --days 7           # override freshness window
 *   node scrape-dice.mjs --limit 100        # override max results per query
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Config ────────────────────────────────────────────────────────────────────

const APIFY_TOKEN = (() => {
  try {
    const yaml = readFileSync(join(__dirname, 'config/profile.yml'), 'utf8');
    const match = yaml.match(/token:\s*"([^"]+)"/);
    return match ? match[1] : null;
  } catch { return null; }
})();

if (!APIFY_TOKEN) {
  console.error('❌ No Apify token found in config/profile.yml (apify.token)');
  process.exit(1);
}

// Apify actor for Dice.com — uses web scraping
const ACTOR_ID = 'worldunboxer/dice-jobs-scraper';
const PIPELINE_PATH  = join(__dirname, 'data/pipeline.md');
const HISTORY_PATH   = join(__dirname, 'data/scan-history.tsv');
const TRACKER_PATH   = join(__dirname, 'data/applications.md');

// ── Args ──────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const DRY_RUN    = args.includes('--dry-run');
const MAX_RESULTS = (() => { const i = args.indexOf('--limit'); return i !== -1 ? parseInt(args[i+1]) : 100; })();
const DAYS        = (() => { const i = args.indexOf('--days');  return i !== -1 ? parseInt(args[i+1]) : 3; })();

// ── Search Queries ─────────────────────────────────────────────────────────────

const SEARCH_QUERIES = [
  { q: 'AI Engineer',                l: 'New York, NY' },
  { q: 'Senior AI Engineer',         l: 'New York, NY' },
  { q: 'Staff AI Engineer',          l: 'United States' },
  { q: 'LLM Engineer',               l: 'United States' },
  { q: 'Generative AI Engineer',     l: 'United States' },
  { q: 'Applied AI Engineer',        l: 'United States' },
  { q: 'ML Engineer',                l: 'New York, NY' },
  { q: 'Senior ML Engineer',         l: 'United States' },
  { q: 'MLOps Engineer',             l: 'United States' },
  { q: 'LLMOps Engineer',            l: 'United States' },
  { q: 'Agentic AI Engineer',        l: 'United States' },
  { q: 'AI Research Engineer',       l: 'United States' },
  { q: 'Machine Learning Engineer',  l: 'New York, NY' },
];

// ── Filters ───────────────────────────────────────────────────────────────────

const TITLE_BLOCKLIST = [
  'intern', 'internship', 'co-op', 'new grad', 'entry level', 'junior',
  'director', 'vp ', 'vice president', 'head of', 'data scientist',
  'data analyst', 'data engineer', 'frontend', 'android', 'ios', 'mobile',
  'devops', 'hardware', 'robotics', 'computer vision', 'autonomous driving',
  'salesforce', '.net', 'sap ', 'cobol', 'mainframe',
];

const TITLE_ALLOWLIST = [
  'ai engineer', 'ml engineer', 'machine learning engineer', 'llm',
  'applied ai', 'generative ai', 'genai', 'ai platform', 'mlops',
  'llmops', 'ai/ml', 'ai software', 'ai research', 'staff ai',
  'agentic', 'large language', 'nlp engineer', 'applied ml',
];

function titleMatches(title) {
  const t = title.toLowerCase();
  if (TITLE_BLOCKLIST.some(b => t.includes(b))) return false;
  return TITLE_ALLOWLIST.some(a => t.includes(a));
}

// ── Dedup ─────────────────────────────────────────────────────────────────────

function loadSeenUrls() {
  const seen = new Set();
  [HISTORY_PATH, PIPELINE_PATH, TRACKER_PATH].forEach(path => {
    if (!existsSync(path)) return;
    readFileSync(path, 'utf8').split('\n').forEach(line => {
      const m = line.match(/https?:\/\/[^\s|>)\]]+/);
      if (m) seen.add(m[0].trim().replace(/\/$/, ''));
    });
  });
  return seen;
}

// ── Apify helpers ─────────────────────────────────────────────────────────────

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function apifyPost(path, body) {
  const res = await fetch(`https://api.apify.com/v2${path}?token=${APIFY_TOKEN}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Apify POST ${path} → ${res.status}: ${await res.text()}`);
  return res.json();
}

async function apifyGet(path) {
  const res = await fetch(`https://api.apify.com/v2${path}?token=${APIFY_TOKEN}`);
  if (!res.ok) throw new Error(`Apify GET ${path} → ${res.status}: ${await res.text()}`);
  return res.json();
}

async function pollRun(runId, intervalMs = 5000, timeoutMs = 300000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const run = await apifyGet(`/actor-runs/${runId}`);
    const status = run.data?.status;
    if (status === 'SUCCEEDED') return run.data;
    if (['FAILED', 'ABORTED', 'TIMED-OUT'].includes(status)) {
      throw new Error(`Apify run ${runId} ended: ${status}`);
    }
    process.stdout.write(`  [poll] ${status}...\r`);
    await sleep(intervalMs);
  }
  throw new Error(`Apify run timed out after ${timeoutMs / 1000}s`);
}

// ── Pipeline writer ───────────────────────────────────────────────────────────

function appendToPipeline(entries) {
  if (entries.length === 0) return 0;
  const existing = existsSync(PIPELINE_PATH) ? readFileSync(PIPELINE_PATH, 'utf8') : '';
  const newLines = entries.map(e =>
    `- [ ] ${e.url}  <!-- ${e.title} @ ${e.company} · Dice · ${e.location} -->`
  );
  if (!DRY_RUN) {
    writeFileSync(PIPELINE_PATH, existing.trimEnd() + '\n' + newLines.join('\n') + '\n');
  }
  return newLines.length;
}

function appendToHistory(entries, status = 'added') {
  if (DRY_RUN || entries.length === 0) return;
  const date = new Date().toISOString().slice(0, 10);
  const lines = entries.map(e =>
    `${e.url}\t${date}\tDice — ${e.query}\t${e.title}\t${e.company}\t${status}`
  ).join('\n') + '\n';
  const existing = existsSync(HISTORY_PATH) ? readFileSync(HISTORY_PATH, 'utf8') : 'url\tfirst_seen\tportal\ttitle\tcompany\tstatus\n';
  writeFileSync(HISTORY_PATH, existing + lines);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🎲 scrape-dice.mjs');
  console.log(`   Actor : ${ACTOR_ID}`);
  console.log(`   Days  : ${DAYS} | Max : ${MAX_RESULTS}/query | Dry-run: ${DRY_RUN}\n`);

  const seenUrls = loadSeenUrls();
  let totalFound = 0, totalNew = 0, totalSkipped = 0;
  const allNew = [];

  for (const { q, l } of SEARCH_QUERIES) {
    console.log(`🔍 "${q}" in ${l}`);
    try {
      // Start Apify actor run
      const posted_date = DAYS <= 1 ? 'ONE' : DAYS <= 3 ? 'THREE' : DAYS <= 7 ? 'SEVEN' : 'ANY';
      const { data: runData } = await apifyPost(`/acts/${encodeURIComponent(ACTOR_ID)}/runs`, {
        keyword: q,
        location: l,
        job_entries: MAX_RESULTS,
        posted_date,
        work_settings: [],
        employment_type: [],
        willing_to_sponsor: false,
      });

      const runId = runData.id;
      const run = await pollRun(runId);
      const datasetId = run.defaultDatasetId;
      const result = await apifyGet(`/datasets/${datasetId}/items?limit=500`);
      const items = result.items ?? result.data?.items ?? [];

      totalFound += items.length;
      const queryNew = [];

      for (const item of items) {
        const title    = item.title || item.jobTitle || '';
        const company  = item.company || item.companyName || 'Unknown';
        const location = item.location || item.jobLocation || l;
        const url      = item.url || item.jobUrl || item.applyUrl || '';

        if (!url || !titleMatches(title)) { totalSkipped++; continue; }

        const cleanUrl = url.trim().replace(/\/$/, '');
        if (seenUrls.has(cleanUrl)) { totalSkipped++; continue; }

        seenUrls.add(cleanUrl);
        queryNew.push({ url: cleanUrl, title, company, location, query: q });
        totalNew++;
      }

      if (queryNew.length > 0) {
        console.log(`   ✅ ${queryNew.length} new: ${queryNew.map(e => e.company).join(', ')}`);
        allNew.push(...queryNew);
      } else {
        console.log(`   — no new matches`);
      }
    } catch (err) {
      console.error(`   ❌ Error: ${err.message}`);
    }
  }

  // Write results
  const added = appendToPipeline(allNew);
  appendToHistory(allNew, 'added');

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Dice.com Scan — ${new Date().toISOString().slice(0, 10)}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Queries run   : ${SEARCH_QUERIES.length}`);
  console.log(`Results found : ${totalFound}`);
  console.log(`Skipped       : ${totalSkipped} (filtered / dup)`);
  console.log(`New → pipeline: ${added}`);
  if (DRY_RUN) console.log(`\n⚠️  Dry-run mode — nothing written`);
  if (allNew.length > 0) {
    console.log('\nNew offers:');
    allNew.forEach(e => console.log(`  + ${e.company} | ${e.title} | ${e.location}`));
  }
  console.log('\n→ Run /career-ops pipeline to evaluate new offers.\n');
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
