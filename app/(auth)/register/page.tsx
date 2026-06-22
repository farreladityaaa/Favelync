'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, useApp } from '@/app/lib/store';
import { Package } from 'lucide-react';
import { UserRole } from '@/app/lib/types';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('staff');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { login } = useAuth();
  const { state, dispatch } = useApp();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Password tidak cocok');
      setIsLoading(false);
      return;
    }

    if (state.users.some(u => u.email === email)) {
      setError('Email sudah terdaftar');
      setIsLoading(false);
      return;
    }

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newUser = {
        id: `usr-${Date.now().toString(36)}`,
        name,
        email,
        password, // In a real app, this should be hashed on the server
        role,
        createdAt: new Date().toISOString(),
      };

      dispatch({ type: 'ADD_USER', payload: newUser });
      
      // Auto login after registration
      const user = login(email, password);
      
      if (user) {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mendaftar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[rgba(30,41,59,0.7)] backdrop-blur-2xl border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 sm:p-10 w-full max-w-[440px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.05)] relative overflow-hidden animate-scale-in">
      <div className="flex flex-col items-center mb-6">
        <div className="w-10 h-10 bg-[var(--bg-tertiary)] rounded-xl flex items-center justify-center mb-3 border border-[var(--border)]">
          <Package className="text-[#f59e0b]" size={24} />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">Buat Akun Baru</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">Daftar untuk mengelola inventori</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm mb-4 animate-fade-in">
            {error}
          </div>
        )}

        <div>
          <label className="label" htmlFor="name">Nama Lengkap</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label className="label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="email@perusahaan.com"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="label" htmlFor="confirmPassword">Konfirmasi</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="role">Peran (Role Demo)</label>
          <select 
            id="role" 
            value={role} 
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="select"
          >
            <option value="admin">Admin (Full Access)</option>
            <option value="staff">Staff (Edit Data)</option>
            <option value="viewer">Viewer (Read Only)</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary w-full mt-6"
          disabled={isLoading}
        >
          {isLoading ? 'Mendaftar...' : 'Daftar Sekarang'}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-[var(--border)] text-center">
        <p className="text-[var(--text-secondary)] text-sm">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-[#f59e0b] hover:text-[#d97706] font-medium transition-colors">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
