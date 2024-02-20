import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { CreateOrganization } from "@clerk/nextjs"
import Image from "next/image"

export const EmptyOrg = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <Image
                src="/elements.png"
                alt="Empty Organizations"
                width={200}
                height={200}
            />
            <h2 className="mt-6 text-2xl font-semibold">
                Welcome to Boardy
            </h2>
            <p className="mt-2 text-muted-foreground text-sm">
                Create an organization to get started
            </p>
            <div className="mt-6">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size='lg' >
                            Create Organization
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="p-0 bg-transparent border-none max-w-[480px]:">
                        <CreateOrganization />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}