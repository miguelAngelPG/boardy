'use client'

import Image from "next/image"
import Link from "next/link"
import { Overlay } from "./overlay"
import { useAuth } from "@clerk/nextjs"
import { formatDistanceToNow } from "date-fns"
import { Footer } from "./footer"
import { Skeleton } from "@/components/ui/skeleton"
import { Actions } from "@/components/actions"
import { MoreHorizontal } from "lucide-react"
import { useApiMutation } from "@/hooks/use-api-mutatuion"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"

interface BoardCardProps {
    id: string
    title: string
    imageUrl: string
    authorName: string
    authorId: string
    createdAt: string
    orgId: string
    isFavorite: boolean
}

export const BoardCard = ({
    id,
    title,
    imageUrl,
    authorName,
    authorId,
    createdAt,
    orgId,
    isFavorite
}: BoardCardProps) => {

    const { userId } = useAuth()

    const authorLabel = userId === authorId ? "You" : authorName

    const createAtDateLabel = formatDistanceToNow(createdAt, {
        addSuffix: true
    })

    const { mutate: onFavorite, pending: pendingFavorite } = useApiMutation(api.board.favorite)
    const { mutate: onUnfavorite, pending: pendingUnfavorite } = useApiMutation(api.board.unfavorite)

    const toogleFavorite = () => {
        if (isFavorite) {
            onUnfavorite({ id })
                .catch(() => toast.error("Failed to unfavorite"))
        } else {
            onFavorite({ id, orgId })
                .catch(() => toast.error("Failed to favorite"))
        }
    }

    return (
        <Link href={`/board/${id}`}>
            <div className="group aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden">
                <div className="relative flex-1 bg-amber-50">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-fit"                        
                    />
                    <Overlay />
                    <Actions
                        side="right"

                        id={id}
                        title={title}
                        imageUrl={imageUrl}
                        orgId={orgId}

                    >
                        <button 
                            className="absolute opacity-0 top-1 right-1 group-hover:opacity-100 transition-opacity px-3 py-2"
                        >
                            <MoreHorizontal 
                                className="text-white hover:opacity-100 opacity-75 transition-opacity"
                            />
                        </button>
                    </Actions>
                </div>
                <Footer
                    isFavorite={isFavorite}
                    title={title}
                    authorLabel={authorLabel}
                    createAtDateLabel={createAtDateLabel}
                    onclick={ toogleFavorite }
                    disabled={ pendingFavorite || pendingUnfavorite }
                />
            </div>
        </Link>
    )
}

BoardCard.Skeleton = function BoardCardSkeleton() {
    return (
        <div className="aspect-[100/127] rounded-lg overflow-hidden">
            <Skeleton className="h-full w-full" />
        </div>
    )
}