import { ReactNode } from 'react';

import Header from '@/components/Header';

export default async function GuestLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
