'use client';

import React, { useState } from 'react';
import { Settings as SettingsIcon, Users, Tags, Scale, Database, AlertTriangle, Globe, LogOut } from 'lucide-react';
import { useApp, useAuth } from '@/app/lib/store';
import { ConfirmDialog } from '@/app/components/ui/ConfirmDialog';
import { Modal } from '@/app/components/ui/Modal';
import { generateId } from '@/app/lib/utils';

export default function SettingsPage() {
  const { state, dispatch } = useApp();
  const { logout } = useAuth();
  const { users, categories, units } = state;

  const [activeTab, setActiveTab] = useState('users');
  const [isConfirmResetOpen, setIsConfirmResetOpen] = useState(false);
  const [language, setLanguage] = useState(typeof window !== 'undefined' ? localStorage.getItem('favelync-lang') || 'id' : 'id');

  // Modal States
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);

  // Form States
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('staff');
  
  const [catName, setCatName] = useState('');
  
  const [unitName, setUnitName] = useState('');
  const [unitAbbr, setUnitAbbr] = useState('');

  const handleResetData = () => {
    localStorage.removeItem('favelync-data');
    window.location.href = '/login'; // Redirect to login to re-initialize
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleSaveLanguage = () => {
    localStorage.setItem('favelync-lang', language);
    alert('Pengaturan bahasa disimpan (Simulasi UI)');
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: 'ADD_USER',
      payload: {
        id: generateId('usr'),
        name: userName,
        email: userEmail,
        password: 'password123', // Default demo
        role: userRole as any,
        createdAt: new Date().toISOString()
      }
    });
    setIsUserModalOpen(false);
    setUserName(''); setUserEmail(''); setUserRole('staff');
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: 'ADD_CATEGORY',
      payload: { id: generateId('cat'), name: catName }
    });
    setIsCatModalOpen(false);
    setCatName('');
  };

  const handleAddUnit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: 'ADD_UNIT',
      payload: { id: generateId('unt'), name: unitName, abbreviation: unitAbbr }
    });
    setIsUnitModalOpen(false);
    setUnitName(''); setUnitAbbr('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Pengaturan</h2>
        <p className="text-[#94a3b8] text-sm mt-1">Kelola preferensi aplikasi, pengguna, dan data master</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar menu untuk pengaturan */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="card p-2 space-y-1">
            <button 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'users' ? 'bg-[rgba(245,158,11,0.1)] text-[#f59e0b]' : 'text-[#cbd5e1] hover:bg-[#1a1a2e]'}`}
              onClick={() => setActiveTab('users')}
            >
              <Users size={18} /> Manajemen Pengguna
            </button>
            <button 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'categories' ? 'bg-[rgba(245,158,11,0.1)] text-[#f59e0b]' : 'text-[#cbd5e1] hover:bg-[#1a1a2e]'}`}
              onClick={() => setActiveTab('categories')}
            >
              <Tags size={18} /> Kategori Produk
            </button>
            <button 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'units' ? 'bg-[rgba(245,158,11,0.1)] text-[#f59e0b]' : 'text-[#cbd5e1] hover:bg-[#1a1a2e]'}`}
              onClick={() => setActiveTab('units')}
            >
              <Scale size={18} /> Satuan Ukur
            </button>
            <button 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'system' ? 'bg-[rgba(245,158,11,0.1)] text-[#f59e0b]' : 'text-[#cbd5e1] hover:bg-[#1a1a2e]'}`}
              onClick={() => setActiveTab('system')}
            >
              <Database size={18} /> Sistem & Data
            </button>
            <button 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'language' ? 'bg-[rgba(245,158,11,0.1)] text-[#f59e0b]' : 'text-[#cbd5e1] hover:bg-[#1a1a2e]'}`}
              onClick={() => setActiveTab('language')}
            >
              <Globe size={18} /> Bahasa & Wilayah
            </button>
            <button 
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-[#cbd5e1] hover:bg-[var(--danger-bg)] hover:text-[var(--danger)] mt-4 border-t border-[var(--border)] pt-4"
              onClick={handleLogout}
            >
              <LogOut size={18} /> Keluar Akun
            </button>
          </div>
        </div>

        {/* Konten Utama */}
        <div className="flex-1">
          {activeTab === 'users' && (
            <div className="card animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-white">Daftar Pengguna</h3>
                <button className="btn btn-primary btn-sm" onClick={() => setIsUserModalOpen(true)}>Tambah Pengguna</button>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Nama</th>
                      <th>Email</th>
                      <th>Peran</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td className="font-medium text-white">{user.name}</td>
                        <td className="text-[#cbd5e1]">{user.email}</td>
                        <td>
                          <span className="badge badge-info uppercase">{user.role}</span>
                        </td>
                        <td><span className="text-[#22c55e] text-sm">Aktif</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="card animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-white">Kategori Produk</h3>
                <button className="btn btn-primary btn-sm" onClick={() => setIsCatModalOpen(true)}>Tambah Kategori</button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {categories.map(cat => (
                  <div key={cat.id} className="p-4 border border-[#2a2a4a] rounded-lg bg-[#1a1a2e] flex justify-between items-center">
                    <span className="text-[#cbd5e1] font-medium">{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'units' && (
            <div className="card animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-white">Satuan Ukur</h3>
                <button className="btn btn-primary btn-sm" onClick={() => setIsUnitModalOpen(true)}>Tambah Satuan</button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {units.map(unit => (
                  <div key={unit.id} className="p-4 border border-[#2a2a4a] rounded-lg bg-[#1a1a2e] flex flex-col items-center justify-center text-center">
                    <span className="text-white font-bold text-lg mb-1">{unit.abbreviation}</span>
                    <span className="text-[#94a3b8] text-xs">{unit.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="card animate-fade-in space-y-8">
              <div>
                <h3 className="font-semibold text-white mb-2">Informasi Sistem</h3>
                <p className="text-sm text-[#94a3b8] mb-4">FAVELYNC Inventory v1.0.0 (Client-side Storage Edition)</p>
                
                <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#cbd5e1]">Total Data Tersimpan:</span>
                    <span className="text-white font-medium mono">
                      {Math.round(JSON.stringify(state).length / 1024)} KB
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#cbd5e1]">Status AI Engine:</span>
                    <span className="text-[#22c55e] font-medium">Aktif (Lokal)</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#2a2a4a]">
                <h3 className="font-semibold text-[#ef4444] mb-2 flex items-center gap-2">
                  <AlertTriangle size={18} /> Zona Berbahaya
                </h3>
                <p className="text-sm text-[#94a3b8] mb-4">
                  Menghapus semua data (produk, transaksi, dll) dan mengembalikan ke data demo awal.
                </p>
                <button 
                  className="btn btn-danger"
                  onClick={() => setIsConfirmResetOpen(true)}
                >
                  Reset Semua Data
                </button>
              </div>
            </div>
          )}

          {activeTab === 'language' && (
            <div className="card animate-fade-in space-y-6">
              <div>
                <h3 className="font-semibold text-white mb-2">Pengaturan Bahasa & Wilayah</h3>
                <p className="text-sm text-[#94a3b8] mb-6">Sesuaikan bahasa antarmuka aplikasi sesuai preferensi Anda.</p>
                
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="label">Bahasa Antarmuka</label>
                    <select 
                      className="select"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <option value="id">Bahasa Indonesia (ID)</option>
                      <option value="en">English (US)</option>
                      <option value="my">Bahasa Melayu (MY)</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Zona Waktu</label>
                    <select className="select" disabled>
                      <option>Asia/Jakarta (WIB)</option>
                    </select>
                    <p className="text-xs text-[var(--text-muted)] mt-1">*Zona waktu saat ini menyesuaikan browser Anda</p>
                  </div>
                  <button className="btn btn-primary mt-4" onClick={handleSaveLanguage}>Simpan Pengaturan</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} title="Tambah Pengguna Baru">
        <form onSubmit={handleAddUser} className="space-y-4">
          <div>
            <label className="label">Nama Lengkap</label>
            <input type="text" className="input" required value={userName} onChange={e => setUserName(e.target.value)} placeholder="Misal: Budi Santoso" />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" required value={userEmail} onChange={e => setUserEmail(e.target.value)} placeholder="budi@favelync.id" />
          </div>
          <div>
            <label className="label">Peran (Role)</label>
            <select className="select" value={userRole} onChange={e => setUserRole(e.target.value)}>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" className="btn btn-ghost" onClick={() => setIsUserModalOpen(false)}>Batal</button>
            <button type="submit" className="btn btn-primary">Simpan Pengguna</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isCatModalOpen} onClose={() => setIsCatModalOpen(false)} title="Tambah Kategori Baru">
        <form onSubmit={handleAddCategory} className="space-y-4">
          <div>
            <label className="label">Nama Kategori</label>
            <input type="text" className="input" required value={catName} onChange={e => setCatName(e.target.value)} placeholder="Misal: Elektronik, Pakaian" />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" className="btn btn-ghost" onClick={() => setIsCatModalOpen(false)}>Batal</button>
            <button type="submit" className="btn btn-primary">Simpan Kategori</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isUnitModalOpen} onClose={() => setIsUnitModalOpen(false)} title="Tambah Satuan Baru">
        <form onSubmit={handleAddUnit} className="space-y-4">
          <div>
            <label className="label">Singkatan Satuan</label>
            <input type="text" className="input" required value={unitAbbr} onChange={e => setUnitAbbr(e.target.value)} placeholder="Misal: Pcs, Kg, Box" />
          </div>
          <div>
            <label className="label">Nama Satuan Lengkap</label>
            <input type="text" className="input" required value={unitName} onChange={e => setUnitName(e.target.value)} placeholder="Misal: Pieces, Kilogram" />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" className="btn btn-ghost" onClick={() => setIsUnitModalOpen(false)}>Batal</button>
            <button type="submit" className="btn btn-primary">Simpan Satuan</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmResetOpen}
        onClose={() => setIsConfirmResetOpen(false)}
        onConfirm={handleResetData}
        title="Reset Semua Data?"
        message="Peringatan: Seluruh data (produk, transaksi, dll) yang tersimpan di browser ini akan dihapus dan dikembalikan ke data simulasi awal. Lanjutkan?"
        isDestructive={true}
        confirmText="Ya, Reset Data"
      />
    </div>
  );
}
