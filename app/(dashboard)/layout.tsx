import { SiteHeader } from '@/components/site-header';
import type { ReactNode } from 'react';

import './theme.css';

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="flex flex-1 flex-col p-4 container mx-auto">
        {children}
      </main>
    </div>
  );
}
