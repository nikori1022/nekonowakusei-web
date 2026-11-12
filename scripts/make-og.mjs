// OGP画像(1200x630)を生成する: node scripts/make-og.mjs
import sharp from 'sharp';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#1e2a55"/>
<g fill="#fff"><circle cx="90" cy="80" r="4"/><circle cx="560" cy="60" r="3"/><circle cx="1120" cy="560" r="4"/><circle cx="640" cy="580" r="3"/><circle cx="80" cy="540" r="3"/></g>
<g transform="translate(720 90) scale(1.1)">
<path d="M104 132 L112 52 L170 98 Z M296 132 L288 52 L230 98 Z" fill="#ee8e2c"/>
<ellipse cx="200" cy="215" rx="188" ry="46" fill="none" stroke="#7fd3bf" stroke-width="7" opacity=".55" transform="rotate(-14 200 215)"/>
<circle cx="200" cy="205" r="118" fill="#ee8e2c"/>
<ellipse cx="200" cy="262" rx="70" ry="50" fill="#fbe3c4"/>
<path d="M146 205 q18 -20 36 0 M218 205 q18 -20 36 0" fill="none" stroke="#141d3f" stroke-width="7" stroke-linecap="round"/>
<path d="M190 238 h20 l-10 11 z" fill="#c4553a"/>
<path d="M14 254 Q200 320 386 176" fill="none" stroke="#7fd3bf" stroke-width="7" stroke-linecap="round"/>
</g>
<text x="80" y="250" font-family="Noto Sans CJK JP, sans-serif" font-size="40" fill="#7fd3bf" font-weight="700">北九州・小倉の保護猫施設</text>
<text x="80" y="360" font-family="Noto Sans CJK JP, sans-serif" font-size="100" fill="#ee8e2c" font-weight="700">ねこの惑星</text>
<text x="80" y="440" font-family="Noto Sans CJK JP, sans-serif" font-size="34" fill="#e6eaf7">茶トラのテンとムギが暮らしています</text>
</svg>`;
await sharp(Buffer.from(svg)).png().toFile('public/og.png');
console.log('public/og.png');
