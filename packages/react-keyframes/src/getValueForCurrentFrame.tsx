import { IKfValue, KfTimingCurve } from "./KeyframesTypes";
export function getValueForCurrentFrame<T>(
  kfValues: Array<IKfValue<T>>,
  // tslint:disable-next-line:variable-name
  timing_curves: KfTimingCurve[] | undefined,
  targetFrame: number,
  blend?: (a: T, b: T, curve: KfTimingCurve, progress: number) => T,
): T {
  let kfValueIndex;
  let kfValue;
  let kfValueNext;
  if (kfValues.length > 0) {
    let kfValueTmp;
    let targetFrameBestMatch = -1;
    for (let index = -1, kfValuesCount = kfValues.length; ++index < kfValuesCount; ) {
      kfValueTmp = kfValues[index];
      const { start_frame } = kfValueTmp;
      // There can't be more than one perfect match
      if (start_frame === targetFrame) {
        kfValue = kfValueTmp;
        kfValueIndex = index;
        kfValueNext = null;
        break;
      }
      // Skip any that happen later than now
      if (start_frame > targetFrame) {
        continue;
      }
      // Keep any that are closer to the target
      if (start_frame >= targetFrameBestMatch) {
        targetFrameBestMatch = start_frame;
        kfValue = kfValueTmp;
        kfValueIndex = index;
        kfValueNext = kfValues[index + 1];
      }
    }
  }
  if (!kfValue) {
    kfValueIndex = 0;
    kfValue = kfValues[kfValueIndex];
  }
  if (kfValue && kfValueNext && timing_curves && blend && kfValueIndex != null) {
    const minFrame = kfValue.start_frame;
    const maxFrame = kfValueNext.start_frame;
    const progressBetweenFrames = (targetFrame - minFrame) / (maxFrame - minFrame);
    const curve = timing_curves[kfValueIndex];
    return blend(kfValue.data, kfValueNext.data, curve, progressBetweenFrames);
  }
  return (kfValue && kfValue.data) || null;
}
