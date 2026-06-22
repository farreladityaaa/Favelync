'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, ArrowUpRight, ArrowDownRight, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { useApp } from '@/app/lib/store';
import { formatCurrency, formatDateTime } from '@/app/lib/utils';
import { exportToExcel, exportToPDF, exportToWord } from '@/app/lib/export';
import { TransactionModal } from '@/app/components/TransactionModal';

export default function TransactionsPage() {
  const { state } = useApp();
  const { transactions, products, users } = state;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [dateRange, setDateRange] = useState('30'); // days
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const product = products.find(p => p.id === t.productId);
      const productName = product?.name || '';
      
      const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            t.notes.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedType ? t.type === selectedType : true;
      
      let matchesDate = true;
      if (dateRange !== 'all') {
        const days = parseInt(dateRange);
        const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
        matchesDate = new Date(t.date).getTime() >= cutoff;
      }

      return matchesSearch && matchesType && matchesDate;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, products, searchTerm, selectedType, dateRange]);

  const prepareExportData = () => {
    return filteredTransactions.map(t => {
      const product = products.find(p => p.id === t.productId);
      return {
        Tanggal: formatDateTime(t.date),
        Produk: product?.name || 'Unknown',
        Tipe: t.type === 'in' ? 'Masuk' : 'Keluar',
        Jumlah: t.quantity,
        Satuan: product?.unit || '',
        'Total Nilai': t.quantity * t.unitPrice,
        Keterangan: t.notes
      };
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Riwayat Transaksi</h2>
          <p className="text-[#94a3b8] text-sm mt-1">Log pergerakan stok masuk dan keluar</p>
        </div>
        <div className="flex gap-2 relative">
          <button 
            className="btn btn-secondary btn-sm" 
            title="Export Data"
            onClick={() => setExportMenuOpen(!exportMenuOpen)}
          >
            <Download size={16} /> <span className="hidden sm:inline">Export</span>
          </button>
          
          {exportMenuOpen && (
            <div className="absolute top-10 right-0 sm:right-auto sm:left-0 w-48 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl shadow-[var(--shadow-lg)] z-50 overflow-hidden animate-scale-in backdrop-blur-xl py-1">
              <button 
                className="w-full text-left px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[#22c55e] flex items-center gap-2 transition-colors"
                onClick={() => {
                  exportToExcel(prepareExportData(), `Transaksi_${new Date().toISOString().slice(0,10)}`);
                  setExportMenuOpen(false);
                }}
              >
                <FileSpreadsheet size={16} /> Export ke Excel
              </button>
              <button 
                className="w-full text-left px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-white flex items-center gap-2 transition-colors"
                onClick={() => {
                  exportToPDF(prepareExportData(), 'Laporan Transaksi', `Transaksi_${new Date().toISOString().slice(0,10)}`);
                  setExportMenuOpen(false);
                }}
              >
                <FileText size={16} /> Export ke PDF
              </button>
              <button 
                className="w-full text-left px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[#3b82f6] flex items-center gap-2 transition-colors"
                onClick={() => {
                  exportToWord(prepareExportData(), 'Laporan Transaksi', `Transaksi_${new Date().toISOString().slice(0,10)}`);
                  setExportMenuOpen(false);
                }}
              >
                <FileText size={16} /> Export ke Word
              </button>
            </div>
          )}

          <button className="btn btn-primary btn-sm" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Catat Transaksi
          </button>
        </div>
      </div>

      <div className="card space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b] z-10" size={16} />
            <input 
              type="text" 
              placeholder="Cari produk atau keterangan..." 
              className="w-full bg-[rgba(15,23,42,0.6)] border border-[var(--border)] text-white text-sm rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-40">
              <select 
                className="select"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">Semua Tipe</option>
                <option value="in">Stok Masuk</option>
                <option value="out">Stok Keluar</option>
              </select>
            </div>
            
            <div className="relative w-full sm:w-40">
              <select 
                className="select"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="7">7 Hari Terakhir</option>
                <option value="30">30 Hari Terakhir</option>
                <option value="90">3 Bulan Terakhir</option>
                <option value="all">Semua Waktu</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Waktu & Tanggal</th>
                <th>Produk</th>
                <th>Tipe</th>
                <th className="text-right">Jumlah</th>
                <th className="text-right">Total Nilai</th>
                <th>Keterangan</th>
                <th>Dicatat Oleh</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((txn) => {
                const product = products.find(p => p.id === txn.productId);
                const user = users.find(u => u.id === txn.recordedBy);
                const isIncoming = txn.type === 'in';
                const totalValue = txn.quantity * txn.unitPrice;
                
                return (
                  <tr key={txn.id}>
                    <td className="text-[#cbd5e1] whitespace-nowrap">{formatDateTime(txn.date)}</td>
                    <td>
                      <div className="font-medium text-white">{product?.name || 'Unknown'}</div>
                      <div className="text-xs text-[#94a3b8] mono mt-0.5">{product?.sku || '-'}</div>
                    </td>
                    <td>
                      <span className={`badge ${isIncoming ? 'badge-in' : 'badge-out'}`}>
                        {isIncoming ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} />}
                        {isIncoming ? 'Masuk' : 'Keluar'}
                      </span>
                    </td>
                    <td className="text-right mono font-medium">
                      <span className={isIncoming ? 'text-[#22c55e]' : 'text-[#ef4444]'}>
                        {isIncoming ? '+' : '-'}{txn.quantity}
                      </span>
                      <span className="text-xs text-[#64748b] ml-1">{product?.unit || ''}</span>
                    </td>
                    <td className="text-right mono text-[#cbd5e1]">
                      {formatCurrency(totalValue)}
                    </td>
                    <td className="text-[#94a3b8] max-w-[200px] truncate" title={txn.notes}>
                      {txn.notes || '-'}
                    </td>
                    <td className="text-[#cbd5e1]">
                      {user?.name || 'Unknown'}
                    </td>
                  </tr>
                );
              })}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-[#64748b]">
                      <Filter size={48} className="mb-4 opacity-50" />
                      <p className="text-base font-medium text-[#94a3b8]">Tidak ada transaksi ditemukan</p>
                      <p className="text-sm mt-1">Coba sesuaikan filter pencarian Anda</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
