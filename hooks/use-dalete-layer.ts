import { useMutation, useSelf } from "@/liveblocks.config"

export const useDeleteLayer = () => {
    const selection = useSelf((self) => self.presence.selection)

    const a = useMutation(({ storage, setMyPresence }) => {
        const liveLayers = storage.get('layers')
        const liveLayersId = storage.get('layerIds')

        for (const id of selection) {
            liveLayers.delete(id)

            const index = liveLayersId.indexOf(id)

            if (index !== -1) {
                liveLayersId.delete(index)
            }
        }

        setMyPresence({ selection: [] }, { addToHistory: true })

    }, [selection])

    return a
}