export type Color = {
    r: number;
    g: number;
    b: number;
}

export type Camera = {
    x: number;
    y: number;
}

export enum LayerType {
    Rectangle,
    Ellipse,
    Path,
    Text,
    Note
}

export type RectangleLayer = {
    type: LayerType.Rectangle;
    x: number;
    y: number;
    width: number;
    height: number;
    color: Color;
    fill: boolean;
    value?: string;
}

export type EllipseLayer = {
    type: LayerType.Ellipse;
    x: number;
    y: number;
    width: number;
    height: number;
    color: Color;
    fill: boolean;
    value?: string;
}

export type PathLayer = {
    type: LayerType.Path;
    x: number;
    y: number;
    width: number;
    height: number;
    color: Color;
    fill: boolean;
    points: number[][];
    value?: string;
}

export type TextLayer = {
    type: LayerType.Text;
    x: number;
    y: number;
    width: number;
    height: number;
    color: Color;
    fill: boolean;
    value?: string;
}

export type NoteLayer = {
    type: LayerType.Note;
    x: number;
    y: number;
    width: number;
    height: number;
    color: Color;
    fill: boolean;
    value?: string;
}

export type Point = {
    x: number;
    y: number;
}

export type XYWH = {
    x: number;
    y: number;
    width: number;
    height: number;
}

export enum Side {
    Top = 1,
    Bottom = 2,
    Left = 4,
    Right = 8
}

export type canvasState = 
    | {
        mode: CanvasMode.None
    }
    | {
        mode: CanvasMode.SelectionNet
        origin: Point
        curren?: Point
    }
    | {
        mode: CanvasMode.Translating
        curren: Point
    }
    | {
        mode: CanvasMode.Inserting
        LayerType: LayerType.Ellipse | LayerType.Rectangle | LayerType.Path | LayerType.Text | LayerType.Note
    }
    | {
        mode: CanvasMode.Pencil
    }
    | {
        mode: CanvasMode.Pressing
        origin: Point
    }
    | {
        mode: CanvasMode.Resizing
        initialBounds: XYWH
        corner: Side
    }
    
export enum CanvasMode {
    None,
    Pressing,
    SelectionNet,
    Translating,
    Inserting,
    Resizing,
    Pencil,
}