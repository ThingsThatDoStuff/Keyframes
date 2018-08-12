// tslint:disable:jsx-no-lambda no-shadowed-variable

import { KfSpriteMapSurfaceAnimator } from "./KfSpriteMapSurfaceAnimator";

import { KfImageSurface } from "./KfImageSurface";

import { mapValueInRange } from "./mapValueInRange";

/**
 * Original work Copyright (c) 2016-present, Facebook, Inc.
 * Modifications Copyright (c) 2018, Things That Do Stuff, LLC
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import { IKfDocument } from "./KeyframesTypes";
import { KfSpriteMapSurface } from "./KfSpriteMapSurface";

// require('art/modes/current').setCurrent(require('art/modes/dom'));

class KfDemo extends React.PureComponent<
  {
    fps: number;
    duration: number;
    renderWithProgressAndSize: (progress: number, size: number) => React.ReactElement<any>;
    hasProgress?: boolean;
    [key: string]: any;
  },
  {
    animating: boolean;
    progress: number;
    size: number;
    shouldRenderStuff: boolean;
  }
> {
  public state = {
    animating: false,
    progress: 0,
    shouldRenderStuff: false,
    size: 64,
  };

  private animationStartTime: number;
  private animationEndTime: number;
  private nextFrameStartTime: number;

  private rafTimer: number;
  public handleRAF = () => {
    this.rafTimer = -1;
    if (!this.state.animating) {
      return false;
    }
    const now = Date.now();
    if (!(this.nextFrameStartTime && this.animationEndTime)) {
      this.nextFrameStartTime = now;
      this.animationEndTime = now + this.props.duration;
    }
    if (!(now < this.nextFrameStartTime)) {
      let { progress } = this.state;
      if (+progress !== +progress) {
        progress = 0;
      }
      if (progress === 0) {
        this.animationStartTime = now;
        this.animationEndTime = now + this.props.duration;
      }
      const frameTime = 1000 / this.props.fps;
      this.nextFrameStartTime = now + frameTime;
      progress = mapValueInRange(
        this.nextFrameStartTime, // value
        this.animationStartTime, // fromLow
        this.animationEndTime, // fromHigh
        0, // toLow
        1, // toHigh
      );
      // if (progress !== progress) {
      //   console.error("progress NaN");
      //   // debugger;
      // }

      if (progress > 1) {
        progress = 0;
      }
      this.setState({ progress });
    }
    this.tickRAF();
    return true;
  };

  public tickRAF() {
    if (this.rafTimer) {
      window.cancelAnimationFrame(this.rafTimer);
    }
    this.rafTimer = window.requestAnimationFrame(this.handleRAF);
  }
  public componentDidMount() {
    this.tickRAF();
  }
  public componentWillUnmount() {
    if (this.rafTimer) {
      window.cancelAnimationFrame(this.rafTimer);
    }
  }
  // tslint:disable-next-line:variable-name
  public componentWillUpdate(_nextProps: any, nextState: { animating: any }) {
    if (nextState.animating && !this.state.animating) {
      this.tickRAF();
    }
  }

  public render() {
    const { progress, animating, size } = this.state;
    return (
      <div>
        <table style={{ width: "100%" }}>
          <tbody>
            <tr>
              <th style={{ width: 1 }}>Size</th>
              <td>
                <input
                  style={{ width: "100%" }}
                  type="range"
                  value={size}
                  min={16}
                  max={512}
                  step={4}
                  onChange={({ target: { valueAsNumber: size } }) => this.setState({ size })}
                />
              </td>
              <td style={{ width: 1 }}>
                <input
                  style={{ width: "8ex" }}
                  type="number"
                  value={size}
                  min={16}
                  max={512}
                  step={4}
                  onChange={({ target: { valueAsNumber: size } }) => this.setState({ size })}
                />
              </td>
            </tr>
            {this.props.hasProgress && (
              <tr>
                <th style={{ width: 1 }}>Progress</th>
                <td>
                  <input
                    style={{ width: "100%" }}
                    type="range"
                    value={progress}
                    min={0}
                    max={1}
                    step={1 / 9999}
                    onChange={({ target: { valueAsNumber: progress } }) =>
                      this.setState({ progress })
                    }
                  />
                </td>
                <td style={{ width: 1 }}>
                  <input
                    style={{ width: "8ex" }}
                    type="number"
                    value={progress}
                    min={0}
                    max={1}
                    step={1 / 9999}
                    onChange={({ target: { valueAsNumber: progress } }) =>
                      this.setState({ progress })
                    }
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <br />
        {this.props.hasProgress && (
          <label>
            <b>Animating?</b>{" "}
            <input
              type="checkbox"
              checked={animating}
              onChange={({ target: { checked: animating } }) => this.setState({ animating })}
            />
          </label>
        )}
        <br />
        {((this.props.shouldRender || this.state.shouldRenderStuff) &&
          this.props.renderWithProgressAndSize(progress, size)) || (
          <div>
            <button onClick={() => this.setState({ shouldRenderStuff: true })}>Initialize</button>
          </div>
        )}
      </div>
    );
  }
}

ReactDOM.render(
  <div>
    <h2>SpriteMapped fps capped</h2>
    <KfDemo
      hasProgress={true}
      fps={24}
      duration={4000}
      renderWithProgressAndSize={(progress, size) => (
        <div>
          <KfSpriteMapSurfaceAnimator
            width={size}
            progress={progress}
            doc={require("./assets/sorry.json") as IKfDocument}
          />
          <KfSpriteMapSurfaceAnimator
            width={size}
            progress={progress}
            doc={require("./assets/anger.json") as IKfDocument}
          />
          <KfSpriteMapSurfaceAnimator
            width={size}
            progress={progress}
            doc={require("./assets/haha.json") as IKfDocument}
          />
          <KfSpriteMapSurfaceAnimator
            width={size}
            progress={progress}
            doc={require("./assets/like.json") as IKfDocument}
          />
          <KfSpriteMapSurfaceAnimator
            width={size}
            progress={progress}
            doc={require("./assets/yay.json") as IKfDocument}
          />
          <KfSpriteMapSurfaceAnimator
            width={size}
            progress={progress}
            doc={require("./assets/love.json") as IKfDocument}
          />
        </div>
      )}
    />

    <hr />

    <h2>Render on demand</h2>
    <KfDemo
      hasProgress={true}
      fps={24}
      duration={4000}
      renderWithProgressAndSize={(progress, size) => (
        <div>
          <KfImageSurface
            width={size}
            progress={progress}
            doc={require("./assets/sorry.json") as IKfDocument}
          />
          <KfImageSurface
            width={size}
            progress={progress}
            doc={require("./assets/anger.json") as IKfDocument}
          />
          <KfImageSurface
            width={size}
            progress={progress}
            doc={require("./assets/haha.json") as IKfDocument}
          />
          <KfImageSurface
            width={size}
            progress={progress}
            doc={require("./assets/like.json") as IKfDocument}
          />
          <KfImageSurface
            width={size}
            progress={progress}
            doc={require("./assets/yay.json") as IKfDocument}
          />
          <KfImageSurface
            width={size}
            progress={progress}
            doc={require("./assets/love.json") as IKfDocument}
          />
        </div>
      )}
    />
    <hr />

    <h2>SpriteMap</h2>
    <KfDemo
      fps={24}
      duration={4000}
      renderWithProgressAndSize={size => (
        <div>
          <KfSpriteMapSurface width={size} doc={require("./assets/sorry.json") as IKfDocument} />
          <KfSpriteMapSurface width={size} doc={require("./assets/anger.json") as IKfDocument} />
          <KfSpriteMapSurface width={size} doc={require("./assets/haha.json") as IKfDocument} />
          <KfSpriteMapSurface width={size} doc={require("./assets/like.json") as IKfDocument} />
          <KfSpriteMapSurface width={size} doc={require("./assets/yay.json") as IKfDocument} />
          <KfSpriteMapSurface width={size} doc={require("./assets/love.json") as IKfDocument} />
        </div>
      )}
    />
  </div>,
  document.getElementById("KfDemoRoot"),
);
