/**
 * Copyright (c) 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant 
 * of patent rights can be found in the PATENTS file in the same directory.
 */
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {Surface, Group, Shape, Transform} from 'react-art';

import BezierEasing from 'bezier-easing';
import Morph from 'art/morph/path';

require('art/modes/current').setCurrent(require('art/modes/dom'));

type KfDocument = {
  key: number,
  name: string,
  canvas_size: KfPoint,
  frame_rate: number,
  animation_frame_count: number,
  features: Array<KfFeature>,
  animation_groups: Array<KfAnimationGroup>,
};

type KfAnimationGroup = {
  group_id: number,
  group_name: string,
  parent_group?: number,
  animations: Array<KfProperty>,
};

type KfFeature = {
  name: string,
  fill_color?: string,
  stroke_color?: string,
  stroke_width?: number,
  effects?: {
    gradient?: KfGradient,
  },
  animation_group?: number,
  feature_animations?: Array<KfProperty>,

  timing_curves?: Array<KfTimingCurve>,
  key_frames: Array<KfValue<Array<string>>>,
}

type KfValue<T> = {
  start_frame: number,
  data: T,
};

type KfAnimatable<T> = {
  timing_curves: Array<KfTimingCurve>,
  key_values: Array<KfValue<T>>,
};

type KfPoint = [number, number];

type KfProperty = KfPropertyPosition | KfPropertyRotation | KfPropertyScale | KfPropertyStrokeWidth;

type KfPropertyPosition = KfAnimatable<KfPoint> & {
  property: 'POSITION',
  anchor?: KfPoint,
};
type KfPropertyRotation = KfAnimatable<[number] | [number, number, number]> & {
  property: 'ROTATION',
  anchor?: KfPoint,
};
type KfPropertyScale = KfAnimatable<[number, number]> & {
  property: 'SCALE',
  anchor?: KfPoint,
};
type KfPropertyStrokeWidth = KfAnimatable<[number]> & {
  property: 'STROKE_WIDTH',
};

type KfTimingCurve = [KfPoint, KfPoint];

type KfGradientStop = KfAnimatable<KfValue<string>>;

type KfGradient = {
  gradient_type: 'linear' | 'radial',
  color_start?: KfGradientStop,
  color_end?: KfGradientStop,
  ramp_start?: KfGradientStop,
  ramp_end?: KfGradientStop,
};

const defaultProps = {
  loop: false,
  progress: 0,
  currentFrameNumber: 0,
};

class KfImage extends React.Component {
  state: {
    currentFrameNumber: number,
  };

  static defaultProps: typeof defaultProps;
  props: {
    doc: KfDocument,
  } & typeof defaultProps;

  constructor(props, ...args) {
    super(props, ...args);
    const {currentFrameNumber} = props;
    this.state = {currentFrameNumber};
    this.handleRAF = this.handleRAF.bind(this);
    console.log(props);
  }

  componentWillReceiveProps(nextProps) {
    const {currentFrameNumber} = nextProps;
    this.setState({currentFrameNumber});
  }

  nextFrameStartTime: number;
  _rafTimer: number;
  handleRAF: Function;
  handleRAF() {
    const now = Date.now();
    if (!(now < this.nextFrameStartTime)) {
      let currentFrameNumber = this.state.currentFrameNumber || 0;
      currentFrameNumber ++;
      const {frame_rate, animation_frame_count} = this.props.doc;
      const frameTime = 1000 / frame_rate
      this.nextFrameStartTime = now + frameTime;
      
      if (currentFrameNumber > animation_frame_count) {
        if (!this.props.loop) {
          return;
        }
        currentFrameNumber = 0;
      }
      this.setState({currentFrameNumber});
    }
    this.tickRAF();
  }

  tickRAF() {
    this._rafTimer = window.requestAnimationFrame(this.handleRAF);
  }
  componentDidMount() {
    this.tickRAF();
  }
  componentWillUnmount() {
    window.cancelAnimationFrame(this._rafTimer);
  }

