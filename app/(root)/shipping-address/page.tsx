import { auth } from '@/auth';
import { getMyCart } from '@/lib/actions/cart.actions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { TShippingAddress } from '@/types';
import ShippingAddressForm from '@/components/shared/shipping/shipping-address-form';
import { getUserbyId } from '@/lib/actions/user.actions';
import CheckoutSteps from '@/components/shared/checkout-steps';

export const metadata: Metadata = {
    title: 'Shipping Address',
};


const ShippingAddress = async () => {

    const cart = await getMyCart()

    if (!cart || cart.items.length === 0) redirect('/cart')

    const session = await auth()

    const userId = session?.user?.id

    if (!userId) throw new Error('No user ID')

    const user = await getUserbyId(userId)

    return (
        <>
            <CheckoutSteps current={1} />
            <ShippingAddressForm address={user.address as TShippingAddress} />
        </>)
}

export default ShippingAddress