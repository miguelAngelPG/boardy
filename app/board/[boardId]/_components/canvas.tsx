'use client'

import { use, useCallback, useState } from "react";
import { Info } from "./info"
import { Participants } from "./participants"
import { Toolbar } from "./toolbar"
import { Camera, CanvasMode, canvasState } from "@/types/canvas";
import { useCanRedo, useCanUndo, useHistory, useMutation } from "@/liveblocks.config";
import { CursorsPresence } from "./cursors-presence";
import { pointerEventToCanvasPoint } from "@/lib/utils";

interface CanvasProps {
    boardId: string;
}

export const Canvas = ({ boardId }: CanvasProps) => {

    const [canvasSate, setCanvasSate] = useState<canvasState>({
        mode: CanvasMode.None
    })

    const [camera, setCamera] = useState<Camera>({ x:0, y:0 })

    const history = useHistory()
    const canUndo = useCanUndo()
    const canRedo = useCanRedo() 

    const onWheel = useCallback((e: React.WheelEvent) => {
        setCamera((camera) => ({
                x: camera.x + e.deltaX,
                y: camera.y + e.deltaY
        }))
    }, [])

    const onPointerMove = useMutation(({ setMyPresence }, e: React.PointerEvent) => {
        e.preventDefault()

        const current = pointerEventToCanvasPoint(e, camera)

        setMyPresence({
            cursor: current
        })
    }, [])

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
            <svg
                className="h-screen w-screen"
                onWheel={ onWheel }
                onPointerMove={ onPointerMove }
            >
                <g>
                    <CursorsPresence/>
                </g>
            </svg>
        </main>
    )
}