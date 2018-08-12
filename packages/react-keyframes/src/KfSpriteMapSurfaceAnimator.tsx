import * as React from "react";
import { IKfDocument } from "./KeyframesTypes";
import { KfSpriteMapSurface } from "./KfSpriteMapSurface";

export class KfSpriteMapSurfaceAnimator extends React.PureComponent<{
  progress: number;
  doc: IKfDocument;
  width?: number;
  height?: number;
  style?: {
    [key: string]: any;
  };
}> {
  public render() {
    const { progress, ...otherProps } = this.props;
    const {
      style,
      width,
      height,
      doc: {
        canvas_size: [docWidth, docHeight],
        animation_frame_count,
      },
    } = this.props;
    const finalWidth = width || height || docWidth;
    const finalHeight = height || width || docHeight;
    const frameCount = animation_frame_count;
    const frameIndexMax = frameCount - 1;
    const cols = Math.ceil(Math.sqrt(frameCount));
    const frameIndex = Math.round(frameIndexMax * progress);
    const currentRow = Math.floor(frameIndex / cols);
    const currentCol = frameIndex % cols;
    const x = finalWidth * currentCol;
    const y = finalHeight * currentRow;
    return (
      <div
        style={{
          ...style,
          display: "inline-block",
          height: finalHeight,
          overflow: "hidden",
          position: "relative",
          transform: `translate3d(0,0,0)`,
          width: finalWidth,
        }}
      >
        <div
          style={{
            position: "absolute",
            /*left: -x, top: -y,*/ transform: `translateX(${-x}px) translateY(${-y}px)`,
          }}
        >
          <KfSpriteMapSurface
            frameNum={frameIndex + 1}
            frameIndex={frameIndex}
            currentRow={currentRow}
            currentCol={currentCol}
            {...otherProps}
          />
        </div>
      </div>
    );
  }
}
