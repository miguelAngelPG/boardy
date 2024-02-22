'use client'

import { use, useState } from "react";
import { Info } from "./info"
import { Participants } from "./participants"
import { Toolbar } from "./toolbar"
import { CanvasMode, canvasState } from "@/types/canvas";
import { useCanRedo, useCanUndo, useHistory } from "@/liveblocks.config";

interface CanvasProps {
    boardId: string;
}

export const Canvas = ({ boardId }: CanvasProps) => {

    const [canvasSate, setCanvasSate] = useState<canvasState>({
        mode: CanvasMode.None
    })

    const history = useHistory()
    const canUndo = useCanUndo()
    const canRedo = useCanRedo() 

    return (
        <main
            className="h-full w-full relative bg-neutral-100 touch-none"
        >
            <Info boardId={boardId}/>
            <Participants/>
            <Toolbar 
                canvasState={canvasSate}
                setCanvasState={setCanvasSate}
                canRedo={ canRedo }
                canUndo={ canUndo }
                undo={ history.undo }
                redo={ history.redo }
            />
        </main>
    )
}