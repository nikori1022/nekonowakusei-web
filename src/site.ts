// サイト全体の基本情報。ここを書き換えれば全ページに反映される。
// TODO の項目は施設側で確認してから埋める。

export const SITE = {
  name: '保護猫施設 ねこの惑星',
  shortName: 'ねこの惑星',
  tagline: '北九州・小倉の保護猫施設',
  description:
    '北九州市小倉にある保護猫施設「ねこの惑星」の公式サイト。茶トラのテンとムギの日記、見学のご案内、保護猫を迎える準備や北九州の保護猫情報をまとめています。',
  locale: 'ja_JP',
  foundingDate: '2022-06',
  area: '福岡県北九州市小倉北区',
  // TODO: 住所・電話・見学受付時間が決まったら入れる（未入力の項目は表示されない）
  address: '',
  telephone: '',
  openingHours: '',
  email: 'hogonekonekonowakusei@gmail.com',
  operator: {
    name: 'ラシクラボ小倉鍛冶町（就労継続支援B型）',
    url: 'https://rashikulab.jp/office/kokurakazimachi',
  },
  /** 見学の申し込み先（ラシクラボ小倉鍛冶町の公式サイト。フォーム・電話・LINEで受付） */
  visitUrl: 'https://rashikulab.jp/office/kokurakazimachi',
  sns: [
    { name: 'TikTok', url: 'https://www.tiktok.com/@nekonowakusei' },
    { name: 'YouTube', url: 'https://www.youtube.com/channel/UCeSKu7RnpGLcdTR6xiw9DFw' },
    { name: 'Threads', url: 'https://www.threads.com/@nekowaku_kokura' },
    { name: 'X', url: 'https://twitter.com/nekowaku_kokura' },
    { name: 'Instagram', url: 'https://www.instagram.com/nekowaku_kokura/' },
  ],
  shop: 'https://haru64.base.shop/',
  // Google アナリティクス 4 の測定ID（ねこの惑星の Google アカウントで管理）
  gaId: 'G-WXT5FWSFGY',
};

/** base パスを付けた内部リンクを返す */
export function u(path = '/') {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

export function formatDate(d: Date) {
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}
