// tslint:disable:jsx-no-lambda no-shadowed-variable
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import { KfSpriteMapSurface } from "./KfSpriteMapSurface";
// require('art/modes/current').setCurrent(require('art/modes/dom'));
var KfDemo = /** @class */ (function (_super) {
    __extends(KfDemo, _super);
    function KfDemo() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            animating: false,
            progress: 0,
            shouldRenderStuff: false,
            size: 64,
        };
        _this.handleRAF = function () {
            _this.rafTimer = -1;
            if (!_this.state.animating) {
                return false;
            }
            var now = Date.now();
            if (!(_this.nextFrameStartTime && _this.animationEndTime)) {
                _this.nextFrameStartTime = now;
                _this.animationEndTime = now + _this.props.duration;
            }
            if (!(now < _this.nextFrameStartTime)) {
                var progress = _this.state.progress;
                if (+progress !== +progress) {
                    progress = 0;
                }
                if (progress === 0) {
                    _this.animationStartTime = now;
                    _this.animationEndTime = now + _this.props.duration;
                }
                var frameTime = 1000 / _this.props.fps;
                _this.nextFrameStartTime = now + frameTime;
                progress = mapValueInRange(_this.nextFrameStartTime, // value
                _this.animationStartTime, // fromLow
                _this.animationEndTime, // fromHigh
                0, // toLow
                1);
                // if (progress !== progress) {
                //   console.error("progress NaN");
                //   // debugger;
                // }
                if (progress > 1) {
                    progress = 0;
                }
                _this.setState({ progress: progress });
            }
            _this.tickRAF();
            return true;
        };
        return _this;
    }
    KfDemo.prototype.tickRAF = function () {
        if (this.rafTimer) {
            window.cancelAnimationFrame(this.rafTimer);
        }
        this.rafTimer = window.requestAnimationFrame(this.handleRAF);
    };
    KfDemo.prototype.componentDidMount = function () {
        this.tickRAF();
    };
    KfDemo.prototype.componentWillUnmount = function () {
        if (this.rafTimer) {
            window.cancelAnimationFrame(this.rafTimer);
        }
    };
    // tslint:disable-next-line:variable-name
    KfDemo.prototype.componentWillUpdate = function (_nextProps, nextState) {
        if (nextState.animating && !this.state.animating) {
            this.tickRAF();
        }
    };
    KfDemo.prototype.render = function () {
        var _this = this;
        var _a = this.state, progress = _a.progress, animating = _a.animating, size = _a.size;
        return (React.createElement("div", null,
            React.createElement("table", { style: { width: "100%" } },
                React.createElement("tbody", null,
                    React.createElement("tr", null,
                        React.createElement("th", { style: { width: 1 } }, "Size"),
                        React.createElement("td", null,
                            React.createElement("input", { style: { width: "100%" }, type: "range", value: size, min: 16, max: 512, step: 4, onChange: function (_a) {
                                    var size = _a.target.valueAsNumber;
                                    return _this.setState({ size: size });
                                } })),
                        React.createElement("td", { style: { width: 1 } },
                            React.createElement("input", { style: { width: "8ex" }, type: "number", value: size, min: 16, max: 512, step: 4, onChange: function (_a) {
                                    var size = _a.target.valueAsNumber;
                                    return _this.setState({ size: size });
                                } }))),
                    this.props.hasProgress && (React.createElement("tr", null,
                        React.createElement("th", { style: { width: 1 } }, "Progress"),
                        React.createElement("td", null,
                            React.createElement("input", { style: { width: "100%" }, type: "range", value: progress, min: 0, max: 1, step: 1 / 9999, onChange: function (_a) {
                                    var progress = _a.target.valueAsNumber;
                                    return _this.setState({ progress: progress });
                                } })),
                        React.createElement("td", { style: { width: 1 } },
                            React.createElement("input", { style: { width: "8ex" }, type: "number", value: progress, min: 0, max: 1, step: 1 / 9999, onChange: function (_a) {
                                    var progress = _a.target.valueAsNumber;
                                    return _this.setState({ progress: progress });
                                } })))))),
            React.createElement("br", null),
            this.props.hasProgress && (React.createElement("label", null,
                React.createElement("b", null, "Animating?"),
                " ",
                React.createElement("input", { type: "checkbox", checked: animating, onChange: function (_a) {
                        var animating = _a.target.checked;
                        return _this.setState({ animating: animating });
                    } }))),
            React.createElement("br", null),
            ((this.props.shouldRender || this.state.shouldRenderStuff) &&
                this.props.renderWithProgressAndSize(progress, size)) || (React.createElement("div", null,
                React.createElement("button", { onClick: function () { return _this.setState({ shouldRenderStuff: true }); } }, "Initialize")))));
    };
    return KfDemo;
}(React.PureComponent));
ReactDOM.render(React.createElement("div", null,
    React.createElement("h2", null, "SpriteMapped fps capped"),
    React.createElement(KfDemo, { hasProgress: true, fps: 24, duration: 4000, renderWithProgressAndSize: function (progress, size) { return (React.createElement("div", null,
            React.createElement(KfSpriteMapSurfaceAnimator, { width: size, progress: progress, doc: require("./assets/sorry.json") }),
            React.createElement(KfSpriteMapSurfaceAnimator, { width: size, progress: progress, doc: require("./assets/anger.json") }),
            React.createElement(KfSpriteMapSurfaceAnimator, { width: size, progress: progress, doc: require("./assets/haha.json") }),
            React.createElement(KfSpriteMapSurfaceAnimator, { width: size, progress: progress, doc: require("./assets/like.json") }),
            React.createElement(KfSpriteMapSurfaceAnimator, { width: size, progress: progress, doc: require("./assets/yay.json") }),
            React.createElement(KfSpriteMapSurfaceAnimator, { width: size, progress: progress, doc: require("./assets/love.json") }))); } }),
    React.createElement("hr", null),
    React.createElement("h2", null, "Render on demand"),
    React.createElement(KfDemo, { hasProgress: true, fps: 24, duration: 4000, renderWithProgressAndSize: function (progress, size) { return (React.createElement("div", null,
            React.createElement(KfImageSurface, { width: size, progress: progress, doc: require("./assets/sorry.json") }),
            React.createElement(KfImageSurface, { width: size, progress: progress, doc: require("./assets/anger.json") }),
            React.createElement(KfImageSurface, { width: size, progress: progress, doc: require("./assets/haha.json") }),
            React.createElement(KfImageSurface, { width: size, progress: progress, doc: require("./assets/like.json") }),
            React.createElement(KfImageSurface, { width: size, progress: progress, doc: require("./assets/yay.json") }),
            React.createElement(KfImageSurface, { width: size, progress: progress, doc: require("./assets/love.json") }))); } }),
    React.createElement("hr", null),
    React.createElement("h2", null, "SpriteMap"),
    React.createElement(KfDemo, { fps: 24, duration: 4000, renderWithProgressAndSize: function (size) { return (React.createElement("div", null,
            React.createElement(KfSpriteMapSurface, { width: size, doc: require("./assets/sorry.json") }),
            React.createElement(KfSpriteMapSurface, { width: size, doc: require("./assets/anger.json") }),
            React.createElement(KfSpriteMapSurface, { width: size, doc: require("./assets/haha.json") }),
            React.createElement(KfSpriteMapSurface, { width: size, doc: require("./assets/like.json") }),
            React.createElement(KfSpriteMapSurface, { width: size, doc: require("./assets/yay.json") }),
            React.createElement(KfSpriteMapSurface, { width: size, doc: require("./assets/love.json") }))); } })), document.getElementById("KfDemoRoot"));
//# sourceMappingURL=index.js.map