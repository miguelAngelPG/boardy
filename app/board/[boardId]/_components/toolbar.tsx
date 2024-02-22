import { Circle, MousePointer2, Pencil, Redo2, Square, StickyNote, Type, Undo2 } from "lucide-react"
import { ToolButton } from "./tool-button"
import { CanvasMode, LayerType, canvasState } from "@/types/canvas";


interface ToolbarProps {
    canvasState: canvasState;
    setCanvasState: (newState: canvasState) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;

}

export const Toolbar = (
    { canvasState, setCanvasState, undo, redo, canUndo, canRedo }: ToolbarProps
) => {
    return (
        <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4"> 
            <div className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">
                <ToolButton 
                    icon={MousePointer2} 
                    label="Select" 
                    onClick={ () => setCanvasState({ mode: CanvasMode.None }) }
                    isActive={
                        canvasState.mode === CanvasMode.None ||
                        canvasState.mode === CanvasMode.Translating ||
                        canvasState.mode === CanvasMode.SelectionNet ||
                        canvasState.mode === CanvasMode.Pressing ||
                        canvasState.mode === CanvasMode.Resizing
                    }
                />
                <ToolButton 
                    icon={Type} 
                    label="Text" 
                    onClick={() => setCanvasState({ 
                        mode: CanvasMode.Inserting,
                        LayerType: LayerType.Text
                    })}
                    isActive={
                        canvasState.mode === CanvasMode.Inserting &&
                        canvasState.LayerType === LayerType.Text
                    }
                />
                <ToolButton 
                    icon={StickyNote} 
                    label="Sticky Note" 
                    onClick={() => setCanvasState({
                        mode: CanvasMode.Inserting,
                        LayerType: LayerType.Note

                    })}
                    isActive={
                        canvasState.mode === CanvasMode.Inserting &&
                        canvasState.LayerType === LayerType.Note
                    }
                />
                <ToolButton 
                    icon={Square} 
                    label="Rectangle" 
                    onClick={() => setCanvasState({
                        mode: CanvasMode.Inserting,
                        LayerType: LayerType.Rectangle
                    })}
                    isActive={
                        canvasState.mode === CanvasMode.Inserting &&
                        canvasState.LayerType === LayerType.Rectangle
                    }
                />
                <ToolButton 
                    icon={Circle} 
                    label="Ellipse" 
                    onClick={() => setCanvasState({
                        mode: CanvasMode.Inserting,
                        LayerType: LayerType.Ellipse
                    })}
                    isActive={
                        canvasState.mode === CanvasMode.Inserting &&
                        canvasState.LayerType === LayerType.Ellipse
                    }
                />
                <ToolButton 
                    icon={Pencil} 
                    label="Pen" 
                    onClick={() => setCanvasState({ mode: CanvasMode.Pencil })}
                    isActive={
                        canvasState.mode === CanvasMode.Pencil
                    }
                />
            </div>
            <div className="bg-white rounded-md p-1.5 flex flex-col items-center shadow-md">
                <ToolButton 
                    icon={Undo2} 
                    label="Undo" 
                    onClick={ undo}
                    isDisabled={ !canUndo }
                />
                <ToolButton 
                    icon={Redo2} 
                    label="Redo" 
                    onClick={ redo }
                    isDisabled={ !canRedo }
                />
            </div>
        </div>
    )
}

export const ToolbarSkeleton = () => {
    return (
        <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4 bg-white h-[360px] w-[52px] shadow-md rounded-md"/> 
    )
}