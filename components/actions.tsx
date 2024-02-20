'use client'

import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Link2, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useApiMutation } from "@/hooks/use-api-mutatuion"
import { api } from "@/convex/_generated/api"
import { ConfirmModal } from "./confirm-modal"
import { Button } from "./ui/button"
import { useState } from "react"

interface ActionsProps {
    children: React.ReactNode
    side?: DropdownMenuContentProps["side"]
    sideOffset?: DropdownMenuContentProps["sideOffset"]
    id: string
    title: string
    imageUrl: string
    orgId: string
}

export const Actions = ({ children, side, sideOffset, id, title, imageUrl, orgId }: ActionsProps) => {

    const [deletedBoard, setDeletedBoard] = useState<string | null>(null)

    const { mutate: remove, pending } = useApiMutation(api.board.remove)
    const { mutate: restore } = useApiMutation(api.board.restore)


    const copyBoardLink = () => {
        navigator.clipboard.writeText(`${window.location.origin}/board/${id}`)
        .then(() => {
            toast.success("Board link copied to clipboard")
            
        })
        .catch(() => {
            toast.error("Failed to copy board link")
        })
    }

    const deleteBoard = () => {
        remove({ id })
        .then(() => {
            toast.success(`Board "${title}" deleted`)
            toast(`Board "${title}" deleted`, {
                description: "",
                action: {
                  label: "Undo",
                  onClick: () => handleUndoBoard(),
                },
            })
            setDeletedBoard(id)
        })
        .catch(() => {
            toast.error(`Failed to delete board "${title}"`)
        })
    }

    const handleUndoBoard = () => {
        restore({ orgId, title, imageUrl })
        .then(() => {
            toast.success(`Board "${title}" restored`)
            setDeletedBoard(null)
        })
        .catch(() => {
            toast.error(`Failed to restore board "${title}"`)
        })
        setDeletedBoard(null)
    }

    return (
        <div className="absolute z-50 top-1 right-1">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    { children }
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    side={side}
                    sideOffset={sideOffset}
                    className="w-60"
                    onClick={(e) => e.stopPropagation()}
                >
                    <DropdownMenuItem
                        onClick={ copyBoardLink } 
                        className="p-3 cursor-pointer"
                    >
                        <Link2 className="h-4 w-4 mr-2"/>
                        Copy board link
                    </DropdownMenuItem>
                    <ConfirmModal
                        onConfirm={ deleteBoard }
                        header="Delete board"
                        description="Are you sure you want to delete this board? This action cannot be undone."
                        disabled={pending}
                    >
                        <Button
                            variant="ghost"
                            // onClick={ deleteBoard } 
                            className="p-3 cursor-pointer text-sm w-full justify-start font-normal"
                        >
                            <Trash2 className="h-4 w-4 mr-2"/>
                                Delete
                        </Button>
                    </ConfirmModal>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
