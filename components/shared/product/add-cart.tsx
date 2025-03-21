'use client'

import { Button } from "@/components/ui/button"
import { TCartItem } from "@/types"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { addItemToCart } from "@/lib/actions/cart.actions"
import { toast } from "sonner";

interface AddToCartProps {
    item: TCartItem
}
const AddToCart = ({ item }: AddToCartProps) => {
    const router = useRouter()

    const handleAddToCart = async () => {
        const res = await addItemToCart(item)
        if (!res.success) {
            toast.error(res.message)
            return
        }
        toast(res.message, {
            action: {
                label: "Go To Cart",
                onClick: () => router.push('/cart'),
            },
        })

    }
    return (
        <Button className="w-full" type="button" onClick={handleAddToCart}>
            <Plus />Add To Cart
        </Button>
    )
}

export default AddToCart