var AnimationOrder = ["STROKE_WIDTH", "POSITION", "SCALE", "ROTATION"];
export function sortAnimations(_a, _b) {
    var aProp = _a.property;
    var bProp = _b.property;
    var a = AnimationOrder.indexOf(aProp);
    var b = AnimationOrder.indexOf(bProp);
    return a > b ? 1 : b > a ? -1 : 0;
}
//# sourceMappingURL=AnimationOrder.js.map