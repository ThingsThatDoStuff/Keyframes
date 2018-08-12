import * as React from "react";
import { Surface } from "react-art";
import { IKfDocument } from "./KeyframesTypes";
import { KfDrawable } from "./KfDrawable";

export class KfSpriteMapSurface extends React.PureComponent<{
  doc: IKfDocument;
  width?: number;
  height?: number;
  frameNum?: number;
  frameIndex?: number;
  currentRow?: number;
  currentCol?: number;
}> {
  public render() {
    const {
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
        // tslint:disable-next-line:no-console
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
