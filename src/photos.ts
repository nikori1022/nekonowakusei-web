// サイトに載せる猫の写真（猫だけが写っているもの・EXIF削除済み）
// 元写真は非公開リポジトリ nekonowakusei-photos の tenmugi_01of10/ にある（ファイル名の番号が対応）
import type { ImageMetadata } from 'astro';
import mugi0603 from './assets/cats/mugi-0603.jpg';
import mugi0630 from './assets/cats/mugi-0630.jpg';
import mugi0208 from './assets/cats/mugi-0208.jpg';
import mugi0670 from './assets/cats/mugi-0670.jpg';
import mugi0332 from './assets/cats/mugi-0332.jpg';
import mugi0348 from './assets/cats/mugi-0348.jpg';
import mugi0431 from './assets/cats/mugi-0431.jpg';
import ten0069 from './assets/cats/ten-0069.jpg';
import ten0037 from './assets/cats/ten-0037.jpg';
import ten0141 from './assets/cats/ten-0141.jpg';
import ten0590 from './assets/cats/ten-0590.jpg';
import ten0089 from './assets/cats/ten-0089.jpg';
import both0453 from './assets/cats/both-0453.jpg';

/** position: 正方形に切り抜くときの基準（未指定なら写真の目立つ部分を自動で探す） */
export interface Photo { src: ImageMetadata; alt: string; position?: string }

export const PHOTOS = {
  both: { src: both0453, alt: '並んでこちらを見上げる茶トラ猫のムギ（手前）とテン（奥）' },
  mugiFace: { src: mugi0630, alt: '大きな目でカメラを見つめる茶トラ猫のムギ' },
  tenFace: { src: ten0069, alt: 'まっすぐこちらを見る茶トラ猫のテン' },
} satisfies Record<string, Photo>;

export const GALLERY: Record<'テン' | 'ムギ', Photo[]> = {
  ムギ: [
    { src: mugi0603, alt: 'レインボーのボールを前足で押さえるムギ', position: 'top' },
    { src: mugi0208, alt: 'ソファの上で長く伸びてくつろぐムギ' },
    { src: mugi0670, alt: 'キャットタワーの台でボールを抱えるムギ' },
    { src: mugi0332, alt: '廊下に座って上を見上げるムギ' },
    { src: mugi0348, alt: 'おもちゃのねこじゃらしを見つめるムギの横顔' },
    { src: mugi0431, alt: '床で姿勢を低くして狩りのポーズをとるムギ' },
  ],
  テン: [
    { src: ten0037, alt: 'フローリングの上で背筋を伸ばして座るテン' },
    { src: ten0141, alt: 'カメラに顔を近づけるテンのアップ' },
    { src: ten0590, alt: '床に座ってこちらを振り返るテン' },
    { src: ten0089, alt: '下から見上げたアングルのテン' },
  ],
};
