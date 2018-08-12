import { Surface } from "react-art";
import * as React from "react";
import { KfDocument } from "./KeyframesTypes";
import { KfDrawable } from "./KfDrawable";

export class KfSpriteMapSurface extends React.PureComponent<{
  doc: KfDocument;
  width?: number;
  height?: number;
  frameNum?: number;
  frameIndex?: number;
  currentRow?: number;
  currentCol?: number;
}> {
  render() {
    const {
      width,
      height,
      doc: {
        canvas_size: [docWidth, docHeight],
        animation_frame_count
      }
    } = this.props;

    const finalWidth = width || height || docWidth;
    const finalHeight = height || width || docHeight;
    const frameCount = animation_frame_count;
    const cols = Math.ceil(Math.sqrt(frameCount));
    const rows = Math.ceil(frameCount / cols);
    const frames = new Array(frameCount);
    let frameIndex = -1;
    let currentRow = 0;
    let currentCol = 0;

    while (++frameIndex < frameCount) {
      const x = finalWidth * currentCol;
      const y = finalHeight * currentRow;

      frames[frameIndex] = (
        <KfDrawable
          key={frameIndex}
          {...this.props}
          progress={frameIndex / frameCount}
          x={x}
          y={y}
        />
      );

      currentCol++;
      if (currentCol >= cols) {
        currentRow++;
        currentCol = 0;
      }
      if (currentRow > rows) {
        console.warn("sprite map not large enough :'(");
      }
    }

    return (
      <Surface width={finalWidth * cols} height={finalHeight * rows}>
        {frames}
      </Surface>
    );
  }
}
export class KfSpriteMapSurfaceAnimator extends React.Component {
  props: {
    progress: number;
    doc: KfDocument;
    width?: number;
    height?: number;
    style?: {
      [key: string]: any;
    };
  };
  render() {
    const { progress, ...otherProps } = this.props;
    const {
      style,
      width,
      height,
      doc: {
        canvas_size: [docWidth, docHeight],
        animation_frame_count
      }
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
          width: finalWidth,
          height: finalHeight,
          display: "inline-block",
          position: "relative",
          overflow: "hidden",
          transform: `translate3d(0,0,0)`
        }}
      >
        <div
          style={{
            position: "absolute",
            /*left: -x, top: -y,*/ transform: `translateX(${-x}px) translateY(${-y}px)`
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
