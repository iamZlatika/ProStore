'use client';

import { Button } from '@/components/ui/button';
import type { TCart, TCartItem } from '@/types';
import { useRouter } from 'next/navigation';
import { Plus, Minus, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { removeItemFromCart, addItemToCart } from '@/lib/actions/cart.actions';
import { useTransition } from 'react';

interface AddToCartProps {
  item: TCartItem;
  cart?: TCart;
}

const AddToCart = ({ item, cart }: AddToCartProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = () => {
    startTransition(async () => {
      const res = await addItemToCart(item);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast(res.message, {
        action: {
          label: 'Go To Cart',
          onClick: () => router.push('/cart'),
        },
      });
    });
  };

  const handleRemoveFromCart = () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast(res.message, {
        action: {
          label: 'Go To Cart',
          onClick: () => router.push('/cart'),
        },
      });
    });
  };

  const foundCartItem =
    cart && cart.items.find((cartItem) => cartItem.productId === item.productId);

  return foundCartItem ? (
    <div>
      <Button type="button" variant="outline" onClick={handleRemoveFromCart} disabled={isPending}>
        {isPending ? <Loader className="w-4 h-4 animate-spin" /> : <Minus className="w-4 h-4" />}
      </Button>
      <span className="px-2">{foundCartItem.quantity}</span>
      <Button type="button" variant="outline" onClick={handleAddToCart} disabled={isPending}>
        {isPending ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
      </Button>
    </div>
  ) : (
    <Button className="w-full" type="button" onClick={handleAddToCart} disabled={isPending}>
      {isPending ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add
      To Cart
    </Button>
  );
};

export default AddToCart;
