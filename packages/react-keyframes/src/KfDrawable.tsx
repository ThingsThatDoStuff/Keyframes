import { Surface, Group, Shape, Transform, LinearGradient } from "react-art";
import {
  KfDrawableProps,
  KfTimingCurve,
  KfValue,
  KfGradientStop
} from "./KeyframesTypes";
import { EasingFunction } from "bezier-easing";
import * as React from "react";
import * as BezierEasing from "bezier-easing";
import Morph from "art/morph/path";
import {
  blendNumbersLinear,
  filterToStroke,
  prepGradientValuesForBlending
} from "./filterToStroke";
import { getValueForCurrentFrame } from "./getValueForCurrentFrame";
import { transformFromAnimations } from "./transformFromAnimations";
import { transformUsingAnimationGroups } from "./filterGroupsByThisId";
import { hexColorSwapAlphaPosition } from "./hexColorSwapAlphaPosition";

export class KfDrawable extends React.Component<KfDrawableProps> {
  static defaultProps = {
    visible: true
  };

  static _easingCache = new WeakMap();
  _easingForCurve(curve: KfTimingCurve): EasingFunction {
    let easing = KfDrawable._easingCache.get(curve);
    if (easing == null) {
      const [[curveA, curveB], [curveC, curveD]] = curve;
      easing = BezierEasing(curveA, curveB, curveC, curveD);
      KfDrawable._easingCache.set(curve, easing);
    }
    return easing;
  }

  static _tweenCache = new WeakMap();
  _tweenForCurve(curve: KfTimingCurve, a: string[], b: string[]): Morph.Tween {
    let tween = KfDrawable._tweenCache.get(curve);
    if (tween == null) {
      tween = Morph.Tween(Morph.Path(a.join(" ")), Morph.Path(b.join(" ")));
      KfDrawable._tweenCache.set(curve, tween);
    }
    return tween;
  }

  static _gradientValuesCache = new WeakMap();
  _gradientNumberValuesFromStrings(
    values: KfValue<string>[]
  ): KfValue<number[]>[] {
    let gradientValues = KfDrawable._gradientValuesCache.get(values);
    if (gradientValues == null) {
      gradientValues = values.map(prepGradientValuesForBlending);
      KfDrawable._gradientValuesCache.set(values, gradientValues);
    }
    return gradientValues;
  }

  blendShapes = (
    a: string[],
    b: string[],
    curve: KfTimingCurve,
    progress: number
  ): any => {
    const easing = this._easingForCurve(curve);
    const tween = this._tweenForCurve(curve, a, b);
    tween.tween(easing(progress));
    return tween;
  };
  blendNumbers = (
    aNums: number[],
    bNums: number[],
    curve: KfTimingCurve,
    progress: number
  ): number[] => {
    const easing = this._easingForCurve(curve);
    const easedProgress = easing(progress);
    const blendedNums = new Array(aNums.length);
    for (let index = aNums.length; --index >= 0; ) {
      blendedNums[index] = blendNumbersLinear(
        aNums[index],
        bNums[index],
        easedProgress
      );
    }
    return blendedNums;
  };

  getGradientColor(
    { key_values, timing_curves }: KfGradientStop,
    currentFrameNumber: number
  ) /*: Color*/ {
    const values = this._gradientNumberValuesFromStrings(key_values);
    const colorParts =
      getValueForCurrentFrame(
        values,
        timing_curves,
        currentFrameNumber,
        this.blendNumbers
      ) || [];
    const [alpha, red, green, blue] = colorParts;
    return {
      alpha: Math.round(alpha),
      red: Math.round(red),
      green: Math.round(green),
      blue: Math.round(blue),
      isColor: true
    };
  }

  render() {
    let { visible } = this.props;
    const { width, height, x, y, progress } = this.props;
    const {
      name,
      canvas_size: [docWidth, docHeight],
      features,
      animation_frame_count
    } = this.props.doc;
    const currentFrameNumber = animation_frame_count * progress;
    let groupTransform =
      visible &&
      (width || height) &&
      new Transform().scale(
        (width || height || docWidth) / docWidth,
        (height || width || docHeight) / docHeight
      );
    if (x || y) {
      if (!groupTransform) {
        groupTransform = new Transform();
      }
      groupTransform.moveTo(x || 0, y || 0);
    }
    if (width === 0 || height === 0) {
      visible = false;
    }
    return (
      <Group
        key={name}
        visible={visible}
        width={docWidth}
        height={docHeight}
        transform={groupTransform}
      >
        {features.map((feature, index) => {
          const {
            name,
            fill_color,
            stroke_color,
            feature_animations,
            key_frames,
            timing_curves,
            effects
          } = feature;

          let fill;
          if (effects && effects.gradient) {
            const { gradient } = effects;
            switch (gradient.gradient_type) {
              case "linear":
                const { color_start, color_end } = gradient;
                if (color_start && color_end) {
                  // TODO(aylott): Gradient size should be sized to the shape, not the group!
                  fill = new LinearGradient(
                    [
                      this.getGradientColor(color_start, currentFrameNumber),
                      this.getGradientColor(color_end, currentFrameNumber)
                    ],
                    0,
                    0,
                    0,
                    docHeight
                  );
                }
                break;
              // TODO(aylott): Support radial gradient_type
              default:
                console.warn(
                  `Skipping unsupported gradient_type ${gradient.gradient_type}`
                );
            }
          }

          const shapeData = getValueForCurrentFrame(
            key_frames,
            timing_curves,
            currentFrameNumber,
            this.blendShapes
          );

          let { stroke_width } = feature;
          feature_animations &&
            feature_animations
              .filter(filterToStroke)
              .forEach(({ property, timing_curves, key_values }) => {
                const values = getValueForCurrentFrame(
                  key_values,
                  timing_curves,
                  currentFrameNumber,
                  this.blendNumbers
                );
                if (values) {
                  stroke_width = values[0];
                }
              });

          let transform =
            feature_animations &&
            transformFromAnimations(
              feature_animations,
              currentFrameNumber,
              this.blendNumbers
            );
          if (feature.animation_group) {
            const groupTransform = transformUsingAnimationGroups(
              this.props.doc,
              feature.animation_group,
              currentFrameNumber,
              this.blendNumbers
            );
            if (transform) {
              transform = groupTransform.transform(transform);
            } else {
              transform = groupTransform;
            }
          }

          const shapeElement = shapeData && (
            <Shape
              key={name}
              fill={fill || hexColorSwapAlphaPosition(fill_color)}
              stroke={hexColorSwapAlphaPosition(stroke_color)}
              strokeWidth={stroke_width}
              d={(shapeData.join && shapeData.join(" ")) || shapeData}
              transform={transform}
            />
          );

          return shapeElement;
        })}
      </Group>
    );
  }
}
