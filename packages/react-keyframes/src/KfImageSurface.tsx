import * as React from "react";
import { Surface } from "react-art";
import { IKfDocument, IKfDrawableProps } from "./KeyframesTypes";
import { KfDrawable } from "./KfDrawable";
/*
class KfImageSurfacePrecomputed extends React.PureComponent {
  props: {
    frameCount: number,
    Group: React.PureComponent,
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
interface IKfImageSurfaceProps extends IKfDrawableProps {
  doc: IKfDocument;
  progress?: number;
  width?: number;
  height?: number;
}

export class KfImageSurface extends React.PureComponent<IKfImageSurfaceProps> {
  public render() {
    const {
      width,
      height,
      doc: {
        canvas_size: [docWidth, docHeight],
      },
    } = this.props;
    return (
      <Surface width={width || height || docWidth} height={height || width || docHeight}>
        <KfDrawable {...this.props} />
      </Surface>
    );
  }
}
