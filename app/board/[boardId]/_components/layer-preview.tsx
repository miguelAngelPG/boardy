'use client'

import { useStorage } from "@/liveblocks.config";
import { LayerType } from "@/types/canvas";
import { memo } from "react";
import { Rectangle } from "./rectangle";

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