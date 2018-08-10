import { KfDrawableProps, KfDocument } from "./KeyframesTypes";
import { Surface } from "react-art";
import { KfDrawable } from "./KfDrawable";
import * as React from "react";
/*
class KfImageSurfacePrecomputed extends React.Component {
  props: {
    frameCount: number,
    Group: React.Component,
    progress: number,
    
  },
  render() {
    const {Group, frameCount, ...otherProps} = this.props;
    const frames = [];
    for (let frameIndex = 0; frameIndex < frameCount; frameIndex++) {
      frames[frameIndex] = <KfImageSurface {...otherProps} />
    }
    return (
      <Group>{frames}</Group>
    );
  }
}
*/
export class KfImageSurface extends React.Component<
  {
    doc: KfDocument;
    progress: number;
    width?: number;
    height?: number;
  } & KfDrawableProps
> {
  render() {
    const {
      width,
      height,
      doc: {
        canvas_size: [docWidth, docHeight]
      }
    } = this.props;
    return (
      <Surface
        width={width || height || docWidth}
        height={height || width || docHeight}
      >
        <KfDrawable {...this.props} />
      </Surface>
    );
  }
}
