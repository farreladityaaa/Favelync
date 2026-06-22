'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (session?.user) {
          // Store Google user in localStorage session (compatible with existing auth system)
          const googleUser = {
            id: session.user.id,
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            role: 'staff' as const,
            password: '',
            createdAt: new Date().toISOString(),
            avatar: session.user.user_metadata?.avatar_url || null,
          };
          localStorage.setItem('favelync-session', JSON.stringify(googleUser));
          router.push('/dashboard');
        } else {
          router.push('/login');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        router.push('/login');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg-primary)]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#f59e0b] border-t-transparent rounded-full animate-spin" />
        <p className="text-[var(--text-secondary)] text-sm">Menyelesaikan login Google...</p>
      </div>
    </div>
  );
}
