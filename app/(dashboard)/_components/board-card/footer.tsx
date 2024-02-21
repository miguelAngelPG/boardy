import { cn } from "@/lib/utils"
import { on } from "events"
import { Star } from "lucide-react"

interface FooterProps {
    isFavorite: boolean
    title: string
    authorLabel: string
    createAtDateLabel: string
    onclick: () => void
    disabled: boolean
}

export const Footer = ({ isFavorite, title, authorLabel, createAtDateLabel, onclick, disabled }: FooterProps) => {

    const handleClick = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.stopPropagation()
        e.preventDefault()
        onclick()
    }

    return (
        <footer className="relative bg-white p-3">
            <p className="text-[13px] truncate max-w-[calc(100%-20px)] leading-[20px]">
                {title}
            </p>
            <p className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] leading-[18px] text-muted-foreground truncate">
                {authorLabel} - {createAtDateLabel}
            </p>
            <button 
                disabled={ disabled }
                onClick={ handleClick }
                className={cn(
                    "opacity-0 group-hover:opacity-100 transition absolute top-3 right-3 textmuted-foreground hover:text-blue-600",
                    disabled && "cursor-not-allowed opacity-75"
                )}
            >
                <Star
                    className={cn(
                        "w-4 h-4",
                        isFavorite && "fill-blue-600 text-blue-600"
                    )}
                />
            </button>
        </footer>
    )    
}