// マガジン記事の「AI臭さ」と品質の機械チェック。
// 使い方: node scripts/lint-articles.mjs [ファイル...]（省略時は全記事。ただしエラー扱いは --since 以降の記事だけ）
//   --since=2026-11-14 … この日以降に公開の記事だけを厳しくチェック（古い記事は警告のみ）
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'src/content/articles';
const args = process.argv.slice(2);
const since = new Date((args.find((a) => a.startsWith('--since=')) ?? '--since=2026-11-14').slice(8));
const files = args.filter((a) => !a.startsWith('--'));
const targets = files.length ? files : readdirSync(DIR).filter((f) => f.endsWith('.md')).map((f) => join(DIR, f));

// AIっぽさが出やすい言い回し（見つけたら書き直す）
const BANNED = [
  ['いかがでしたか', '締めの定型句'],
  ['いかがでしたでしょうか', '締めの定型句'],
  ['ご紹介しました', '締めの定型句'],
  ['ご紹介します', '前置きの定型句'],
  ['について解説します', '前置きの定型句'],
  ['について見ていきましょう', '前置きの定型句'],
  ['見ていきましょう', '前置きの定型句'],
  ['この記事では', '前置きの定型句'],
  ['本記事では', '前置きの定型句'],
  ['まとめると', '要約の定型句'],
  ['結論から言うと', '定型句'],
  ['重要なポイント', '空っぽの強調'],
  ['ポイントは以下', '定型句'],
  ['以下の通りです', '定型句'],
  ['さまざまな', '中身のない言葉（具体例に置き換える）'],
  ['様々な', '中身のない言葉（具体例に置き換える）'],
  ['多岐にわたる', '中身のない言葉'],
  ['欠かせません', '決まり文句'],
  ['と言えるでしょう', 'ぼかし'],
  ['ではないでしょうか', 'ぼかし'],
  ['かもしれませんね', 'ぼかし'],
  ['ことが大切です', '説教くさい締め'],
  ['ことが重要です', '説教くさい締め'],
  ['しっかりと', '水増し'],
  ['ぜひ参考にしてください', '締めの定型句'],
  ['参考になれば幸いです', '締めの定型句'],
  ['素敵な', '決まり文句'],
  ['癒し', '決まり文句（具体的な様子を書く）'],
  ['愛くるしい', '決まり文句'],
  ['〜', '波ダッシュの多用'],
  ['：', '見出し以外の全角コロンは箇条書き風になりがち'],
];
const MAX_COLON = 4; // 全角コロンは箇条書きで少しなら使ってよい

let errors = 0;
let warnings = 0;

for (const file of targets) {
  const raw = readFileSync(file, 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) { report(file, true, 'frontmatter が読めません'); continue; }
  const [, fm, body] = m;
  const published = new Date((fm.match(/^published:\s*(\S+)/m) ?? [])[1]);
  const strict = published >= since;
  const out = [];
  const add = (msg) => out.push(msg);

  const text = body.replace(/```[\s\S]*?```/g, '').replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
  const plain = text.replace(/^#+ .*$/gm, '').replace(/[#*>\-|`]/g, '');

  // 1. 禁止フレーズ
  for (const [w, why] of BANNED) {
    const n = plain.split(w).length - 1;
    if (w === '：') { if (n > MAX_COLON) add(`「：」が${n}回（${why}）`); continue; }
    if (w === '〜') { const k = (plain.match(/(?<![0-9０-９])〜|〜(?![0-9０-９])/g) ?? []).length; if (k) add(`「〜」×${k}（${why}。30〜38℃のような数字の範囲はOK）`); continue; }
    if (n) add(`「${w}」×${n}（${why}）`);
  }

  // 2. 文末の単調さ（同じ文末が4回以上連続）
  const sentences = plain.split(/(?<=[。！？])/).map((s) => s.trim()).filter((s) => s.length > 4);
  const ending = (s) => s.replace(/[。！？]$/, '').slice(-2);
  let run = 1;
  for (let i = 1; i < sentences.length; i++) {
    run = ending(sentences[i]) === ending(sentences[i - 1]) ? run + 1 : 1;
    if (run === 4) add(`文末「${ending(sentences[i])}」が4文以上続いています：「${sentences[i].slice(0, 20)}…」`);
  }

  // 3. 「！」の多用
  const bang = (plain.match(/[！!]/g) ?? []).length;
  if (bang > 3) add(`「！」が${bang}回（3回まで）`);

  // 4. 分量（本文の文字数）
  const len = plain.replace(/\s/g, '').length;
  if (len < 1500) add(`本文が${len}文字（1500文字以上）`);

  // 5. 出典
  const sources = (fm.match(/^\s+- name:/gm) ?? []).length;
  const category = (fm.match(/^category:\s*(\S+)/m) ?? [])[1];
  if (category !== '就労支援' && sources < 2) add(`出典が${sources}件（2件以上）`);

  // 6. 写真
  if (!/^cover:/m.test(fm)) add('表紙写真（cover）がありません');
  if (/^cover:/m.test(fm) && !/^coverAlt:\s*\S/m.test(fm)) add('coverAlt（写真の説明）がありません');
  for (const [, alt] of body.matchAll(/!\[([^\]]*)\]\([^)]*\)/g)) if (alt.trim().length < 6) add('本文の写真に説明（alt）がありません');

  // 7. テン・ムギが登場するか（施設の記事らしさ）
  if (!/テン|ムギ/.test(plain)) add('テンかムギが一度も出てきません（施設の実体験を1つ入れる）');

  // 8. 見出しの数
  const h2 = (body.match(/^## /gm) ?? []).length;
  if (h2 < 3) add(`見出し（##）が${h2}個（3個以上）`);

  for (const msg of out) report(file, strict, msg);
}

function report(file, strict, msg) {
  if (strict) errors++; else warnings++;
  console.log(`${strict ? '✗' : '△'} ${file}: ${msg}`);
}

console.log(`\nマガジンチェック: エラー ${errors} / 警告 ${warnings}（${since.toISOString().slice(0, 10)}以降の記事はエラー扱い）`);
process.exit(errors ? 1 : 0);
