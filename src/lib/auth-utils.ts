import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export const requireAuth = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect('/login');
  }
  
  return { userId };
}

export const requireUnauth = async () => {
  const { userId } = await auth();
  
  if (userId) {
    redirect('/workflows');
  }
  
  return null;
}