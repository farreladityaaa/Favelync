'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/lib/store';
import { Package } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const user = login(email, password);
      
      if (user) {
        router.push('/dashboard');
      } else {
        setError('Email atau password salah');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[rgba(30,41,59,0.7)] backdrop-blur-2xl border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 sm:p-10 w-full max-w-[440px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.05)] relative overflow-hidden animate-scale-in">
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 bg-[var(--bg-tertiary)] rounded-xl flex items-center justify-center mb-4 border border-[var(--border)] shadow-lg">
          <Package className="text-[#f59e0b]" size={28} />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">FAVELYNC</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">Masuk ke dashboard inventori Anda</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm mb-4 animate-fade-in">
            {error}
          </div>
        )}

        <div>
          <label className="label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="admin@favelync.id"
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="label mb-0" htmlFor="password">Password</label>
            <a href="#" className="text-xs text-[#f59e0b] hover:text-[#d97706] transition-colors">Lupa?</a>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            placeholder="••••••••"
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary w-full mt-6"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memproses...
            </span>
          ) : 'Masuk'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-[var(--border)] text-center">
        <p className="text-[var(--text-secondary)] text-sm">
          Belum punya akun?{' '}
          <Link href="/register" className="text-[#f59e0b] hover:text-[#d97706] font-medium transition-colors">
            Daftar sekarang
          </Link>
        </p>
      </div>

      <div className="mt-6 p-4 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border)] text-xs text-[var(--text-secondary)]">
        <p className="font-semibold text-[#e2e8f0] mb-2">Akun Demo:</p>
        <ul className="space-y-1">
          <li><span className="text-[#f59e0b]">Admin:</span> admin@favelync.id / admin123</li>
          <li><span className="text-[#f59e0b]">Staff:</span> budi@favelync.id / staff123</li>
          <li><span className="text-[#f59e0b]">Viewer:</span> siti@favelync.id / viewer123</li>
        </ul>
      </div>
    </div>
  );
}
