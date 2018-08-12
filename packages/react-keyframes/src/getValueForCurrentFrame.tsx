import { KfTimingCurve, KfValue } from "./KeyframesTypes";
export function getValueForCurrentFrame<T>(
  kfValues: Array<KfValue<T>>,
  //@ts-ignore
  timing_curves: Array<KfTimingCurve> | undefined,
  targetFrame: number,
  blend?: (a: T, b: T, curve: KfTimingCurve, progress: number) => T
): T {
  let kfValueIndex, kfValue, kfValueNext;
  if (kfValues.length > 0) {
    let _kfValue,
      targetFrameBestMatch = -1;
    for (
      let index = -1, kfValuesCount = kfValues.length;
      ++index < kfValuesCount;

    ) {
      _kfValue = kfValues[index];
      const { start_frame } = _kfValue;
      // There can't be more than one perfect match
      if (start_frame === targetFrame) {
        kfValue = _kfValue;
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
        kfValue = _kfValue;
        kfValueIndex = index;
        kfValueNext = kfValues[index + 1];
      }
    }
  }
  if (!kfValue) {
    kfValueIndex = 0;
    kfValue = kfValues[kfValueIndex];
  }
  if (
    kfValue &&
    kfValueNext &&
    timing_curves &&
    blend &&
    kfValueIndex != null
  ) {
    const minFrame = kfValue.start_frame;
    const maxFrame = kfValueNext.start_frame;
    const progressBetweenFrames =
      (targetFrame - minFrame) / (maxFrame - minFrame);
    const curve = timing_curves[kfValueIndex];
    return blend(kfValue.data, kfValueNext.data, curve, progressBetweenFrames);
  }
  return (kfValue && kfValue.data) || null;
}
