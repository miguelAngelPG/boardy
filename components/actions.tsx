'use client'

import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Link2 } from "lucide-react"
import { toast } from "sonner"

interface ActionsProps {
    children: React.ReactNode
    side?: DropdownMenuContentProps["side"]
    sideOffset?: DropdownMenuContentProps["sideOffset"]
    id: string
    title: string
}

export const Actions = ({ children, side, sideOffset, id, title }: ActionsProps) => {

    const copyBoardLink = () => {
        navigator.clipboard.writeText(`${window.location.origin}/board/${id}`)
        .then(() => {
            toast.success("Board link copied to clipboard")
        })
        .catch(() => {
            toast.error("Failed to copy board link")
        })
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
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
