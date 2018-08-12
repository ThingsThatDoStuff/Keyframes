import Color from "art/core/color";
export var filterToStroke = function (_a) {
    var property = _a.property;
    return property === "STROKE_WIDTH";
};
export var prepGradientValuesForBlending = function (_a) {
    var data = _a.data, start_frame = _a.start_frame;
    return ({
        data: Color.parseHEX(data),
        start_frame: start_frame,
    });
};
export function blendNumbersLinear(aNum, bNum, progress) {
    var delta = bNum - aNum;
    return delta * progress + aNum;
}
//# sourceMappingURL=filterToStroke.js.map