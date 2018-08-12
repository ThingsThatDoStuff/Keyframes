import { IKfAnimationGroup, IKfDocument, KfTimingCurve } from "./KeyframesTypes";
import { transformFromAnimations } from "./transformFromAnimations";

// import {
//   Transform,
// } from "react-art";
// if (typeof window.__DEV__ !== "undefined" && window.__DEV__) {
//   function testEqual(testEqualFn, expected) {
//     const result = testEqualFn();
//     if (!(result === expected)) {
//       console.error({ testEqualFn, result, expected });
//     }
//   }
//   testEqual(() => blendNumbersLinear(0, 1, 0), 0);
//   testEqual(() => blendNumbersLinear(0, 1, 1), 1);
//   testEqual(() => blendNumbersLinear(0, 1, 0.5), 0.5);
//   testEqual(() => blendNumbersLinear(-99, 99, 0.5), 0);
//   testEqual(() => blendNumbersLinear(-99, 99, 0.75), 49.5);
// }
function filterGroupsByThisId({ group_id }: IKfAnimationGroup): boolean {
  // @ts-ignore
  return group_id === this;
}
export function transformUsingAnimationGroups<T>(
  doc: IKfDocument,
  id: number,
  currentFrameNumber: number,
  blend?: (a: number[], b: number[], curve: KfTimingCurve, progress: number) => number[],
) /*: Transform*/ {
  const group = doc.animation_groups.filter(filterGroupsByThisId, id)[0];
  if (!group) {
    throw new Error(`Animation Group ${id} not found`);
  }
  const { animations, parent_group } = group;
  let transform = transformFromAnimations(animations, currentFrameNumber, blend);
  if (parent_group) {
    const groupTransform = transformUsingAnimationGroups(
      doc,
      parent_group,
      currentFrameNumber,
      blend,
    );
    transform = groupTransform.transform(transform);
  }
  return transform;
}
