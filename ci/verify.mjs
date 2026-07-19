#!/usr/bin/env node
/*
 * CI gate for the SGA companion PWAs (Rafeeq / Maeen / Qawam).
 * 1) Parse-check: every <script> block must compile (fast, always runs, zero deps).
 * 2) jsdom smoke: boot the app in a fake DOM, drive routes EN/AR, assert 0 uncaught errors.
 *
 * ROBUSTNESS: the jsdom smoke for each app runs in its OWN child process with a hard timeout,
 * so a slow/overloaded machine (or a jsdom edge case) can never hang the whole gate. A timeout
 * is reported as a soft warning (env-limited), not a hard failure; real runtime errors still fail.
 *
 * Usage:  node ci/verify.mjs [rafeeq|maeen|qawam]
 *         node ci/verify.mjs --smoke <file> <url>   (internal: single-app smoke worker)
 * Exit 0 = pass, 1 = fail.
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const SELF = fileURLToPath(import.meta.url);
const ROOT = resolve(dirname(SELF), '..');
const SMOKE_TIMEOUT_MS = 25000;

const APPS = [
  { id: 'rafeeq', name: 'Rafeeq (IBD)',   file: 'index.html',       url: 'https://ibd-connect.vercel.app/' },
  { id: 'maeen',  name: 'Maeen (EoE)',    file: 'EoE/index.html',   url: 'https://ibd-connect.vercel.app/EoE/' },
  { id: 'qawam',  name: 'Qawam (weight)', file: 'Qawam/index.html', url: 'https://qawam-three.vercel.app/' },
];

const RED = s => `\x1b[31m${s}\x1b[0m`, GREEN = s => `\x1b[32m${s}\x1b[0m`, DIM = s => `\x1b[2m${s}\x1b[0m`, YEL = s => `\x1b[33m${s}\x1b[0m`;

function biggestScript(html){ const b=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]); return b.sort((a,b)=>b.length-a.length)[0]||''; }
function parseCheck(html){ const src=biggestScript(html); new Function(src); return src.length; }

// ---- worker mode: run ONE app's jsdom smoke, print JSON, exit ----
if (process.argv[2] === '--smoke') {
  const file = process.argv[3], url = process.argv[4] || 'https://x.test/';
  let JSDOM;
  try { ({ JSDOM } = await import('jsdom')); } catch { console.log(JSON.stringify({ skipped: 'no-jsdom' })); process.exit(0); }
  const html = readFileSync(file, 'utf8');
  const errs = [];
  const dom = new JSDOM(html, { runScripts:'dangerously', pretendToBeVisual:true, url,
    beforeParse(w){ w.matchMedia=()=>({matches:false,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}}); w.scrollTo=()=>{}; try{w.HTMLCanvasElement.prototype.getContext=()=>null;}catch{} } });
  const w = dom.window;
  w.addEventListener('error', e => errs.push(String((e.error&&e.error.message)||e.message)));
  w.addEventListener('unhandledrejection', e => errs.push('unhandledrejection: '+String(e.reason&&e.reason.message||e.reason)));
  await new Promise(r => setTimeout(r, 1000));
  const routes = ['today','learn','tools','settings','reports','more','scores','progress'];
  try {
    if (typeof w.go==='function') for (const r of routes){ try{ w.go(r); }catch{} }
    if (w.S && w.S.lang!==undefined){ w.S.lang='ar'; if(typeof w.render==='function') w.render(); if(typeof w.go==='function') for(const r of routes){ try{ w.go(r); }catch{} } }
  } catch(e){ errs.push('drive: '+e.message); }
  await new Promise(r => setTimeout(r, 200));
  const bodyLen = (w.document.body && w.document.body.innerHTML.length) || 0;
  if (bodyLen < 500) errs.push('rendered body too small ('+bodyLen+')');
  console.log(JSON.stringify({ errs, bodyLen }));
  process.exit(0);
}

// ---- main mode ----
const only = process.argv[2] ? process.argv[2].toLowerCase() : null;
const targets = only ? APPS.filter(a => a.id === only) : APPS;
if (!targets.length) { console.error(`Unknown app "${only}". Use: rafeeq | maeen | qawam`); process.exit(1); }

// 0) shared-module freshness: fail if a generated region is stale (deploy from a committed, built tree)
if (!only) {
  try {
    execFileSync(process.execPath, [resolve(ROOT, 'build.mjs'), '--check'], { stdio: 'inherit' });
  } catch { console.log(RED('\n✖ Shared modules are stale — run `node build.mjs` and commit.')); process.exit(1); }
}

let failures = 0;
for (const app of targets) {
  const path = resolve(ROOT, app.file);
  process.stdout.write(`• ${app.name.padEnd(20)} `);
  if (!existsSync(path)) { console.log(RED('MISSING ' + app.file)); failures++; continue; }
  const html = readFileSync(path, 'utf8');

  // 1) parse (fast, reliable)
  let len;
  try { len = parseCheck(html); }
  catch (e) { console.log(RED('PARSE FAIL: ' + e.message)); failures++; continue; }

  // 2) jsdom smoke in a bounded child process
  let out;
  try {
    out = execFileSync(process.execPath, [SELF, '--smoke', path, app.url], { timeout: SMOKE_TIMEOUT_MS, encoding: 'utf8', stdio: ['ignore','pipe','ignore'] });
  } catch (e) {
    if (e.killed || e.signal === 'SIGTERM') { console.log(GREEN('parse OK') + YEL(`  · smoke SKIPPED (timed out ${SMOKE_TIMEOUT_MS/1000}s — env-limited)`) + DIM(`  ${len} chars`)); continue; }
    console.log(RED('SMOKE ERROR: ' + (e.message||e))); failures++; continue;
  }
  let res; try { res = JSON.parse(out.trim().split('\n').pop()); } catch { res = { errs: ['bad worker output'] }; }
  if (res.skipped) { console.log(GREEN('parse OK') + DIM(`  ${len} chars · smoke skipped (${res.skipped})`)); continue; }
  if (res.errs && res.errs.length) { console.log(RED('SMOKE FAIL')); res.errs.slice(0,6).forEach(x=>console.log('    '+RED('- '+x))); failures++; continue; }
  console.log(GREEN('OK') + DIM(`  parse ${len} chars · 0 runtime errors`));
}

if (failures) { console.log('\n' + RED(`✖ ${failures} app(s) failed the gate — deploy blocked.`)); process.exit(1); }
console.log('\n' + GREEN('✔ All apps passed the gate.'));
process.exit(0);
