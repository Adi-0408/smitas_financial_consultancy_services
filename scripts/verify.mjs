import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync('src/App.jsx', 'utf8');
const assets = [...new Set([...source.matchAll(/['"](assets\/[^'"\s]+)['"]/g)].map(m => m[1]))];
for (const asset of assets) assert.ok(fs.existsSync(`public/${asset}`), `Missing deployed asset: ${asset}`);
for (const id of ['services', 'schemes', 'gallery', 'calculators', 'payment', 'reviews']) {
  assert.ok(source.includes(`id="${id}"`), `Missing section: ${id}`);
}
assert.ok(!source.includes('data-lucide'), 'Legacy icon placeholders remain');
console.log(`Verified ${assets.length} deployed asset references and six section anchors. Run npm run build separately.`);
