'use client'

import { api } from "@/convex/_generated/api"
import { useApiMutation } from "@/hooks/use-api-mutatuion"
import { cn } from "@/lib/utils"
import { useMutation } from "convex/react"
import { Plus } from "lucide-react"
import { toast } from "sonner"

interface NewBoardButtonProps {
    orgId: string
    disabled?: boolean
}

export const NewBoardButton = ({ orgId, disabled }: NewBoardButtonProps) => {

    const { mutate, pending } = useApiMutation(api.board.create)

    const handleCreate = () => {
        mutate({ 
            orgId,
            title: "Untitled", 
        })
        .then((id) => {
            toast.success("Board created")
            // TODO: redirect to the new board
        })
        .catch((error) => {
            toast.error("Failed to create board")
            console.error(error)
        })
    }


    return (
        <button
            disabled={ disabled || pending }
            onClick={ handleCreate }
            className={cn(
                "col-span-1 aspect-[100/127] bg-blue-600 rounded-lg hover:bg-blue-800 flex flex-col justify-center items-center py-6",
                (pending || disabled) && "cursor-not-allowed opacity-75 hover:bg-blue-600"
            )}
        >
            <Plus className="h-12 w-12 text-white stroke-1"/>
            <p className="text-sm text-white font-light">
                New Board Button
            </p>
        </button>
    )
}