  // blendShapesCache: {[key:string]:{}};
  // blendShapes: (a: Path, b: Path, curve: KfTimingCurve, progress: number) => Path;
  blendShapes(a: Array<string>, b: Array<string>, curve: KfTimingCurve, progress: number): any {
    // TODO(aylott): Cache BezierEasing objects instead of recreating them constantly
    const [[curveA, curveB], [curveC, curveD]] = curve;
    const easing = BezierEasing(curveA, curveB, curveC, curveD);
    // TODO(aylott): Cache Path and Tween objects instead of recreating them constantly
    const aPath = Morph.Path(a.join(' '));
    const bPath = Morph.Path(b.join(' '));
    const tween = Morph.Tween(aPath, bPath);
    tween.tween(easing(progress));
    return tween;
  }
  blendNumbers(aNums: Array<number>, bNums: Array<number>, curve: KfTimingCurve, progress: number): Array<number> {
    // TODO(aylott): Cache BezierEasing objects instead of recreating them constantly
    const [[curveA, curveB], [curveC, curveD]] = curve;
    const easing = BezierEasing(curveA, curveB, curveC, curveD);
    const easedProgress = easing(progress);
    const blendedNums = new Array(aNums.length);
    for (let index = aNums.length; --index >= 0;){
      blendedNums[index] = blendNumbersLinear(aNums[index], bNums[index], easedProgress);
    }
    // if (blendedNums[1] < 0) debugger;
    return blendedNums;
  }

  render() {
    // console.log(this.props.doc);
    const {
      name,
      canvas_size: [canvasWidth, canvasHeight],
      features,
    } = this.props.doc;
    const {currentFrameNumber} = this.state;
    // console.log({name, currentFrameNumber})
    return (
      <Surface key={name} width={canvasWidth} height={canvasHeight}>
        {features.map((feature, index) => {
          const {name, fill_color, stroke_color, feature_animations, key_frames, timing_curves, } = feature;
          const shapeData = getValueForCurrentFrame(key_frames, timing_curves, currentFrameNumber, this.blendShapes);
          let {stroke_width} = feature;
          feature_animations && feature_animations.filter(filterToStroke).forEach(({property, timing_curves, key_values}) => {
            const values: Array<number> = getValueForCurrentFrame(key_values, timing_curves, currentFrameNumber, this.blendNumbers);
            stroke_width = values[0];
          });
          
          // new ReactART.LinearGradient(["black", "white"])
          let transform = transformFromAnimations(feature_animations, currentFrameNumber, this.blendNumbers);
          if (feature.animation_group) {
            const groupTransform = transformUsingAnimationGroups(this.props.doc, feature.animation_group, currentFrameNumber, this.blendNumbers);
            if (transform) {
              transform = groupTransform.transform(transform);
            } else {
              transform = groupTransform;
            }
          }
          
          const shapeElement = shapeData && (
            <Shape key={name}
              fill={hexColorSwapAlphaPosition(fill_color)}
              stroke={hexColorSwapAlphaPosition(stroke_color)}
              strokeWidth={stroke_width}
              d={shapeData.join && shapeData.join(' ') || shapeData}
              transform={transform}
            />
          );
          
          return shapeElement;
        })}
      </Surface>
    );
  }
}

KfImage.defaultProps = defaultProps;

const filterToStroke = ({property}) => property === 'STROKE_WIDTH';

function blendNumbersLinear(aNum: number, bNum: number, progress: number): number {
  const delta = bNum - aNum;
  return delta * progress + aNum;
}

function testEqual(testEqualFn, expected){
  const result = testEqualFn();
  if (!(result === expected)) {
    console.error({testEqualFn, result, expected});
  }
}

testEqual(() => blendNumbersLinear(0, 1, 0), 0)
testEqual(() => blendNumbersLinear(0, 1, 1), 1)
testEqual(() => blendNumbersLinear(0, 1, 0.5), 0.5)
testEqual(() => blendNumbersLinear(-99, 99, 0.5), 0)
testEqual(() => blendNumbersLinear(-99, 99, 0.75), 49.5)


// function convertKfDocToNestedLayers(kfDoc: KfDocument): KfArtTree {
//
// }

function filterGroupsByThisId({group_id}: KfAnimationGroup): boolean {
  const targetID: number = this;
  return group_id === targetID;
}

function transformUsingAnimationGroups(
  doc: KfDocument,
  id: number,
  currentFrameNumber: number,
  blend?: (a:T, b:T, curve: KfTimingCurve, progress: number) => T,
): Transform {
  const group = doc.animation_groups.filter(filterGroupsByThisId, id)[0];
  if (!group) {
    throw new Error(`Animation Group ${id} not found`);
  }
  const {animations, parent_group} = group;
  let transform = transformFromAnimations(animations, currentFrameNumber, blend);
  if (parent_group) {
    const groupTransform = transformUsingAnimationGroups(doc, parent_group, currentFrameNumber, blend);
    transform = groupTransform.transform(transform);
  }
  return transform;
}


