import { getUserbyId } from '@/lib/actions/user.actions';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import UpdateUserForm from './components/update-user-form';

export const metadata: Metadata = {
  title: 'Update User',
};

const AdminUserUpdate = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;
  const user = await getUserbyId(id);

  if (!user) return notFound();
  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <h1 className="h2-bold">Update User</h1>
      <UpdateUserForm user={user} />
    </div>
  );
};

export default AdminUserUpdate;
