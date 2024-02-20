'use client'

import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { useOrganization } from "@clerk/nextjs"
import { useMutation } from "convex/react"
import Image from "next/image"

export const EmptyBoards = () => {

    const { organization } = useOrganization()
    const create = useMutation(api.board.create)

    const handleCreateBoard = () => {
        if (!organization) return

        create({
            orgId: organization.id,
            title: 'Untitled'
        })
    }

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <Image
                src="/note.png"
                alt="Empty"
                width={110}
                height={110}
            />
            <h2 className="text-2xl font-semibold mt-6">
                Create your first board
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
                Start by creating a board for your organization
            </p>
            <div className="mt-6">
                <Button size='lg'  onClick={ handleCreateBoard }>
                    Create Board
                </Button>
            </div>
        </div>
    )
}