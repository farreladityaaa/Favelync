'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, Search, Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { useApp, useAuth } from '@/app/lib/store';

export function TopBar({ 
  setMobileOpen 
}: { 
  setMobileOpen: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { state, dispatch } = useApp();
  const { currentUser, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Get unread notifications count
  const unreadCount = state.notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  };

  // Get title from pathname
  const getPageTitle = () => {
    const path = pathname.split('/')[1];
    if (!path) return 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <header className="h-16 border-b border-[var(--border)] bg-[var(--bg-secondary)] flex items-center justify-between px-4 sticky top-0 z-20 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <button 
          className="md:hidden text-[var(--text-secondary)] hover:text-white"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-semibold text-white hidden sm:block">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] z-10" size={16} />
          <input 
            type="text" 
            placeholder="Cari produk, supplier..." 
            className="w-64 bg-[rgba(15,23,42,0.8)] border border-[var(--border)] text-white text-sm rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all shadow-inner"
          />
        </div>

        <div className="relative">
          <button 
            className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-tertiary)] transition-colors relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="notification-dot" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl shadow-[var(--shadow-lg)] z-50 overflow-hidden animate-scale-in backdrop-blur-xl">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
                <h3 className="font-semibold text-white text-sm">Notifikasi</h3>
                <button 
                  className="text-xs text-[#f59e0b] hover:text-[#d97706]"
                  onClick={() => {
                    state.notifications.forEach(n => {
                      if (!n.read) handleMarkAsRead(n.id);
                    });
                  }}
                >
                  Tandai semua dibaca
                </button>
              </div>
              
              <div className="max-h-80 overflow-y-auto">
                {state.notifications.length === 0 ? (
                  <div className="p-6 text-center text-[var(--text-muted)] text-sm">
                    Belum ada notifikasi
                  </div>
                ) : (
                  state.notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`p-4 border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer ${!notif.read ? 'bg-[var(--warning-bg)]' : ''}`}
                      onClick={() => handleMarkAsRead(notif.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!notif.read ? 'bg-[#f59e0b]' : 'bg-transparent'}`} />
                        <div>
                          <p className="text-sm font-medium text-white mb-1">{notif.title}</p>
                          <p className="text-xs text-[var(--text-secondary)] line-clamp-2">{notif.message}</p>
                          <p className="text-[10px] text-[var(--text-muted)] mt-2">
                            {new Date(notif.createdAt).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button 
            className="flex items-center gap-2 hover:bg-[var(--bg-tertiary)] p-1.5 rounded-lg transition-colors border border-transparent hover:border-[var(--border)]"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="w-8 h-8 rounded-full bg-[#f59e0b] flex items-center justify-center text-black font-bold flex-shrink-0 text-sm">
              {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-white leading-none mb-1">{currentUser?.name}</p>
              <p className="text-[10px] text-[var(--text-secondary)] leading-none capitalize">{currentUser?.role}</p>
            </div>
            <ChevronDown size={14} className="text-[var(--text-muted)] hidden md:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl shadow-[var(--shadow-lg)] z-50 overflow-hidden animate-scale-in backdrop-blur-xl py-1">
              <div className="px-4 py-2 border-b border-[var(--border)] md:hidden">
                <p className="text-sm font-medium text-white truncate">{currentUser?.name}</p>
                <p className="text-xs text-[var(--text-secondary)] capitalize">{currentUser?.role}</p>
              </div>
              <button 
                className="w-full text-left px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-white flex items-center gap-2 transition-colors"
                onClick={() => {
                  router.push('/pengaturan');
                  setShowProfileMenu(false);
                }}
              >
                <User size={16} /> Profil Saya
              </button>
              <button 
                className="w-full text-left px-4 py-2 text-sm text-[var(--danger)] hover:bg-[var(--danger-bg)] flex items-center gap-2 transition-colors"
                onClick={() => {
                  logout();
                  router.push('/login');
                }}
              >
                <LogOut size={16} /> Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
