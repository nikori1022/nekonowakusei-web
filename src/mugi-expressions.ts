// ムギ3Dの表情一覧。表情を増やすときは、public/mugi3d/ に回転スプライト（8列×6行・48コマ）と
// ポスター画像を置いて、ここに1行足すだけでよい。クリックするたびに次の表情へ切り替わる。
export interface MugiExpression { id: string; label: string }
export const MUGI_EXPRESSIONS: MugiExpression[] = [
  { id: 'neutral', label: 'ふつう' },
];
export const MUGI_SPRITE = { cols: 8, rows: 6, frames: 48, size: 320, fps: 14 };
