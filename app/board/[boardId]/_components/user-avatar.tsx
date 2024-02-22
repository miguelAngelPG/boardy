import { Hint } from "@/components/hint";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Avatar } from "@radix-ui/react-avatar";

interface ActionsProps {
    src?: string;
    name?: string;
    fallback?: string;
    borderColor?: string;
}

export const UserAvatar = ({ src, name, fallback, borderColor }: ActionsProps) => {
    return (
        <Hint label={name || 'Teammate'} side="bottom" sideOffset={10}>
            <Avatar
                
                className="h-8 w-8 border-2 rounded-full overflow-hidden "
                style={{ borderColor }}
            >
                <AvatarImage src={src}/>
                <AvatarFallback>
                    { fallback }
                </AvatarFallback>
            </Avatar>
        </Hint>
    )
}
