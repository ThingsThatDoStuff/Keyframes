import { KfProperty } from "./KeyframesTypes";
const AnimationOrder = ["STROKE_WIDTH", "POSITION", "SCALE", "ROTATION"];
export function sortAnimations({ property: aProp }: KfProperty, { property: bProp }: KfProperty): number {
  const a = AnimationOrder.indexOf(aProp);
  const b = AnimationOrder.indexOf(bProp);
  return a > b ? 1 : b > a ? -1 : 0;
}