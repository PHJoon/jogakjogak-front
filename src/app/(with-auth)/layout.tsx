import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

import Footer from '@/components/Footer';
import Header from '@/components/Header';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function WithAuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const jar = await cookies();
  const accessToken = jar.get('access_token')?.value;

  if (!accessToken) {
    redirect('/api/auth/bootstrap?redirect=/dashboard');
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
}
