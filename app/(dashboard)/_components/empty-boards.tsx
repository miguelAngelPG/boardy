'use client'

import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { useApiMutation } from "@/hooks/use-api-mutatuion"
import { useOrganization } from "@clerk/nextjs"
import { useMutation } from "convex/react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export const EmptyBoards = () => {

    const router = useRouter()

    const { organization } = useOrganization()
    const { mutate, pending } = useApiMutation(api.board.create)

    const handleCreateBoard = () => {
        if (!organization) return

        mutate({
            orgId: organization.id,
            title: 'Untitled'
        })
            .then((id) => {
                toast.success('Board created successfully')
                router.push(`/board/${id}`)
            })
            .catch((error) => {
                toast.error('Failed to create board. Please try again later.')
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
                <Button size='lg' disabled={ pending } onClick={ handleCreateBoard }>
                    Create Board
                </Button>
            </div>
        </div>
    )
}