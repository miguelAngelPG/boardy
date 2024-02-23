'use client'

import { useStorage } from "@/liveblocks.config";
import { LayerType } from "@/types/canvas";
import { memo } from "react";
import { Rectangle } from "./rectangle";
import { Ellipse } from "./ellipse";
import { Text } from "./text";
import { Note } from "./note";

interface LayerPreviewProps {
    layerId: string;
    onLayerPinterDown: ( e:React.PointerEvent, layerId: string) => void;
    selectionColor: string;
}

export const LayerPreview = memo((
    {
        layerId,
        onLayerPinterDown,
        selectionColor
    }: LayerPreviewProps
) => {

    const layer = useStorage((root) => root.layers.get(layerId))

    if (!layer) {
        return null
    }

    switch (layer.type) {
        case LayerType.Note:
            return (
                <Note
                    id={layerId}
                    layer={layer}
                    onPointerDown={onLayerPinterDown}
                    selectionColor={selectionColor}
                />
            )
        case LayerType.Text:
            return (
                <Text
                    id={layerId}
                    layer={layer}
                    onPointerDown={onLayerPinterDown}
                    selectionColor={selectionColor}
                />
            )
        case LayerType.Ellipse:
            return (
                <Ellipse
                    id={layerId}
                    layer={layer}
                    onPointerDown={onLayerPinterDown}
                    selectionColor={selectionColor}
                />
            )
        case LayerType.Rectangle:
            return (
                <Rectangle
                    id={layerId}
                    layer={layer}
                    onPointerDown={onLayerPinterDown}
                    selectionColor={selectionColor}
                />
            )
        default:
            console.warn('Unknown layer type', layer)
            return null
    }
})

LayerPreview.displayName = 'LayerPreview'