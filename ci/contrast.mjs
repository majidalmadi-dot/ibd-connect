#!/usr/bin/env node
/* WCAG contrast audit across every theme in an app file.
 * Checks the text tokens (--txt, --muted, --faint) against surface tokens (--bg, --card, --card2).
 * AA thresholds: normal text 4.5:1. We treat --muted/--txt as normal text (must pass 4.5),
 * and --faint as de-emphasized/large (target >=3.0). Reports failures with the ratio.
 * Usage: node ci/contrast.mjs ../EoE/index.html
 */
import { readFileSync } from 'node:fs';
const file = process.argv[2];
if (!file) { console.error('pass a file'); process.exit(1); }
const html = readFileSync(file, 'utf8');

// pull the THEMES array block
const start = html.indexOf('const THEMES=');
const src = html.slice(start, start + 60000);

// each theme: {id:'x',en:'..',...vars:{'--bg':'#..',...}...}
const themes = [];
const re = /\{id:'([^']+)'[\s\S]*?vars:\{([^}]*)\}/g;
let m;
while ((m = re.exec(src))) {
  const id = m[1];
  const vars = {};
  for (const pair of m[2].matchAll(/'(--[a-z0-9-]+)':'([^']+)'/g)) vars[pair[1]] = pair[2];
  if (vars['--bg']) themes.push({ id, vars });
}

function hex2rgb(h){h=h.replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');const n=parseInt(h,16);return [(n>>16)&255,(n>>8)&255,n&255];}
function lum([r,g,b]){const a=[r,g,b].map(v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);});return 0.2126*a[0]+0.7152*a[1]+0.0722*a[2];}
function ratio(f,b){try{const L1=lum(hex2rgb(f)),L2=lum(hex2rgb(b));const hi=Math.max(L1,L2),lo=Math.min(L1,L2);return (hi+0.05)/(lo+0.05);}catch(e){return null;}}

const checks = [
  ['--txt','--bg',4.5],['--txt','--card',4.5],['--txt','--card2',4.5],
  ['--muted','--bg',4.5],['--muted','--card',4.5],['--muted','--card2',4.5],
  ['--faint','--card',3.0],['--faint','--bg',3.0],
];
let fails=0, total=0;
const failRows=[];
for (const th of themes){
  for (const [fg,bg,min] of checks){
    const f=th.vars[fg], b=th.vars[bg];
    if(!f||!b||!f.startsWith('#')||!b.startsWith('#')) continue;
    const r=ratio(f,b); if(r==null) continue; total++;
    if(r < min){ fails++; failRows.push(`  ${th.id.padEnd(14)} ${fg} on ${bg.padEnd(7)} = ${r.toFixed(2)} (need ${min})  ${f}/${b}`); }
  }
}
console.log(`Themes: ${themes.length} | checks: ${total} | FAILURES: ${fails}`);
if(failRows.length) console.log(failRows.join('\n'));
process.exit(0);
