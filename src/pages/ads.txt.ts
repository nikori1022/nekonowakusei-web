import type { APIRoute } from 'astro';
import { SITE } from '../site';

// AdSense の ads.txt。パブリッシャーIDが未設定のあいだは中身なし（広告なし）。
export const GET: APIRoute = () => {
  const pub = SITE.adsenseClient.replace(/^ca-/, '');
  const body = pub ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n` : '# 広告は未設定です\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
