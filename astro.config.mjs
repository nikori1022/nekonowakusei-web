// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 公開URL。独自ドメインを取ったら SITE_URL を書き換え、BASE_PATH を "/" にする。
// 例: SITE_URL=https://nekonowakusei.jp BASE_PATH=/
const SITE_URL = process.env.SITE_URL ?? 'https://nikori1022.github.io';
const BASE_PATH = process.env.BASE_PATH ?? '/nekonowakusei-web';

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  trailingSlash: 'always',
  integrations: [sitemap({ i18n: undefined, changefreq: 'weekly' })],
  build: { format: 'directory' },
  // 一般見学をやめたので、旧「見学のご案内」は利用者募集ページへ転送
  redirects: { '/visit/': `${BASE_PATH.replace(/\/$/, '')}/join/` },
});
