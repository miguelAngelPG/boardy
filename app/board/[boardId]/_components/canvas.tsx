'use client'

import { useCallback, useState } from "react";
import { Info } from "./info"
import { Participants } from "./participants"
import { Toolbar } from "./toolbar"
import { Camera, CanvasMode, Color, Layer, LayerType, Point, canvasState } from "@/types/canvas";
import { useCanRedo, useCanUndo, useHistory, useMutation, useStorage } from "@/liveblocks.config";
import { CursorsPresence } from "./cursors-presence";
import { pointerEventToCanvasPoint } from "@/lib/utils";
import { nanoid } from "nanoid";
import { LiveObject } from "@liveblocks/client";
import { LayerPreview } from "./layer-preview";

const MAX_LAYERS = 100
interface CanvasProps {
    boardId: string;
}

export const Canvas = ({ boardId }: CanvasProps) => {

    const layerIds = useStorage((root) => root.layerIds)

    const [canvasSate, setCanvasSate] = useState<canvasState>({
        mode: CanvasMode.None
    })

    const [camera, setCamera] = useState<Camera>({ x:0, y:0 })
    const [lastUsedColor, setLastUsedColor] = useState<Color>({
        r: 0,
        g: 0,
        b: 0
    })

    const history = useHistory()
    const canUndo = useCanUndo()
    const canRedo = useCanRedo() 

    const insertLayer = useMutation((
        { storage, setMyPresence }, 
        layerType: LayerType.Ellipse | LayerType.Rectangle | LayerType.Text | LayerType.Note,
        position: Point
    ) => {

        const liveLayers = storage.get('layers')
        if (liveLayers.size >= MAX_LAYERS) {
            return
        }
        
        const liveLayerId = storage.get('layerIds')
        const layerId = nanoid()
        const layer = new LiveObject({
            type: layerType,
            x: position.x,
            y: position.y,
            height: 100,
            width: 100,
            fill: lastUsedColor,
        }) 

        liveLayerId.push(layerId)
        liveLayers.set(layerId, layer)

        setMyPresence({ selection: [layerId] }, { addToHistory: true })
        setCanvasSate({ mode: CanvasMode.None })
    }, [lastUsedColor])

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

    const onPointerLeave = useMutation(({ setMyPresence }) => {
        setMyPresence({ cursor: null })
    }, [])

    const onPointerUp = useMutation(({ setMyPresence }, e) => {
        const point = pointerEventToCanvasPoint(e, camera)

        if (canvasSate.mode === CanvasMode.Inserting) {
            insertLayer(canvasSate.layerType, point)
        }else{
            setCanvasSate({ mode: CanvasMode.None })
        }

        history.resume()
    }, [ camera, canvasSate, insertLayer, history ])

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
                className="h-[100vh] w-[100vw]"
                onWheel={ onWheel }
                onPointerMove={ onPointerMove }
                onPointerLeave={ onPointerLeave }
                onPointerUp={ onPointerUp }
            >
                <g
                    style={{
                        transform: `translate(${-camera.x}px, ${-camera.y}px)`
                    }}
                >
                    {
                        layerIds.map((layerId) => {
                            return(
                                <LayerPreview 
                                    key={layerId} 
                                    layerId={layerId}
                                    onLayerPinterDown={() => {}}
                                    selectionColor='#000'
                                />
                            )}
                        )
                    }
                    <CursorsPresence/>
                </g>
            </svg>
        </main>
    )
}