import { Button } from '@/components/ui/button';
import { addItemToCart } from '@/lib/actions/cart.actions';
import { TCartItem } from '@/types';
import { Loader, Plus } from 'lucide-react';
import React, { useTransition } from 'react'
import { toast } from "sonner";

interface AddButtonProps {
    item: TCartItem
}
const AddButton = ({ item }: AddButtonProps) => {
    const [isPending, startTransition] = useTransition();
    return (
        <Button
            disabled={isPending}
            variant='outline'
            type='button'
            onClick={() =>
                startTransition(async () => {
                    const res = await addItemToCart(item);

                    if (!res.success) {
                        toast.error(res.message);
                        return;
                    }
                })
            }
        >
            {isPending ? (
                <Loader className='w-4 h-4 animate-spin' />
            ) : (
                <Plus className='w-4 h-4' />
            )}
        </Button>
    );
}

export default AddButton