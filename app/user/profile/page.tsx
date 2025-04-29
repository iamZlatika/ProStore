import { Metadata } from 'next';
import { auth } from '@/auth';
import ProfileForm from './profile-form';
import { getUserbyId } from '@/lib/actions/user.actions';

export const metadata: Metadata = {
  title: 'Customer Profile',
};

const Profile = async () => {
  const session = await auth();

  if (!session || !session?.user.id) {
    return <div>You must be signed in to view this page.</div>;
  }
  const user = await getUserbyId(session?.user?.id);


  return (
    <div className='max-w-md mx-auto space-y-4'>
      <h2 className='h2-bold'>Profile</h2>
      <ProfileForm name={user.name} email={user.email} />
    </div>
  );
};

export default Profile;