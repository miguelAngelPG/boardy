'use client'

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Poppins } from "next/font/google";
import Image from "next/image";

interface InfoProps {
    boardId: string;
}

const font = Poppins({
    subsets: ['latin'],
    weight: ['600'],
})

export const Info = ({ boardId }: InfoProps) => {
    const data = useQuery(api.board.get, { id: boardId as Id<'boards'> });
    
    if (!data) return <InfoSkeleton/>

    return (
        <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md"> 
            <Button className="px-2">
                <Image
                    src='/logo.png'
                    alt="Boardy Logo"
                    height={40}
                    width={40}
                />
            </Button>
        </div>
    )
}

export const InfoSkeleton = () => {
    return (
        <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md w-[300px]"/>
    )
}