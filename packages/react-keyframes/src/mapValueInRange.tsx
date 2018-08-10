export function mapValueInRange(
  value: number,
  fromLow: number,
  fromHigh: number,
  toLow: number,
  toHigh: number
): number {
  const fromRangeSize = fromHigh - fromLow;
  const toRangeSize = toHigh - toLow;
  const valueScale = (value - fromLow) / fromRangeSize;
  return toLow + valueScale * toRangeSize;
}
