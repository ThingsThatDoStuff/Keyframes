import { Transform } from "react-art";
import { sortAnimations } from "./AnimationOrder";
import { getValueForCurrentFrame } from "./getValueForCurrentFrame";
import { KfProperty, KfTimingCurve } from "./KeyframesTypes";
export function transformFromAnimations(
  animations: KfProperty[],
  currentFrameNumber: number,
  blend?: (a: number[], b: number[], curve: KfTimingCurve, progress: number) => number[],
): any {
  if (!(animations && animations.length > 0)) {
    return;
  }
  const transform = new Transform();
  animations.sort(sortAnimations).forEach((anim: KfProperty) => {
    const { anchor, property, timing_curves, key_values } = anim;
    const values: number[] = getValueForCurrentFrame(
      key_values,
      timing_curves,
      currentFrameNumber,
      blend,
    );
    if (values == null) {
      return;
    }
    switch (anim.property) {
      case "STROKE_WIDTH":
        break;
      case "POSITION":
        if (anchor) {
          transform.translate(-anchor[0], -anchor[1]);
        } else {
          const defaultAnchor = key_values[0].data;
          transform.translate(-defaultAnchor[0], -defaultAnchor[1]);
        }
        transform.translate(values[0], values[1]);
        break;
      case "SCALE":
        if (anchor) {
          transform.translate(anchor[0], anchor[1]);
        }
        transform.scale(values[0] / 100, values[1] / 100);
        if (anchor) {
          transform.translate(-anchor[0], -anchor[1]);
        }
        break;
      case "ROTATION":
        if (!anchor) {
          // tslint:disable-next-line:no-console
          console.warn(`Skipping ${property} because anchor is missing`);
        } else {
          transform.rotate(values[0], anchor[0], anchor[1]);
        }
        break;
      default:
        // tslint:disable-next-line:no-console
        console.warn("Skipping unsupported property", property);
    }
  });
  return transform;
}
