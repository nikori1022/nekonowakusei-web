// 記事のトピック（カテゴリ）。色とアイコン、URL用のスラッグをまとめて管理する。
export const TOPICS = {
  迎える準備: { slug: 'junbi', tone: 'peach', icon: 'house', lead: '保護猫を家族に迎える前に知っておきたいこと' },
  暮らし: { slug: 'kurashi', tone: 'mint', icon: 'bowl', lead: '猫と毎日を楽しく過ごすためのコツ' },
  猫の雑学: { slug: 'zatsugaku', tone: 'lilac', icon: 'spark', lead: '思わず誰かに話したくなる猫の話' },
  北九州: { slug: 'kitakyushu', tone: 'sky', icon: 'pin', lead: '北九州で猫と暮らす人のための地域情報' },
  就労支援: { slug: 'shuro', tone: 'rose', icon: 'heart', lead: '猫のお世話を仕事にする、ねこの惑星の取り組み' },
} as const;

export type TopicName = keyof typeof TOPICS;
export const topicNames = Object.keys(TOPICS) as TopicName[];
export const topicBySlug = (slug: string) => topicNames.find((n) => TOPICS[n].slug === slug);
