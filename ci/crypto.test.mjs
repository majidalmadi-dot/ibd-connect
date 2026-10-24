// Tests the backup crypto + recovery code exactly as shipped in each app (extracted from the built HTML).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { webcrypto } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
for (const file of ['index.html', 'EoE/index.html', 'Qawam/index.html']) {
  const html = readFileSync(resolve(ROOT, file), 'utf8');
  const gen = html.match(/\/\/<<GEN backup-crypto>>([\s\S]*?)\/\/<<\/GEN backup-crypto>>/)[1];
  const helpers = ['_sb64', '_unb64', '_pbBase', 'genRecoveryCode'].map(n => html.match(new RegExp('function ' + n + '\\([^\\n]*'))[0]).join('\n');
  const ctx = vm.createContext({ crypto: webcrypto, TextEncoder, TextDecoder, btoa, atob, Uint8Array, JSON, Array, String, Math });
  vm.runInContext(helpers + '\n' + gen + '\nthis.api={genRecoveryCode,deriveEncKey,encBlob,decBlob,encBlobSecure,decBlobAuto,deriveSyncId};', ctx);
  const api = ctx.api;

  test(`${file}: recovery code is well-formed and unique`, () => {
    const seen = new Set();
    for (let i = 0; i < 500; i++) {
      const c = api.genRecoveryCode();
      assert.match(c, /^[A-HJ-NP-Z2-9]{4}(-[A-HJ-NP-Z2-9]{4}){5}$/);
      seen.add(c);
    }
    assert.equal(seen.size, 500);
  });

  test(`${file}: recovery code does not use Math.random`, () => {
    assert.ok(!/Math\.random/.test(html.match(/function genRecoveryCode\([^\n]*/)[0]));
  });

  test(`${file}: v2 round trip, wrong code fails, blob is v2`, async () => {
    const code = api.genRecoveryCode();
    const blob = await api.encBlobSecure({ a: 1, note: 'x' }, code);
    assert.ok(blob.startsWith('v2:'));
    assert.deepEqual(JSON.parse(JSON.stringify(await api.decBlobAuto(blob, code))), { a: 1, note: 'x' });
    await assert.rejects(api.decBlobAuto(blob, api.genRecoveryCode()));
  });

  test(`${file}: legacy v1 backups still restore`, async () => {
    const code = 'ABCD-EFGH-JKLM-NPQR-STUV-WXYZ';
    const v1 = await api.encBlob({ legacy: true }, await api.deriveEncKey(code));
    assert.ok(!v1.startsWith('v2:'));
    assert.deepEqual(JSON.parse(JSON.stringify(await api.decBlobAuto(v1, code))), { legacy: true });
  });

  test(`${file}: sync id unchanged by the v2 migration (deterministic, 64 hex)`, async () => {
    const id = await api.deriveSyncId('ABCD-EFGH-JKLM-NPQR-STUV-WXYZ');
    assert.match(id, /^[0-9a-f]{64}$/);
    assert.equal(id, await api.deriveSyncId('ABCD-EFGH-JKLM-NPQR-STUV-WXYZ'));
  });
}
