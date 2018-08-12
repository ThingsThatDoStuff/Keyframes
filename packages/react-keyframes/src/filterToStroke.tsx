import Color from "art/core/color";
import { IKfValue } from "./KeyframesTypes";
export const filterToStroke = ({ property }: { property: string }) => property === "STROKE_WIDTH";
export const prepGradientValuesForBlending = ({
  data,
  start_frame,
}: IKfValue<string>): IKfValue<number[]> => ({
  data: Color.parseHEX(data),
  start_frame,
});
export function blendNumbersLinear(aNum: number, bNum: number, progress: number): number {
  const delta = bNum - aNum;
  return delta * progress + aNum;
}
