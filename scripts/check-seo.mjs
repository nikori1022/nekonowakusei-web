// ビルド後のSEOチェック: npm run build && npm run check:seo
// title/description/canonical/h1/JSON-LD/内部リンク切れ を全ページで確認する
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const BASE = (process.env.BASE_PATH ?? '/').replace(/\/$/, '');
const files = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.html') && !/google[0-9a-f]+\.html$/.test(f)) files.push(p);
  }
})(DIST);

let problems = 0;
const titles = new Map();
const fail = (f, msg) => { problems++; console.log(`✗ ${f}: ${msg}`); };

for (const f of files) {
  const html = readFileSync(f, 'utf8');
  // noindex のページ（記事チェック用アプリなど）は検索に出さないので対象外
  if (/<meta name="robots" content="noindex/.test(html)) continue;
  // 転送用ページ（astro.config の redirects）は中身がないので対象外
  if (/<meta http-equiv="refresh"/.test(html)) continue;
  const is404 = f.endsWith('404.html');
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  const desc = html.match(/<meta name="description" content="(.*?)"/)?.[1];
  if (!title) fail(f, 'title がない');
  else if (titles.has(title)) fail(f, `title が ${titles.get(title)} と重複`);
  else titles.set(title, f);
  if (title && title.length > 60) fail(f, `title が長い (${title.length}文字)`);
  if (!desc) fail(f, 'description がない');
  else if (desc.length < 50 || desc.length > 160) fail(f, `description の長さ ${desc.length}文字`);
  if (!html.includes('rel="canonical"')) fail(f, 'canonical がない');
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) fail(f, `h1 が ${h1} 個`);
  for (const m of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
    try { JSON.parse(m[1]); } catch { fail(f, 'JSON-LD が壊れている'); }
  }
  for (const m of html.matchAll(/<img(?![^>]*\salt[\s=>])/g)) fail(f, 'alt のない img');
  if (is404) continue;
  for (const m of html.matchAll(/href="([^"#]*?)(#[^"]*)?"/g)) {
    let href = m[1];
    if (!href || /^(https?:|mailto:)/.test(href)) continue;
    if (!href.startsWith('/')) href = new URL(href, `http://x${BASE}/${f.slice(DIST.length + 1).replace(/index\.html$/, '')}`).pathname;
    if (!href.startsWith(BASE)) { fail(f, `base なしのリンク ${href}`); continue; }
    const rel = href.slice(BASE.length) || '/';
    const target = join(DIST, rel.endsWith('/') ? `${rel}index.html` : rel);
    if (!existsSync(target)) fail(f, `リンク切れ ${href}`);
  }
}
console.log(`\n${files.length} ページを確認、問題 ${problems} 件`);
process.exit(problems ? 1 : 0);
