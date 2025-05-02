import { Button } from '@/components/ui/button'
import React, { useTransition } from 'react'
import { toast } from 'sonner';

interface AdminButtonProps {
    title: string,
    updateAction: (orderId: string) => Promise<{ success: boolean; message: string }>;
    orderId: string
}
const AdminButton = ({ updateAction, title, orderId }: AdminButtonProps) => {
    const [isPending, startTransition] = useTransition()

    const onClickHandler = () => {
        startTransition(async () => {
            const result = await updateAction(orderId)
            toast[result.success ? 'success' : 'error'](result.message);
        })
    }
    return (
        <Button
            type="button"
            disabled={isPending}
            onClick={onClickHandler}
        >
            {isPending ? "Processing" : title}
        </Button>
    )
}

export default AdminButton