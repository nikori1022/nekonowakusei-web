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

## ねこの惑星マガジン（週3本・自動下書き）

- 月・水・金に Claude の定期タスクが記事を書いて **PR** を出す。藤島さんが読んでマージすると公開
- 直してほしいところは PR に `@claude ここをこう直して` とコメント
- 編集方針・文体ルール：`magazine/EDITORIAL.md`／テン・ムギの事実メモ：`magazine/cats.md`
- 写真カタログ：`magazine/photo-catalog.md`／掲載ログとネタ帳：`magazine/log.md`／情報源：`magazine/sources.md`
- `npm run lint:articles` … AI臭い言い回し・出典・写真・分量のチェック（PRで自動実行）
- `npm run photos -- add <写真フォルダ> <番号> <保存名>` … 写真アーカイブから記事用に取り込む（位置情報を削除）

## SEOのしくみ

- 全ページに title / description / canonical / OGP / Twitterカード
- 構造化データ：AnimalShelter（施設情報）、BreadcrumbList、Article、BlogPosting、FAQPage
- `sitemap-index.xml`、`robots.txt`、`rss.xml` を自動生成
- ビルド時に `check:seo` で品質チェック（CIでも実行）

## 独自ドメイン（nekonowakusei.jp）

ドメインはお名前.comで取得。切り替えは次の順でやる（順番を守ると公開が止まらない）。

1. **お名前.com の DNS レコード設定**（ドメイン設定 → DNS設定/転送設定 → DNSレコード設定）
   | ホスト名 | TYPE | VALUE |
   |---|---|---|
   | （空欄） | A | 185.199.108.153 |
   | （空欄） | A | 185.199.109.153 |
   | （空欄） | A | 185.199.110.153 |
   | （空欄） | A | 185.199.111.153 |
   | （空欄） | AAAA | 2606:50c0:8000::153 |
   | （空欄） | AAAA | 2606:50c0:8001::153 |
   | （空欄） | AAAA | 2606:50c0:8002::153 |
   | （空欄） | AAAA | 2606:50c0:8003::153 |
   | www | CNAME | nikori1022.github.io |

   ネームサーバーはお名前.comのもの（01.dnsv.jp 〜 04.dnsv.jp）を使う。`dig nekonowakusei.jp +short` で上の4つのIPが返れば反映済み。
2. GitHub の Settings > Variables（Actions）に `SITE_URL=https://nekonowakusei.jp`、`BASE_PATH=/` を登録
3. Settings > Pages の Custom domain に `nekonowakusei.jp` を入れて Save → DNS check が通ったら Actions の Deploy を再実行
4. 証明書ができたら（数分〜1日）**Enforce HTTPS** にチェック
5. （任意・推奨）アカウントの Settings > Pages でドメインを Verify（`_github-pages-challenge-nikori1022` の TXT レコードを追加）。他人に乗っ取られるのを防げる
6. Search Console に `https://nekonowakusei.jp/` をプロパティ追加（`public/` の確認用HTMLがそのまま使える）→ サイトマップ `sitemap-index.xml` を送信。旧URLのプロパティで「アドレス変更」は使えない（github.io は自分のドメインではないため）。GA4 はデータストリームのURLを書き換える

`astro.config.mjs` と `scripts/check-seo.mjs` は環境変数 `SITE_URL` / `BASE_PATH` を読むので、コードの書き換えは不要。

## 施設側で埋めること（`src/site.ts`）

- 住所・電話番号・見学受付時間（未入力の項目はサイトに表示されない）
- テンとムギの誕生日（推定）、保護された時期、好きなもの（`src/pages/cats/index.astro`）
