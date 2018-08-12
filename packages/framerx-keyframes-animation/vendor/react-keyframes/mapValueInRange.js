export function mapValueInRange(value, fromLow, fromHigh, toLow, toHigh) {
    var fromRangeSize = fromHigh - fromLow;
    var toRangeSize = toHigh - toLow;
    var valueScale = (value - fromLow) / fromRangeSize;
    return toLow + valueScale * toRangeSize;
}
//# sourceMappingURL=mapValueInRange.js.map