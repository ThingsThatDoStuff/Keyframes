import Color from "art/core/color";
import { KfValue } from "./KeyframesTypes";
export const filterToStroke = ({ property }: { property: string }) =>
  property === "STROKE_WIDTH";
export const prepGradientValuesForBlending = ({
  data,
  start_frame
}: KfValue<string>): KfValue<number[]> => ({
  data: Color.parseHEX(data),
  start_frame
});
export function blendNumbersLinear(
  aNum: number,
  bNum: number,
  progress: number
): number {
  const delta = bNum - aNum;
  return delta * progress + aNum;
}
