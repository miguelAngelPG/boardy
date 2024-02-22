'use client'

import { useOthersConnectionIds } from "@/liveblocks.config"
import { memo } from "react"
import { Cursor } from "./cursor"

const Cursors = () => {
    const ids = useOthersConnectionIds()

    return (
        <>
            {
                ids.map((connectionId) => {
                    return (
                        <Cursor key={ connectionId } connectionId={ connectionId }/>
                    )
                })
            }
        </>
    )
}

export const CursorsPresence = memo(() => {
    return (
        <>
            {/* TODO: Draf pencil */}
            <Cursors/>
        </>
    )
})

CursorsPresence.displayName = 'CursorsPresence'