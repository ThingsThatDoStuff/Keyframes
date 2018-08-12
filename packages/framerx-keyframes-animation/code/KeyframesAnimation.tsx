import * as React from "react";
import KfImageSurface from "../vendor/react-keyframes/KfImageSurface";

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

// import anger from "../vendor/react-keyframes/assets/anger.json";

const Animations = {
  anger: require("../vendor/react-keyframes/assets/anger.json")
};

export const KeyframesAnimation: React.SFC<{
  width: number;
  progress?: number;
  animation?: "anger" | "haha" | "like" | "love" | "sorry" | "yay";
}> = ({ width, progress = 0, animation = "like" }) => (
  <KfImageSurface
    width={width}
    progress={progress}
    doc={Animations[animation]}
  />
);
