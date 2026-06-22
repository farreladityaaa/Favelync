'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar } from '@/app/components/Sidebar';
import { TopBar } from '@/app/components/TopBar';
import { useAuth } from '@/app/lib/store';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { currentUser, restoreSession } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check auth on mount
    if (!currentUser) {
      const user = restoreSession();
      if (!user) {
        router.replace('/login');
      } else {
        setIsChecking(false);
      }
    } else {
      setIsChecking(false);
    }
  }, [currentUser, router, restoreSession]);

  // Handle mobile menu close on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--bg-card)] border-t-[var(--accent)] rounded-full animate-spin"></div>
          <p className="text-[var(--text-secondary)] text-sm">Memuat aplikasi...</p>
        </div>
      </div>
    );
  }

  // Prevent flash of content before redirect
  if (!currentUser) return null;

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] overflow-hidden w-full">
      <Sidebar 
        isMobileOpen={isMobileOpen} 
        setMobileOpen={setMobileOpen} 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 w-full overflow-hidden ${
          isCollapsed ? 'md:ml-[72px]' : 'md:ml-[260px]'
        }`}
      >
        <TopBar setMobileOpen={setMobileOpen} />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 w-full bg-[var(--bg-primary)]">
          <div className="w-full min-w-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
