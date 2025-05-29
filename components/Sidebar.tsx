'use client';

import React, { useState } from 'react';
import { MapPin, Plane, BookOpen, Menu, X, ChevronLeft, PlaneTakeoff } from 'lucide-react';
import Link from 'next/link';

interface NavItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

const Sidebar: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navItems: NavItem[] = [
    { name: 'Flights', icon: PlaneTakeoff, href: '/explore/flights' },
    { name: 'Locations', icon: MapPin, href: '/explore/locations' },
    { name: 'Airlines', icon: Plane, href: '/explore/airlines' },
    { name: 'Reservations', icon: BookOpen, href: '/explore/reservation' },
  ];

  return (
    <>
      <aside className="hidden md:flex w-full md:w-[20%] border-r border-r-white/10 flex-col p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Explore</h2>
        </div>
        <nav className="flex flex-col space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/20 transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              <span className='text-neutral-400'>{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>


      <button
        className="md:hidden fixed bottom-6 right-6 z-50 p-4 rounded-full bg-white/10 border border-white/20 text-white shadow-lg hover:bg-white/30 transition-colors"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? <X className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
      </button>

      <div
        className={`fixed inset-y-0 right-0 w-64 border-l bg-black border-l-white/20 p-6 transform ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out md:hidden z-40`}
      >
        <div className="mb-8 mt-12">
          <h2 className="text-xl font-bold text-neutral-100">Explore</h2>
        </div>
        <nav className="flex flex-col space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center space-x-3 p-2 rounded-lg text-neutral-400 hover:bg-white/20 transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            >
              <item.icon className="w-4 h-4" />
              <span className='text-sm md:text-base'>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;