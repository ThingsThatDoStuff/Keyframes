export function getValueForCurrentFrame(kfValues, 
// tslint:disable-next-line:variable-name
timing_curves, targetFrame, blend) {
    var kfValueIndex;
    var kfValue;
    var kfValueNext;
    if (kfValues.length > 0) {
        var kfValueTmp = void 0;
        var targetFrameBestMatch = -1;
        for (var index = -1, kfValuesCount = kfValues.length; ++index < kfValuesCount;) {
            kfValueTmp = kfValues[index];
            var start_frame = kfValueTmp.start_frame;
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
        var minFrame = kfValue.start_frame;
        var maxFrame = kfValueNext.start_frame;
        var progressBetweenFrames = (targetFrame - minFrame) / (maxFrame - minFrame);
        var curve = timing_curves[kfValueIndex];
        return blend(kfValue.data, kfValueNext.data, curve, progressBetweenFrames);
    }
    return (kfValue && kfValue.data) || null;
}
//# sourceMappingURL=getValueForCurrentFrame.js.map