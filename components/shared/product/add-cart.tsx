'use client'

import { Button } from "@/components/ui/button";
import { TCart, TCartItem } from "@/types";
import { useRouter } from "next/navigation";
import { Plus, Minus, Loader } from "lucide-react";
import { toast } from "sonner";
import { removeItemFromCart, addItemToCart } from "@/lib/actions/cart.actions";
import { useState } from "react";

interface AddToCartProps {
    item: TCartItem;
    cart?: TCart;
}

const AddToCart = ({ item, cart }: AddToCartProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const handleAddToCart = async () => {
        setIsLoading(true);
        const res = await addItemToCart(item);
        setIsLoading(false);

        if (!res.success) {
            toast.error(res.message);
            return;
        }

        toast(res.message, {
            action: {
                label: "Go To Cart",
                onClick: () => router.push("/cart"),
            },
        });
    };

    const handleRemoveFromCart = async () => {
        setIsLoading(true);
        const res = await removeItemFromCart(item.productId);
        setIsLoading(false);

        if (!res.success) {
            toast.error(res.message);
            return;
        }

        toast(res.message, {
            action: {
                label: "Go To Cart",
                onClick: () => router.push("/cart"),
            },
        });
    };

    const foundCartItem =
        cart && cart.items.find((cartItem) => cartItem.productId === item.productId);

    return foundCartItem ? (
        <div>
            <Button type="button" variant="outline" onClick={handleRemoveFromCart} disabled={isLoading}>
                {isLoading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                ) : (
                    <Minus className="w-4 h-4" />
                )}
            </Button>
            <span className="px-2">{foundCartItem.quantity}</span>
            <Button type="button" variant="outline" onClick={handleAddToCart} disabled={isLoading}>
                {isLoading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                ) : (
                    <Plus className="w-4 h-4" />
                )}
            </Button>
        </div>
    ) : (
        <Button className="w-full" type="button" onClick={handleAddToCart} disabled={isLoading}>
            {isLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
            ) : (
                <Plus className="w-4 h-4" />
            )}{" "}
            Add To Cart
        </Button>
    );
};

export default AddToCart;