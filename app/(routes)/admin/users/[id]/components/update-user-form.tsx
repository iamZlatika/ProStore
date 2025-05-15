'use client';

import BasicField from '@/components/shared/form/fields/basic-field';
import SelectField from '@/components/shared/form/fields/select-field';
import { Form } from '@/components/ui/form';
import type { TUser } from '@/types';
import { USER_ROLES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { useUserForm } from './useUserForm';

interface UpdateUserFormProps {
  user: TUser;
}
const UpdateUserForm = ({ user }: UpdateUserFormProps) => {
  const { form, onSubmit } = useUserForm(user);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <BasicField form={form} name="email" disabled />
        </div>
        <div>
          <BasicField form={form} name="name" />
        </div>
        <div>
          <SelectField form={form} name="role" options={USER_ROLES} />
        </div>
        <div className="flex-between mt-4">
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Submitting...' : 'Update User'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateUserForm;
