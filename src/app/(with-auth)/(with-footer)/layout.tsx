import { ReactNode } from 'react';

import Footer from '@/components/Footer';

export default function WithFooterLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
