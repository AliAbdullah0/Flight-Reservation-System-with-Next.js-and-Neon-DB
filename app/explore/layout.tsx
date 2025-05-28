'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';

interface ExploreLayoutProps {
  children: React.ReactNode;
}

const ExploreLayout: React.FC<ExploreLayoutProps> = ({ children }) => {
  return (
    <main className="flex w-full min-h-screen overflow-x-hidden text-neutral-100">
      <Sidebar />
      <section className="w-full md:flex-1 p-6">{children}</section>
    </main>
  );
};

export default ExploreLayout;