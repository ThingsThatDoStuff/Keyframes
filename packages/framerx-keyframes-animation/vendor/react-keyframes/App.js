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
import * as React from "react";
import "./App.css";
import logo from "./logo.svg";
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    App.prototype.render = function () {
        return (React.createElement("div", { className: "App" },
            React.createElement("header", { className: "App-header" },
                React.createElement("img", { src: logo, className: "App-logo", alt: "logo" }),
                React.createElement("h1", { className: "App-title" }, "Welcome to React")),
            React.createElement("p", { className: "App-intro" },
                "To get started, edit ",
                React.createElement("code", null, "src/App.tsx"),
                " and save to reload.")));
    };
    return App;
}(React.PureComponent));
export default App;
//# sourceMappingURL=App.js.map