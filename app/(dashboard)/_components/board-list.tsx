'use client'

import { useQuery } from "convex/react"
import { EmptyBoards } from "./empty-boards"
import { EmptyFavorites } from "./empty-favorites"
import { EmptySearch } from "./empty-search"
import { api } from "@/convex/_generated/api"
import { BoardCard } from "./board-card"

interface BoardListProps {
    orgId: string
    query: {
        search?: string
        favorites?: string
    }
}

export const BoardList = ({ orgId, query }: BoardListProps) => {
    
    const data = useQuery(api.boards.get, { orgId })

    if (data === undefined) {
        return <div>Loading...</div>
    }

    if (!data.length && query.search) return <EmptySearch />

    if (!data.length && query.favorites) return <EmptyFavorites />

    if (!data.length) return <EmptyBoards />

    return (
        <div>
            <h2 className="text-3xl">
                {
                    query.favorites ? 'Favorites boards' : 'Team Boards'
                }
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
                    {
                        data.map((board: any) => (
                            <BoardCard
                                key={board._id}
                                id={board._id}
                                title={board.title}
                                imageUrl={board.imageUrl}
                                authorName={board.authorName}
                                authorId={board.authorId}
                                createdAt={board._creationTime}
                                orgId={board.orgId}
                                isFavorite={false}
                            />
                        ))
                    }
                </div>
            </h2>
        </div>
    )
}