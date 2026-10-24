/* SHARED MODULE — edit shared/backup-crypto.js, then run `node build.mjs`. Do not edit the generated copy inside an app file. */
/* E2E backup crypto: AES-GCM-256 with PBKDF2-SHA256 keys. v1 = 120k iterations (legacy, decrypt only), v2 = 600k iterations, blob prefixed 'v2:' (all new backups). The sync-id derivation is unchanged so existing cloud backups stay reachable. Per-app salts keep the three apps' backups isolated
   (same recovery code yields a different key + sync-id per app). @@APP@@ is substituted at build time — the salt
   strings must stay byte-identical to what shipped, or existing user backups become unreadable. */
async function deriveEncKey(code){const b=await _pbBase(code);return crypto.subtle.deriveKey({name:'PBKDF2',salt:new TextEncoder().encode('@@APP@@-sync-enc-v1'),iterations:120000,hash:'SHA-256'},b,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);}
async function deriveSyncId(code){const b=await _pbBase(code);const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt:new TextEncoder().encode('@@APP@@-sync-id-v1'),iterations:120000,hash:'SHA-256'},b,256);return Array.from(new Uint8Array(bits)).map(x=>x.toString(16).padStart(2,'0')).join('');}
async function encBlob(obj,key){const iv=crypto.getRandomValues(new Uint8Array(12));const ct=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,new TextEncoder().encode(JSON.stringify(obj)));return _sb64(iv)+'.'+_sb64(ct);}
async function decBlob(blob,key){const p=blob.split('.');const pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:_unb64(p[0])},key,_unb64(p[1]));return JSON.parse(new TextDecoder().decode(pt));}
var _encKeyV2={};
function deriveEncKeyV2(code){if(!_encKeyV2[code]){_encKeyV2[code]=_pbBase(code).then(b=>crypto.subtle.deriveKey({name:'PBKDF2',salt:new TextEncoder().encode('@@APP@@-sync-enc-v2'),iterations:600000,hash:'SHA-256'},b,{name:'AES-GCM',length:256},false,['encrypt','decrypt']));}return _encKeyV2[code];}
async function encBlobSecure(obj,code){return 'v2:'+await encBlob(obj,await deriveEncKeyV2(code));}
async function decBlobAuto(blob,code){if(blob.indexOf('v2:')===0)return decBlob(blob.slice(3),await deriveEncKeyV2(code));return decBlob(blob,await deriveEncKey(code));}
