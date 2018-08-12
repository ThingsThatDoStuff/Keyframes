
    import * as React from "react";

    const style: React.CSSProperties = {
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      color: "#8855FF",
      background: "rgba(136, 85, 255, 0.1)",
      overflow: "hidden"
    };

    export class KeyframesAnimation extends React.Component {
      render() {
        return <div style={style}>Hello World!</div>;
      }
    }
    