'use client';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { updateProfile } from '@/lib/actions/user.actions';
import { updateProfileSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface ProfileFormProps {
    name: string,
    email: string
}

const ProfileForm = ({ name, email }: ProfileFormProps) => {
    const form = useForm<z.infer<typeof updateProfileSchema>>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: name,
            email: email,
        },
    });

    const onSubmit = async (values: z.infer<typeof updateProfileSchema>) => {
        const res = await updateProfile(values);

        if (!res.success) {
            return toast.error(res.message);
        }
        toast(res.message);
    };

    return (
        <Form {...form}>
            <form
                className='flex flex-col gap-5'
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                        <FormItem className='w-full'>
                            <FormControl>
                                <Input
                                    disabled
                                    placeholder='Email'
                                    className='input-field'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem className='w-full'>
                            <FormControl>
                                <Input
                                    placeholder='Name'
                                    className='input-field'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type='submit'
                    size='lg'
                    className='button col-span-2 w-full'
                    disabled={form.formState.isSubmitting}
                >
                    {form.formState.isSubmitting ? 'Submitting...' : 'Update Profile'}
                </Button>
            </form>
        </Form>
    );
};

export default ProfileForm;