function transformFromAnimations<T>(
  animations: Array<KfProperty>,
  currentFrameNumber: number,
  blend?: (a:T, b:T, curve: KfTimingCurve, progress: number) => T,
): ?Transform {
  if (!(animations && animations.length > 0)) {
    return;
  }
  const transform = new Transform();
  animations.sort(sortAnimations).forEach(({property, anchor, timing_curves, key_values}) => {
    const values: Array<number> = getValueForCurrentFrame(key_values, timing_curves, currentFrameNumber, blend);
    switch (property) {
    case 'STROKE_WIDTH':
      break;
    case 'POSITION':
      if (anchor) {
        transform.translate(-anchor[0], -anchor[1]);
      } else {
        const defaultAnchor = key_values[0].data;
        transform.translate(-defaultAnchor[0], -defaultAnchor[1]);
      }
      transform.translate(values[0], values[1]);
      // anchor && transform.translate(anchor[0], anchor[1]);
      break;
    case 'SCALE':
      anchor && transform.translate(anchor[0], anchor[1]);
      transform.scale(values[0] / 100, values[1] / 100);
      anchor && transform.translate(-anchor[0], -anchor[1]);
      break;
    case 'ROTATION':
      transform.rotate(values[0], anchor[0], anchor[1]);
      break;
    default:
      console.warn('Skipping unsupported property', property);
    }
  });
  return transform;
}

const AnimationOrder = [
  'STROKE_WIDTH',
  'POSITION',
  'SCALE',
  'ROTATION',
];

function sortAnimations({property:aProp}: KfProperty, {property:bProp}: KfProperty): number {
  const a = AnimationOrder.indexOf(aProp);
  const b = AnimationOrder.indexOf(bProp);
  return a > b
    ? 1
    : b > a
      ? -1
      : 0
  ;
}

function hexColorSwapAlphaPosition(color: ?string): ?string {
  if (!color) {
    return;
  }
  return '#' + color.substr(3,6) + color.substr(1,2);
}

function getValueForCurrentFrame<T>(
  kfValues: Array<KfValue<T>>,
  timing_curves?: Array<KfTimingCurve>,
  targetFrame: number,
  blend?: (a:T, b:T, curve: KfTimingCurve, progress: number) => T,
): ?T {
  let kfValueIndex, kfValue, kfValueNext;
  if (kfValues.length > 0) {
    let _kfValue, targetFrameBestMatch = -1;
    for (let index = -1, kfValuesCount = kfValues.length; ++index < kfValuesCount;) {
      _kfValue = kfValues[index]
      const {start_frame} = _kfValue;
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
  if (kfValue && kfValueNext && timing_curves && blend && kfValueIndex != null) {
    const minFrame = kfValue.start_frame;
    const maxFrame = kfValueNext.start_frame;
    const progressBetweenFrames = (targetFrame - minFrame) / (maxFrame - minFrame);
    const curve = timing_curves[kfValueIndex];
    return blend(kfValue.data, kfValueNext.data, curve, progressBetweenFrames);
  }
  return kfValue && kfValue.data || null;
}


class KfDemo extends React.Component {
  state: {currentFrameNumber:number};
  constructor(...args) {
    super(...args);
    this.state = {currentFrameNumber:0};
  }
  render() {
    const {currentFrameNumber} = this.state;
    return (
      <div>
        <input style={{width:'100%'}} type="range" defaultValue={currentFrameNumber} min={0} max={100} step={0.01} onChange={
          ({target:{valueAsNumber:currentFrameNumber}}) => this.setState({currentFrameNumber})
        } />
        <br />
        <KfImage currentFrameNumber={currentFrameNumber} doc={require('./assets/sorry.json')} />
        <KfImage currentFrameNumber={currentFrameNumber} doc={require('./assets/anger.json')} />
        <KfImage currentFrameNumber={currentFrameNumber} doc={require('./assets/haha.json')} />
        <KfImage currentFrameNumber={currentFrameNumber} doc={require('./assets/sample_like.json')} />
        <KfImage currentFrameNumber={currentFrameNumber} doc={require('./assets/yay.json')} />
        <KfImage currentFrameNumber={currentFrameNumber} doc={require('./assets/love.json')} />
      </div>
    );
  }
}

document.write('<div id=KfImageRoot></div>');

ReactDOM.render(
  <KfDemo />,
  document.getElementById('KfImageRoot')
);
