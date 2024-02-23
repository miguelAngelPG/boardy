import { cn, colorToCss, getContrastingTextColor } from "@/lib/utils";
import { useMutation } from "@/liveblocks.config";
import { NoteLayer } from "@/types/canvas";
import { Kalam } from "next/font/google";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

const font = Kalam({
    subsets: ['latin'],
    weight: ['400'],
})

const calculateFontSize = (width: number, height: number) => {
    const maxFontSize = 96
    const scaleFactor = 0.5
    const fontSizeBasedOnWidth = width * scaleFactor
    const fontSizeBasedOnHeight = height * scaleFactor

    return Math.min(
        fontSizeBasedOnHeight, 
        fontSizeBasedOnWidth, 
        maxFontSize)
}

interface NoteProps {
    id: string
    layer: NoteLayer
    onPointerDown: (e: React.PointerEvent, layerId: string) => void
    selectionColor: string
}

export const Note = ({
    id,
    layer,
    onPointerDown,
    selectionColor
}: NoteProps) => {

    const { x, y, width, height, fill, value } = layer

    const updateValue = useMutation((
        { storage },
        newValue: string
    ) => {
        const liveLayers = storage.get('layers')

        liveLayers.get(id)?.set('value', newValue)
    }, [])

    const handleContentChange = (e: ContentEditableEvent) => {
        updateValue(e.target.value)
    }

    return (
        <foreignObject
            onPointerDown={(e) => onPointerDown(e, id)}
            style={{
                outline: selectionColor ? `1px solid ${selectionColor}` : 'none',
                backgroundColor: fill ? colorToCss(fill) : "#CCC"
            }}
            className="drop-shadow-xl shadow-md"
            x={x}
            y={y}
            width={ width }
            height={ height }
        >
            <ContentEditable
                html={value || 'Text'}
                onChange={handleContentChange}
                className={cn(
                    "h-full w-full flex items-center justify-center text-center outline-none",
                    font.className
                )}
                style={{
                    fontSize: calculateFontSize(width, height),
                    color: fill ? getContrastingTextColor(fill) : "#000",
                }}
            />

        </foreignObject>
    )
}
