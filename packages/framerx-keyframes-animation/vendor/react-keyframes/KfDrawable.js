var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// tslint:disable:ordered-imports
import { Group, Shape, Transform, LinearGradient } from "react-art";
import * as React from "react";
import * as BezierEasing from "bezier-easing";
import * as Morph from "art/morph/path";
import { blendNumbersLinear, filterToStroke, prepGradientValuesForBlending, } from "./filterToStroke";
import { getValueForCurrentFrame } from "./getValueForCurrentFrame";
import { transformFromAnimations } from "./transformFromAnimations";
import { transformUsingAnimationGroups } from "./filterGroupsByThisId";
import { hexColorSwapAlphaPosition } from "./hexColorSwapAlphaPosition";
var KfDrawable = /** @class */ (function (_super) {
    __extends(KfDrawable, _super);
    function KfDrawable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.blendShapes = function (a, b, curve, progress) {
            var easing = _this._easingForCurve(curve);
            var tween = _this._tweenForCurve(curve, a, b);
            tween.tween(easing(progress));
            return tween;
        };
        _this.blendNumbers = function (aNums, bNums, curve, progress) {
            var easing = _this._easingForCurve(curve);
            var easedProgress = easing(progress);
            var blendedNums = new Array(aNums.length);
            for (var index = aNums.length; --index >= 0;) {
                blendedNums[index] = blendNumbersLinear(aNums[index], bNums[index], easedProgress);
            }
            return blendedNums;
        };
        return _this;
    }
    KfDrawable.prototype.render = function () {
        var _this = this;
        var visible = this.props.visible;
        var _a = this.props, width = _a.width, height = _a.height, x = _a.x, y = _a.y, _b = _a.progress, progress = _b === void 0 ? 0 : _b;
        var _c = this.props.doc, name = _c.name, _d = _c.canvas_size, docWidth = _d[0], docHeight = _d[1], features = _c.features, animation_frame_count = _c.animation_frame_count;
        var currentFrameNumber = animation_frame_count * progress;
        var groupTransform = visible &&
            (width || height) &&
            new Transform().scale((width || height || docWidth) / docWidth, (height || width || docHeight) / docHeight);
        if (x || y) {
            if (!groupTransform) {
                groupTransform = new Transform();
            }
            groupTransform.moveTo(x || 0, y || 0);
        }
        if (width === 0 || height === 0) {
            visible = false;
        }
        return (React.createElement(Group, { key: name, visible: visible, width: docWidth, height: docHeight, transform: groupTransform }, features.map(function (feature) {
            var featureName = feature.name, fill_color = feature.fill_color, stroke_color = feature.stroke_color, feature_animations = feature.feature_animations, key_frames = feature.key_frames, timing_curves = feature.timing_curves, effects = feature.effects;
            var fill;
            if (effects && effects.gradient) {
                var gradient = effects.gradient;
                switch (gradient.gradient_type) {
                    case "linear":
                        var color_start = gradient.color_start, color_end = gradient.color_end;
                        if (color_start && color_end) {
                            // TODO(aylott): Gradient size should be sized to the shape, not the group!
                            fill = new LinearGradient([
                                _this.getGradientColor(color_start, currentFrameNumber),
                                _this.getGradientColor(color_end, currentFrameNumber),
                            ], 0, 0, 0, docHeight);
                        }
                        break;
                    // TODO(aylott): Support radial gradient_type
                    default:
                        // tslint:disable-next-line:no-console
                        console.warn("Skipping unsupported gradient_type " + gradient.gradient_type);
                }
            }
            var shapeData = getValueForCurrentFrame(key_frames, timing_curves, currentFrameNumber, _this.blendShapes);
            var stroke_width = feature.stroke_width;
            if (feature_animations) {
                // tslint:disable-next-line:no-shadowed-variable
                feature_animations.filter(filterToStroke).forEach(function (_a) {
                    var timing_curves = _a.timing_curves, key_values = _a.key_values;
                    var values = getValueForCurrentFrame(key_values, timing_curves, currentFrameNumber, _this.blendNumbers);
                    if (values) {
                        stroke_width = values[0];
                    }
                });
            }
            var transform = feature_animations &&
                transformFromAnimations(feature_animations, currentFrameNumber, _this.blendNumbers);
            if (feature.animation_group) {
                var groupTransformTmp = transformUsingAnimationGroups(_this.props.doc, feature.animation_group, currentFrameNumber, _this.blendNumbers);
                if (transform) {
                    transform = groupTransformTmp.transform(transform);
                }
                else {
                    transform = groupTransformTmp;
                }
            }
            var shapeElement = shapeData && (React.createElement(Shape, { key: featureName, fill: fill || hexColorSwapAlphaPosition(fill_color), stroke: hexColorSwapAlphaPosition(stroke_color), strokeWidth: stroke_width, d: (shapeData.join && shapeData.join(" ")) || shapeData, transform: transform }));
            return shapeElement;
        })));
    };
    KfDrawable.prototype._easingForCurve = function (curve) {
        var easing = KfDrawable.easingCache.get(curve);
        if (easing == null) {
            var _a = curve[0], curveA = _a[0], curveB = _a[1], _b = curve[1], curveC = _b[0], curveD = _b[1];
            easing = BezierEasing(curveA, curveB, curveC, curveD);
            KfDrawable.easingCache.set(curve, easing);
        }
        return easing;
    };
    KfDrawable.prototype._tweenForCurve = function (curve, a, b) {
        var tween = KfDrawable.tweenCache.get(curve);
        if (tween == null) {
            tween = Morph.Tween(Morph.Path(a.join(" ")), Morph.Path(b.join(" ")));
            KfDrawable.tweenCache.set(curve, tween);
        }
        return tween;
    };
    KfDrawable.prototype._gradientNumberValuesFromStrings = function (values) {
        var gradientValues = KfDrawable.gradientValuesCache.get(values);
        if (gradientValues == null) {
            gradientValues = values.map(prepGradientValuesForBlending);
            KfDrawable.gradientValuesCache.set(values, gradientValues);
        }
        return gradientValues;
    };
    KfDrawable.prototype.getGradientColor = function (_a, currentFrameNumber) {
        var key_values = _a.key_values, timing_curves = _a.timing_curves;
        var values = this._gradientNumberValuesFromStrings(key_values);
        var colorParts = getValueForCurrentFrame(values, timing_curves, currentFrameNumber, this.blendNumbers) || [];
        var alpha = colorParts[0], red = colorParts[1], green = colorParts[2], blue = colorParts[3];
        // tslint:disable:object-literal-sort-keys
        return {
            alpha: Math.round(alpha),
            red: Math.round(red),
            green: Math.round(green),
            blue: Math.round(blue),
            isColor: true,
        };
    };
    KfDrawable.defaultProps = {
        visible: true,
    };
    KfDrawable.tweenCache = new WeakMap();
    KfDrawable.gradientValuesCache = new WeakMap();
    KfDrawable.easingCache = new WeakMap();
    return KfDrawable;
}(React.PureComponent));
export { KfDrawable };
//# sourceMappingURL=KfDrawable.js.map