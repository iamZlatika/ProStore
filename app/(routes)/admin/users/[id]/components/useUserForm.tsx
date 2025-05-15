import { updateUser } from '@/lib/actions/user.actions';
import { updateUserSchema } from '@/lib/validators';
import type { TUser } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export const useUserForm = (user: TUser) => {
  const router = useRouter();

  const form = useForm<TUser>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: user,
  });

  const onSubmit = async (values: TUser) => {
    try {
      const res = await updateUser({
        ...values,
        id: user.id,
      });

      if (!res.success) {
        return toast.error(res.message);
      }
      toast.success(res.message);

      form.reset();
      router.push('/admin/users');
    } catch (error) {
      toast.error((error as Error).message);
    }
  };
  return { form, onSubmit };
};
