#!/usr/bin/env node
/*
 * De-triplication build step.
 *
 * The three companion PWAs (Rafeeq / Maeen / Qawam) share code. To stop maintaining three
 * divergent copies, shared modules live once in shared/ and are STAMPED into each app in place,
 * inside sentinel regions, so the deployed file stays a single self-contained HTML file.
 *
 * Sentinel convention — in an app's index.html:
 *     //<<GEN name>>
 *     ...generated content (do not edit by hand)...
 *     //<</GEN name>>
 * build.mjs replaces everything between the sentinels with shared/<name>.js, after substituting
 * per-app tokens (@@APP@@, @@RELEASE@@, ...). RELEASE is read from each app's service worker so the
 * Sentry release tag always matches the shipped cache version.
 *
 * Usage:  node build.mjs            # build all apps
 *         node build.mjs --check    # verify apps are up to date (non-zero exit if stale) — for CI
 * Idempotent: running twice makes no further changes.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const ROOT = dirname(fileURLToPath(import.meta.url));
const CHECK = process.argv.includes('--check');

// Which shared modules each app includes, and the app's tokens.
// RELEASE is derived from the app's service-worker cache name at build time.
const APPS = [
  { id: 'rafeeq', file: 'index.html',       sw: 'sw.js',       tokens: { APP: 'rafeeq' }, modules: [] },
  { id: 'maeen',  file: 'EoE/index.html',   sw: 'EoE/sw.js',   tokens: { APP: 'maeen'  }, modules: ['telemetry'] },
  { id: 'qawam',  file: 'Qawam/index.html', sw: 'Qawam/sw.js', tokens: { APP: 'qawam'  }, modules: ['telemetry'] },
];

const RED = s => `\x1b[31m${s}\x1b[0m`, GREEN = s => `\x1b[32m${s}\x1b[0m`, DIM = s => `\x1b[2m${s}\x1b[0m`, YEL = s => `\x1b[33m${s}\x1b[0m`;

function swVersion(swPath) {
  try { const m = readFileSync(swPath, 'utf8').match(/'([a-z-]+-v\d+)'/); return m ? m[1] : ''; } catch { return ''; }
}
function loadModule(name, tokens) {
  const p = resolve(ROOT, 'shared', name + '.js');
  let src = readFileSync(p, 'utf8').replace(/\s+$/, '');
  for (const [k, v] of Object.entries(tokens)) src = src.split('@@' + k + '@@').join(v);
  return src;
}
function stamp(html, name, content) {
  const open = `//<<GEN ${name}>>`, close = `//<</GEN ${name}>>`;
  const re = new RegExp(escapeRe(open) + '[\\s\\S]*?' + escapeRe(close));
  if (!re.test(html)) return { html, found: false };
  return { html: html.replace(re, open + '\n' + content + '\n' + close), found: true };
}
function escapeRe(s){ return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

let changed = 0, stale = 0, missing = 0;
for (const app of APPS) {
  if (!app.modules.length) continue;
  const fp = resolve(ROOT, app.file);
  if (!existsSync(fp)) { console.log(`${RED('MISSING')} ${app.file}`); missing++; continue; }
  let html = readFileSync(fp, 'utf8');
  const before = html;
  const release = swVersion(resolve(ROOT, app.sw));
  const tokens = { ...app.tokens, RELEASE: release };
  const results = [];
  for (const name of app.modules) {
    const content = loadModule(name, tokens);
    const r = stamp(html, name, content);
    html = r.html;
    results.push(name + (r.found ? '✓' : RED('✗ no sentinels')));
    if (!r.found) missing++;
  }
  if (html !== before) {
    if (CHECK) { console.log(`${YEL('STALE')} ${app.id.padEnd(7)} ${results.join(' ')}  (release ${release})`); stale++; }
    else { writeFileSync(fp, html); console.log(`${GREEN('built')} ${app.id.padEnd(7)} ${results.join(' ')}  ${DIM('(release ' + release + ')')}`); changed++; }
  } else {
    console.log(`${DIM('ok')}    ${app.id.padEnd(7)} ${results.join(' ')}  ${DIM('(release ' + release + ')')}`);
  }
}

if (missing) { console.log('\n' + RED(`✖ ${missing} sentinel/file problem(s).`)); process.exit(1); }
if (CHECK && stale) { console.log('\n' + RED(`✖ ${stale} app(s) out of date — run \`node build.mjs\`.`)); process.exit(1); }
console.log('\n' + GREEN(CHECK ? '✔ All apps up to date.' : `✔ Build complete (${changed} updated).`));
process.exit(0);
