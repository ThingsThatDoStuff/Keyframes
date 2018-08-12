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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import * as React from "react";
import { KfSpriteMapSurface } from "./KfSpriteMapSurface";
var KfSpriteMapSurfaceAnimator = /** @class */ (function (_super) {
    __extends(KfSpriteMapSurfaceAnimator, _super);
    function KfSpriteMapSurfaceAnimator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KfSpriteMapSurfaceAnimator.prototype.render = function () {
        var _a = this.props, progress = _a.progress, otherProps = __rest(_a, ["progress"]);
        var _b = this.props, style = _b.style, width = _b.width, height = _b.height, _c = _b.doc, _d = _c.canvas_size, docWidth = _d[0], docHeight = _d[1], animation_frame_count = _c.animation_frame_count;
        var finalWidth = width || height || docWidth;
        var finalHeight = height || width || docHeight;
        var frameCount = animation_frame_count;
        var frameIndexMax = frameCount - 1;
        var cols = Math.ceil(Math.sqrt(frameCount));
        var frameIndex = Math.round(frameIndexMax * progress);
        var currentRow = Math.floor(frameIndex / cols);
        var currentCol = frameIndex % cols;
        var x = finalWidth * currentCol;
        var y = finalHeight * currentRow;
        return (React.createElement("div", { style: __assign({}, style, { display: "inline-block", height: finalHeight, overflow: "hidden", position: "relative", transform: "translate3d(0,0,0)", width: finalWidth }) },
            React.createElement("div", { style: {
                    position: "absolute",
                    /*left: -x, top: -y,*/ transform: "translateX(" + -x + "px) translateY(" + -y + "px)",
                } },
                React.createElement(KfSpriteMapSurface, __assign({ frameNum: frameIndex + 1, frameIndex: frameIndex, currentRow: currentRow, currentCol: currentCol }, otherProps)))));
    };
    return KfSpriteMapSurfaceAnimator;
}(React.PureComponent));
export { KfSpriteMapSurfaceAnimator };
//# sourceMappingURL=KfSpriteMapSurfaceAnimator.js.map