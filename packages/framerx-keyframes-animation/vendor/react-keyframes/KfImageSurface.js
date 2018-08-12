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
var KfImageSurface = /** @class */ (function (_super) {
    __extends(KfImageSurface, _super);
    function KfImageSurface() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KfImageSurface.prototype.render = function () {
        var _a = this.props, width = _a.width, height = _a.height, _b = _a.doc.canvas_size, docWidth = _b[0], docHeight = _b[1];
        return (React.createElement(Surface, { width: width || height || docWidth, height: height || width || docHeight },
            React.createElement(KfDrawable, __assign({}, this.props))));
    };
    return KfImageSurface;
}(React.PureComponent));
export { KfImageSurface };
//# sourceMappingURL=KfImageSurface.js.map