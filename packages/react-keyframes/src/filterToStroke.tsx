import { KfValue } from "./KeyframesTypes";
import Color from "art/core/color";
export const filterToStroke = ({ property }: { property: string }) =>
  property === "STROKE_WIDTH";
export const prepGradientValuesForBlending = ({
  start_frame,
  data
}: KfValue<string>): KfValue<number[]> => ({
  start_frame,
  data: Color.parseHEX(data)
});
export function blendNumbersLinear(
  aNum: number,
  bNum: number,
  progress: number
): number {
  const delta = bNum - aNum;
  return delta * progress + aNum;
}
