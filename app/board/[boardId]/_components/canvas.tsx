'use client'

import React, { useCallback, useMemo, useState } from "react";
import { Info } from "./info"
import { Participants } from "./participants"
import { Toolbar } from "./toolbar"
import { Camera, CanvasMode, Color, Layer, LayerType, Point, Side, XYWH, canvasState } from "@/types/canvas";
import { useCanRedo, useCanUndo, useHistory, useMutation, useOthersMapped, useStorage } from "@/liveblocks.config";
import { CursorsPresence } from "./cursors-presence";
import { connectionIdToColor, findIntersectingLayersWithRectangle, pointerEventToCanvasPoint, resizeBounds } from "@/lib/utils";
import { nanoid } from "nanoid";
import { LiveObject } from "@liveblocks/client";
import { LayerPreview } from "./layer-preview";
import { SelectionBox } from "./selection-box";
import { SelectionTools } from "./selection-tools";
import { update } from "@/convex/board";

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

    const translateSelectedLayers = useMutation((
        { storage, self },
        point: Point
    ) => {
        if (canvasSate.mode !== CanvasMode.Translating) {
            return
        }

        const offset = {
            x: point.x - canvasSate.current.x,
            y: point.y - canvasSate.current.y
        }

        const liveLayers = storage.get('layers')

        for (const layerId of self.presence.selection) {
            const layer = liveLayers.get(layerId)

            if (layer) {
                layer.update({
                    x: layer.get('x') + offset.x,
                    y: layer.get('y') + offset.y
                })
            }
        }

        setCanvasSate({ mode: CanvasMode.Translating, current: point })
    }, [ canvasSate ])

    const unselectLayer = useMutation(({ self, setMyPresence }) => {
        if (self.presence.selection.length > 0) {
            setMyPresence({ selection: [] }, { addToHistory: true })
        }
    }, [])

    const updateSelectionNet = useMutation((
        { storage, setMyPresence },
        current: Point,
        origin: Point
    ) => {
        const layers = storage.get('layers').toImmutable()

        setCanvasSate({
            mode: CanvasMode.SelectionNet,
            origin,
            current
        })

        const ids = findIntersectingLayersWithRectangle(
            layerIds,
            layers,
            origin,
            current
        )

        setMyPresence({ selection: ids }, { addToHistory: true })

    }, [layerIds])

    const startMultiSelection = useCallback((origin: Point, current: Point) => {
        if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5) {
            setCanvasSate({ mode: CanvasMode.SelectionNet, origin, current })
        }   
    }, [])


    const resizeSelectedLayer = useMutation((
        { storage, self },
        point: Point,
    ) => {
        if (canvasSate.mode !== CanvasMode.Resizing) {
            return
        }

        const bounds = resizeBounds(canvasSate.initialBounds, canvasSate.corner, point)

        const liveLayers = storage.get('layers')
        const layer = liveLayers.get(self.presence.selection[0])

        if (layer) {
            layer.update(bounds)
        }
    }, [canvasSate])

    const onResizeHandlePointerDown = useCallback((
        corner: Side, initialBounds: XYWH
    ) => {
        history.pause()
        setCanvasSate({ mode: CanvasMode.Resizing, corner, initialBounds })
    }, [ history])

    const onWheel = useCallback((e: React.WheelEvent) => {
        setCamera((camera) => ({
                x: camera.x + e.deltaX,
                y: camera.y + e.deltaY
        }))
    }, [])

    const onPointerMove = useMutation(({ setMyPresence }, e: React.PointerEvent) => {
        e.preventDefault()

        const current = pointerEventToCanvasPoint(e, camera)

        if (canvasSate.mode === CanvasMode.Pressing) {
            startMultiSelection(current, canvasSate.origin)
        }

        if (canvasSate.mode === CanvasMode.SelectionNet) {
            updateSelectionNet(current, canvasSate.origin)
        }

        if (canvasSate.mode === CanvasMode.Translating) {
            translateSelectedLayers(current)
        }

        if (canvasSate.mode === CanvasMode.Resizing) {
            resizeSelectedLayer(current)
        }

        setMyPresence({
            cursor: current
        })
    }, [ canvasSate, resizeSelectedLayer, camera, translateSelectedLayers ])

    const onPointerLeave = useMutation(({ setMyPresence }) => {
        setMyPresence({ cursor: null })
    }, [])

    const onPointerdown = useCallback((
        e: React.PointerEvent,
    ) => {
        const point = pointerEventToCanvasPoint(e, camera)

        if (canvasSate.mode === CanvasMode.Inserting) {
            return
        }

        //TODO: Add case for drawing

        setCanvasSate({ origin: point, mode: CanvasMode.Pressing })
    }, [ camera, canvasSate])

    const onPointerUp = useMutation(({ setMyPresence }, e) => {
        const point = pointerEventToCanvasPoint(e, camera)

        if (canvasSate.mode === CanvasMode.None || canvasSate.mode === CanvasMode.Pressing) {
            unselectLayer()
            setCanvasSate({ mode: CanvasMode.None })
        }else if (canvasSate.mode === CanvasMode.Inserting) {
            insertLayer(canvasSate.layerType, point)
        }else{
            setCanvasSate({ mode: CanvasMode.None })
        }

        history.resume()
    }, [ camera, canvasSate, insertLayer, history, unselectLayer ])

    const selections = useOthersMapped((other) => other.presence.selection)

    const onLayerPointerDown = useMutation((
        { self, setMyPresence },
        e: React.PointerEvent,
        layerId: string
    ) => {  
        if ( canvasSate.mode === CanvasMode.Pencil || canvasSate.mode === CanvasMode.Inserting ) {
            return
        }

        history.pause()
        e.stopPropagation()

        const point = pointerEventToCanvasPoint(e, camera)

        if (!self.presence.selection.includes(layerId)) {
            setMyPresence({selection: [layerId]}, { addToHistory: true })
        }

        setCanvasSate({ mode: CanvasMode.Translating, current: point})
    }, [setCanvasSate, history, camera, canvasSate.mode])

    const layerIdsToColorSelection = useMemo(() => {
        const layerIdsToColorSelection: Record<string, string> = {}

        for (const user of selections) {
            const [ connectionId, selection ] = user

            for (const layerId of selection) {
                layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId)
            }
        }

        return layerIdsToColorSelection 
    }, [selections])

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
            <SelectionTools
                camera={camera}
                setLastUsetColor={setLastUsedColor}
            />
            <svg
                className="h-[100vh] w-[100vw]"
                onWheel={ onWheel }
                onPointerMove={ onPointerMove }
                onPointerLeave={ onPointerLeave }
                onPointerUp={ onPointerUp }
                onPointerDown={ onPointerdown }
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
                                    onLayerPinterDown={ onLayerPointerDown }
                                    selectionColor={ layerIdsToColorSelection[layerId] }
                                />
                            )}
                        )
                    }
                    <SelectionBox onResizeHandlePointerDown={ onResizeHandlePointerDown }/>
                    {
                        canvasSate.mode === CanvasMode.SelectionNet && canvasSate.current != null && (
                            <rect
                                className="fill-blue-500/5 stroke-blue-500 stroke-1"
                                x={Math.min(canvasSate.origin.x, canvasSate.current.x)}
                                y={Math.min(canvasSate.origin.y, canvasSate.current.y)}
                                width={Math.abs(canvasSate.origin.x - canvasSate.current.x)}
                                height={Math.abs(canvasSate.origin.y - canvasSate.current.y)}
                            />
                        )
                    }
                    <CursorsPresence/>
                </g>
            </svg>
        </main>
    )
}