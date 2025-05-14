'use server';

import {
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
  paymentMethodSchema,
} from '../validators';
import { auth, signIn, signOut } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { hashSync } from 'bcrypt-ts-edge';
import { prisma } from '@/db/prisma';
import { formatError } from '../utils';
import type { TAllItemsRequest, TPaymentMethod, TShippingAddress, TUpdateUser } from '@/types';
import { PAGE_SIZE } from '../constants';
import { revalidatePath } from 'next/cache';

export async function signInUserWithCredentials(prevState: unknown, formData: FormData) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    await signIn('credentials', user);

    return { success: true, message: 'Signed in successfully' };
  } catch (error: unknown) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: 'Invalid email or password' };
  }
}

export async function signOutUser() {
  await signOut();
}

export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    const plainPassword = user.password;

    user.password = hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await signIn('credentials', {
      email: user.email,
      password: plainPassword,
    });

    return { success: true, message: 'User was registered successfully' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: formatError(error) };
  }
}

export async function getUserbyId(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });
  if (!user) throw new Error('User not found');
  return user;
}

export async function updateUserAdderess(data: TShippingAddress) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error('User not found');

    const address = shippingAddressSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { address },
    });
    return { success: true, message: 'User updated successfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateUserPaymentMethod(data: TPaymentMethod) {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error('User not found');

    const paymentMethod = paymentMethodSchema.parse(data);
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { paymentMethod: paymentMethod.type },
    });
    return { success: true, message: 'User updated successfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateProfile(user: TUpdateUser) {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user.id },
    });

    if (!currentUser) throw new Error('User not found');

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { name: user.name },
    });
    return { success: true, message: 'User updated successfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getAllUsers({ limit = PAGE_SIZE, page }: TAllItemsRequest) {
  const data = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.user.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

export async function deleteUser(userId: string) {
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
    revalidatePath('/admun/users');
    return { success: true, message: 'User deleted successfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
