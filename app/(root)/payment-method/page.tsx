import { Metadata } from 'next';
import { auth } from '@/auth';
import { getUserbyId } from '@/lib/actions/user.actions';
import PaymentMethodForm from '@/app/(root)/payment-method/payment-method-form';
import CheckoutSteps from '@/components/shared/checkout-steps';

export const metadata: Metadata = {
    title: 'Payment Method',
};

const PaymentMethod = async () => {
    const session = await auth()
    const userId = session?.user.id

    if (!userId) throw new Error('User not found')

    const user = await getUserbyId(userId)

    return (
        <>
            <CheckoutSteps current={2} />
            <PaymentMethodForm preferredPaymentMethod={user.paymentMethod} />
        </>
    )
}

export default PaymentMethod