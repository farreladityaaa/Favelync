'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/store';
import { 
  LayoutDashboard, 
  Package, 
  ArrowRightLeft, 
  Users, 
  FileText, 
  TrendingUp, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import { cn } from '@/app/lib/utils';

export function Sidebar({ 
  isMobileOpen, 
  setMobileOpen,
  isCollapsed,
  setIsCollapsed
}: { 
  isMobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}) {
  const pathname = usePathname();
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Produk', path: '/produk', icon: <Package size={20} /> },
    { name: 'Transaksi', path: '/transaksi', icon: <ArrowRightLeft size={20} /> },
    { name: 'Supplier', path: '/supplier', icon: <Users size={20} /> },
    { name: 'Laporan', path: '/laporan', icon: <FileText size={20} /> },
    { name: 'Valuasi', path: '/valuasi', icon: <TrendingUp size={20} /> },
    { name: 'Pengaturan', path: '/pengaturan', icon: <Settings size={20} /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 h-screen bg-[#0f172a]/95 backdrop-blur-xl border-r border-[var(--border)] flex flex-col transition-all duration-300 z-40",
          isCollapsed ? "w-[72px]" : "w-[260px]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 bg-[var(--bg-tertiary)] rounded flex items-center justify-center flex-shrink-0 border border-[var(--border)]">
              <Package className="text-[#f59e0b]" size={18} />
            </div>
            {!isCollapsed && <span className="font-bold text-white tracking-tight truncate">FAVELYNC</span>}
          </div>
          
          <button 
            className="text-[var(--text-secondary)] hover:text-white hidden md:block"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-1">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.path);
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 mx-3 my-1 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-[rgba(245,158,11,0.1)] text-[var(--accent)] relative after:absolute after:left-0 after:top-1/4 after:bottom-1/4 after:w-1 after:bg-[var(--accent)] after:rounded-r" 
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]",
                  isCollapsed && "justify-center px-0 mx-2"
                )}
                title={isCollapsed ? item.name : undefined}
                onClick={() => setMobileOpen(false)}
              >
                <div className="flex-shrink-0">{item.icon}</div>
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </div>

      </aside>
    </>
  );
}
