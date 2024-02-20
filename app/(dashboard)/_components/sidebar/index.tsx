import Image from "next/image"

export const Sidebar = () => {
    return (
        <aside className="fixed z-[1] left-0 bg-blue-950 h-full w-[60px] flex flex-col gap-y-4 text-white">
            <div className="h-[60px] w-full flex items-center justify-center">
                <Image
                    src="/board.png" 
                    alt="Logo" 
                    width={40} 
                    height={40} 
                />
            </div>
        </aside>
    )
}