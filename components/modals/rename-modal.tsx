'use client'

import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogFooter,
    DialogHeader,
    DialogClose
} from '@/components/ui/dialog'
import { useRenameModal } from '@/store/use-rename-modal'
import { FormEventHandler, useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useApiMutation } from '@/hooks/use-api-mutatuion'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'

export const RenameModal = () => {

    const { mutate, pending } = useApiMutation(api.board.update)
    const { isOpen, initialValues, onClose } = useRenameModal()
    const [ title, setTitle ] = useState(initialValues.title)

    useEffect(() => {
        setTitle(initialValues.title)
    }, [initialValues.title])

    const handleRename: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()

        mutate({ id: initialValues.id, title })
        .then(() => {
            toast.success('Board renamed successfully')
            onClose()
        })
        .catch(() => {
            toast.error('Failed to rename board')
            onClose()
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Board Title</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Enter a new title for this board
                </DialogDescription>
                <form onSubmit={handleRename} className='space-y-4'>
                    <Input
                        disabled={ pending }
                        required
                        maxLength={60}
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder='Enter a new title for this board'
                    />
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type='button' variant='outline'>Cancel</Button>
                        </DialogClose>
                        <Button disabled={ pending } type='submit'>Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}