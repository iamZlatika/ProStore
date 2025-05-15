'use client';

import type { TShippingAddress } from '@/types';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { shippingAddressSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader } from 'lucide-react';
import { shippingAddressDefaultValues } from '@/lib/constants';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';
import { updateUserAdderess } from '@/lib/actions/user.actions';
import BasicField from '@/components/shared/form/fields/basic-field';

interface ShippingAddressFormProps {
  address: TShippingAddress;
}
const ShippingAddressForm = ({ address }: ShippingAddressFormProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || shippingAddressDefaultValues,
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = (values) => {
    startTransition(async () => {
      const result = await updateUserAdderess(values);
      if (!result.success) {
        toast.error(result.message);
        return;
      }

      router.push('/payment-method');
    });
  };
  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="h2-bold mt-4">Shipping Address</h1>
      <p className="text-small text-muted-foreground">Please enter and address to ship to</p>
      <Form {...form}>
        <form method="post" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col md:flex-row gap-5">
            <BasicField form={form} name="fullName" />
          </div>
          <div className="flex flex-col md:flex-row gap-5">
            <BasicField form={form} name="streetAddress" />
          </div>
          <div className="flex flex-col md:flex-row gap-5">
            <BasicField form={form} name="city" />
          </div>
          <div className="flex flex-col md:flex-row gap-5">
            <BasicField form={form} name="postalCode" />
          </div>
          <div className="flex flex-col md:flex-row gap-5">
            <BasicField form={form} name="country" />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}{' '}
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ShippingAddressForm;
