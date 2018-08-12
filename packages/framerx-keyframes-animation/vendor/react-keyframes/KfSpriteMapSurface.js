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
import * as React from "react";
import { Surface } from "react-art";
import { KfDrawable } from "./KfDrawable";
var KfSpriteMapSurface = /** @class */ (function (_super) {
    __extends(KfSpriteMapSurface, _super);
    function KfSpriteMapSurface() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KfSpriteMapSurface.prototype.render = function () {
        var _a = this.props, width = _a.width, height = _a.height, _b = _a.doc, _c = _b.canvas_size, docWidth = _c[0], docHeight = _c[1], animation_frame_count = _b.animation_frame_count;
        var finalWidth = width || height || docWidth;
        var finalHeight = height || width || docHeight;
        var frameCount = animation_frame_count;
        var cols = Math.ceil(Math.sqrt(frameCount));
        var rows = Math.ceil(frameCount / cols);
        var frames = new Array(frameCount);
        var frameIndex = -1;
        var currentRow = 0;
        var currentCol = 0;
        while (++frameIndex < frameCount) {
            var x = finalWidth * currentCol;
            var y = finalHeight * currentRow;
            frames[frameIndex] = (React.createElement(KfDrawable, __assign({ key: frameIndex }, this.props, { progress: frameIndex / frameCount, x: x, y: y })));
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
        return (React.createElement(Surface, { width: finalWidth * cols, height: finalHeight * rows }, frames));
    };
    return KfSpriteMapSurface;
}(React.PureComponent));
export { KfSpriteMapSurface };
//# sourceMappingURL=KfSpriteMapSurface.js.map