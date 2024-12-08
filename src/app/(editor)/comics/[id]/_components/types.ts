export interface DrawLine {
  id: string;
  points: number[];
  tool: string;
}

export interface Shape {
  id: string;
  type: "circle" | "rectangle" | "bubble";
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  draggable: boolean;
  bubbleId?: string;
}

export interface TextAnnotation {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fontFamily: string;
  fill: string;
  draggable: boolean;
  type: "text";
  verticalAlign: boolean;
}
