// テン・ムギの写真アーカイブ（非公開リポジトリ nekonowakusei-photos）から記事用の写真を扱う。
//
//  一覧画像を作る（番号つきのサムネイルを並べた画像。写真選びに使う）
//    node scripts/photos.mjs sheet <写真フォルダ> <開始番号> [枚数=24] [出力=/tmp/sheet.jpg]
//
//  記事用に取り込む（長辺1600px・位置情報などのメタデータ削除・向き補正）
//    node scripts/photos.mjs add <写真フォルダ> <番号> <保存名>
//    → src/assets/cats/mag/<保存名>.jpg
import sharp from 'sharp';
import { readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const [cmd, dir, a, b, c] = process.argv.slice(2);
const list = () => readdirSync(dir).filter((f) => /\.jpe?g$/i.test(f)).sort();
const byNum = (n) => list().find((f) => f.startsWith(String(n).padStart(4, '0') + '_'));

if (cmd === 'sheet') {
  const start = Number(a);
  const count = Number(b ?? 24);
  const out = c ?? '/tmp/sheet.jpg';
  const files = list().filter((f) => Number(f.slice(0, 4)) >= start).slice(0, count);
  const W = 300, H = 300, COLS = 6;
  const tiles = await Promise.all(files.map(async (f, i) => {
    const img = await sharp(join(dir, f)).rotate().resize(W, H, { fit: 'cover' }).toBuffer();
    const label = Buffer.from(`<svg width="${W}" height="${H}"><rect x="0" y="0" width="74" height="34" fill="#000" opacity=".7"/><text x="8" y="25" font-size="24" font-family="sans-serif" fill="#fff">${f.slice(0, 4)}</text></svg>`);
    const tile = await sharp(img).composite([{ input: label }]).toBuffer();
    return { input: tile, left: (i % COLS) * W, top: Math.floor(i / COLS) * H };
  }));
  const rows = Math.ceil(files.length / COLS);
  await sharp({ create: { width: COLS * W, height: rows * H, channels: 3, background: '#fff' } }).composite(tiles).jpeg({ quality: 70 }).toFile(out);
  console.log(`${out}（${files[0]?.slice(0, 4)}〜${files.at(-1)?.slice(0, 4)}、${files.length}枚）`);
} else if (cmd === 'add') {
  const f = byNum(a);
  if (!f) throw new Error(`番号 ${a} の写真が見つかりません`);
  const outDir = 'src/assets/cats/mag';
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  const out = join(outDir, `${b}.jpg`);
  // sharp は withMetadata() を呼ばない限りEXIF（撮影位置など）を書き出さない
  await sharp(join(dir, f)).rotate().resize(1600, 1600, { fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 80, mozjpeg: true }).toFile(out);
  console.log(`${f} → ${out}`);
} else {
  console.log('使い方: node scripts/photos.mjs sheet|add ...（ファイル先頭のコメント参照）');
}
