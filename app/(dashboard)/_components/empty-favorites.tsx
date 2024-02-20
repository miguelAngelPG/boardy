import Image from "next/image"

export const EmptyFavorites = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <Image
                src="/empty-favorites.png"
                alt="Empty"
                width={140}
                height={140}
            />
            <h2 className="text-2xl font-semibold mt-6">
                No favorite boards found
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
                Try favoriting a board
            </p>
        </div>
    )
}