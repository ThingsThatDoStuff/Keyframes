export interface KfDocument {
  key: number;
  name: string;
  canvas_size: KfPoint;
  frame_rate: number;
  animation_frame_count: number;
  features: KfFeature[];
  animation_groups: KfAnimationGroup[];
}
export interface KfAnimationGroup {
  group_id: number;
  group_name: string;
  parent_group?: number;
  animations: KfProperty[];
}
interface KfFeature {
  name: string;
  fill_color?: string;
  stroke_color?: string;
  stroke_width?: number;
  effects?: {
    gradient?: KfGradient;
  };
  animation_group?: number;
  feature_animations?: KfProperty[];
  timing_curves?: KfTimingCurve[];
  key_frames: KfValue<string[]>[];
}
export interface KfValue<T> {
  start_frame: number;
  data: T;
}
interface KfAnimatable<T> {
  timing_curves: KfTimingCurve[];
  key_values: KfValue<T>[];
}
type KfPoint = [number, number];
export type KfProperty =
  | KfPropertyPosition
  | KfPropertyRotation
  | KfPropertyScale
  | KfPropertyStrokeWidth;
interface KfPropertyPosition extends KfAnimatable<KfPoint> {
  property: "POSITION";
  anchor?: KfPoint;
}
interface KfPropertyRotation
  extends KfAnimatable<[number] | [number, number, number]> {
  property: "ROTATION";
  anchor: KfPoint;
}
interface KfPropertyScale extends KfAnimatable<KfPoint> {
  property: "SCALE";
  anchor?: KfPoint;
}
interface KfPropertyStrokeWidth extends KfAnimatable<[number]> {
  property: "STROKE_WIDTH";
  anchor?: undefined;
}
export type KfTimingCurve = [KfPoint, KfPoint];
export type KfGradientStop = KfAnimatable<string>;
interface KfGradient {
  gradient_type: "linear" | "radial";
  color_start?: KfGradientStop;
  color_end?: KfGradientStop;
  ramp_start?: KfGradientStop;
  ramp_end?: KfGradientStop;
}
export interface KfDrawableProps {
  visible: boolean;
  doc: KfDocument;
  progress: number;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
}
