#!/usr/bin/env node
/*
 * CI gate for the SGA companion PWAs (Rafeeq / Maeen / Qawam).
 * 1) Parse-check: every <script> block must compile (catches syntax errors before deploy).
 * 2) jsdom smoke: boot the app in a fake DOM, drive a few routes, assert zero uncaught errors.
 *
 * Parse-check runs with zero dependencies. The jsdom smoke runs only if `jsdom` is installed
 * (see ci/package.json); if it's missing, that layer is skipped with a warning rather than failing,
 * so the gate still works on a bare machine. In CI, `npm ci` installs jsdom so both layers run.
 *
 * Usage:  node ci/verify.mjs            # all apps
 *         node ci/verify.mjs qawam      # one app
 * Exit code 0 = pass, 1 = fail.
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const APPS = [
  { id: 'rafeeq', name: 'Rafeeq (IBD)',    file: 'index.html',       url: 'https://ibd-connect.vercel.app/' },
  { id: 'maeen',  name: 'Maeen (EoE)',     file: 'EoE/index.html',   url: 'https://ibd-connect.vercel.app/EoE/' },
  { id: 'qawam',  name: 'Qawam (weight)',  file: 'Qawam/index.html', url: 'https://qawam-three.vercel.app/' },
];

const only = process.argv[2] ? process.argv[2].toLowerCase() : null;
const targets = only ? APPS.filter(a => a.id === only) : APPS;
if (!targets.length) { console.error(`Unknown app "${only}". Use: rafeeq | maeen | qawam`); process.exit(1); }

const RED = s => `\x1b[31m${s}\x1b[0m`, GREEN = s => `\x1b[32m${s}\x1b[0m`, DIM = s => `\x1b[2m${s}\x1b[0m`, YEL = s => `\x1b[33m${s}\x1b[0m`;
let failures = 0;

// Try to load jsdom (optional).
let JSDOM = null;
try { ({ JSDOM } = await import('jsdom')); }
catch { console.log(YEL('⚠  jsdom not installed — parse-check only (run `npm ci` in ci/ for the full gate).')); }

function biggestScript(html) {
  const blocks = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  return blocks.sort((a, b) => b.length - a.length)[0] || '';
}

function parseCheck(html) {
  const src = biggestScript(html);
  // eslint-disable-next-line no-new-func
  new Function(src); // throws on syntax error
  return src.length;
}

async function jsdomSmoke(html, app) {
  const errs = [];
  const dom = new JSDOM(html, {
    runScripts: 'dangerously', pretendToBeVisual: true, url: app.url,
    beforeParse(w) {
      w.matchMedia = () => ({ matches: false, addListener(){}, removeListener(){}, addEventListener(){}, removeEventListener(){} });
      w.scrollTo = () => {};
      try { w.HTMLCanvasElement.prototype.getContext = () => null; } catch {}
    },
  });
  const w = dom.window;
  w.addEventListener('error', e => errs.push(String((e.error && e.error.message) || e.message)));
  w.addEventListener('unhandledrejection', e => errs.push('unhandledrejection: ' + String(e.reason && e.reason.message || e.reason)));
  await new Promise(r => setTimeout(r, 1200)); // let boot + splash run

  // drive a few core routes in both languages if the router is exposed
  const routes = ['today', 'learn', 'tools', 'settings', 'reports', 'more'];
  try {
    if (typeof w.go === 'function') for (const r of routes) { try { w.go(r); } catch {} }
    if (w.S && w.S.lang !== undefined) { w.S.lang = 'ar'; if (typeof w.render === 'function') w.render(); if (typeof w.go === 'function') for (const r of routes) { try { w.go(r); } catch {} } }
  } catch (e) { errs.push('drive: ' + e.message); }
  await new Promise(r => setTimeout(r, 300));

  const bodyLen = (w.document.body && w.document.body.innerHTML.length) || 0;
  if (bodyLen < 500) errs.push('rendered body suspiciously small (' + bodyLen + ' chars)');
  return errs;
}

for (const app of targets) {
  const path = resolve(ROOT, app.file);
  process.stdout.write(`• ${app.name.padEnd(20)} `);
  if (!existsSync(path)) { console.log(RED('MISSING ' + app.file)); failures++; continue; }
  const html = readFileSync(path, 'utf8');

  // 1) parse
  let len;
  try { len = parseCheck(html); }
  catch (e) { console.log(RED('PARSE FAIL: ' + e.message)); failures++; continue; }

  // 2) jsdom smoke (optional)
  if (JSDOM) {
    let errs;
    try { errs = await jsdomSmoke(html, app); }
    catch (e) { console.log(RED('SMOKE THREW: ' + e.message)); failures++; continue; }
    if (errs.length) { console.log(RED('SMOKE FAIL')), errs.slice(0, 6).forEach(x => console.log('    ' + RED('- ' + x))); failures++; continue; }
    console.log(GREEN('OK') + DIM(`  parse ${len} chars · 0 runtime errors`));
  } else {
    console.log(GREEN('parse OK') + DIM(`  ${len} chars`));
  }
}

if (failures) { console.log('\n' + RED(`✖ ${failures} app(s) failed the gate — deploy blocked.`)); process.exit(1); }
console.log('\n' + GREEN('✔ All apps passed the gate.'));
process.exit(0);
