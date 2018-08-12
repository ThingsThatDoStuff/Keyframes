export interface IKfDocument {
  key: number;
  name: string;
  canvas_size: KfPoint;
  frame_rate: number;
  animation_frame_count: number;
  features: IKfFeature[];
  animation_groups: IKfAnimationGroup[];
}
export interface IKfAnimationGroup {
  group_id: number;
  group_name: string;
  parent_group?: number;
  animations: KfProperty[];
}
interface IKfFeature {
  name: string;
  fill_color?: string;
  stroke_color?: string;
  stroke_width?: number;
  effects?: {
    gradient?: IKfGradient;
  };
  animation_group?: number;
  feature_animations?: KfProperty[];
  timing_curves?: KfTimingCurve[];
  key_frames: Array<IKfValue<string[]>>;
}
export interface IKfValue<T> {
  start_frame: number;
  data: T;
}
interface IKfAnimatable<T> {
  timing_curves: KfTimingCurve[];
  key_values: Array<IKfValue<T>>;
}
type KfPoint = [number, number];
export type KfProperty =
  | IKfPropertyPosition
  | IKfPropertyRotation
  | IKfPropertyScale
  | IKfPropertyStrokeWidth;
interface IKfPropertyPosition extends IKfAnimatable<KfPoint> {
  property: "POSITION";
  anchor?: KfPoint;
}
interface IKfPropertyRotation extends IKfAnimatable<[number] | [number, number, number]> {
  property: "ROTATION";
  anchor: KfPoint;
}
interface IKfPropertyScale extends IKfAnimatable<KfPoint> {
  property: "SCALE";
  anchor?: KfPoint;
}
interface IKfPropertyStrokeWidth extends IKfAnimatable<[number]> {
  property: "STROKE_WIDTH";
  anchor?: undefined;
}
export type KfTimingCurve = [KfPoint, KfPoint];
export type KfGradientStop = IKfAnimatable<string>;
interface IKfGradient {
  gradient_type: "linear" | "radial";
  color_start?: KfGradientStop;
  color_end?: KfGradientStop;
  ramp_start?: KfGradientStop;
  ramp_end?: KfGradientStop;
}
export interface IKfDrawableProps {
  visible?: boolean;
  doc: IKfDocument;
  progress?: number;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
}
