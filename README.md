# 保護猫施設 ねこの惑星 公式サイト

北九州・小倉の保護猫施設「ねこの惑星」のWebサイト。Astro製の静的サイトで、GitHub Pagesに自動デプロイされる。

## よく使うコマンド

| コマンド | 内容 |
|---|---|
| `npm install` | 初回セットアップ |
| `npm run dev` | 手元で確認（http://localhost:4321） |
| `npm run build` | 本番用に書き出し（`dist/`） |
| `npm run check:seo` | 全ページのtitle・description・h1・構造化データ・リンク切れを確認 |

## 記事・日記の追加

- お役立ち記事：`src/content/articles/英数字のスラッグ.md`
- テン・ムギ日記：`src/content/diary/YYYY-MM-DD-スラッグ.md`

先頭に次の情報を書く（description は50〜140文字）。

```md
---
title: 記事タイトル
description: 検索結果に出る説明文
category: 迎える準備 | 暮らし | 猫の雑学 | 北九州 | 就労支援
published: 2026-11-12
---
```

`main` に push すると自動で公開される。サイトマップ・RSSも自動更新。

## SEOのしくみ

- 全ページに title / description / canonical / OGP / Twitterカード
- 構造化データ：AnimalShelter（施設情報）、BreadcrumbList、Article、BlogPosting、FAQPage
- `sitemap-index.xml`、`robots.txt`、`rss.xml` を自動生成
- ビルド時に `check:seo` で品質チェック（CIでも実行）

## 独自ドメインにするとき

1. ドメインを取得し、DNSで `nikori1022.github.io` に向ける
2. リポジトリの Settings > Pages で Custom domain を設定
3. Settings > Secrets and variables > Actions > Variables に `SITE_URL=https://取得したドメイン`、`BASE_PATH=/` を登録

## 施設側で埋めること（`src/site.ts`）

- 住所・電話番号・見学受付時間（未入力の項目はサイトに表示されない）
- テンとムギの誕生日（推定）、保護された時期、好きなもの（`src/pages/cats/index.astro`）
