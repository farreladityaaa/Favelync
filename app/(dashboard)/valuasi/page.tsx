'use client';

import React, { useState, useMemo } from 'react';
import { TrendingUp, DollarSign, PieChart, ArrowUpRight, Search } from 'lucide-react';
import { useApp } from '@/app/lib/store';
import { formatCurrency } from '@/app/lib/utils';
import { SummaryCard } from '@/app/components/SummaryCard';

export default function ValuationPage() {
  const { state } = useApp();
  const { products } = state;

  const [searchTerm, setSearchTerm] = useState('');

  // Computations
  const totalBuyValue = useMemo(() => 
    products.reduce((sum, p) => sum + (p.currentStock * p.buyPrice), 0), 
  [products]);

  const totalSellValue = useMemo(() => 
    products.reduce((sum, p) => sum + (p.currentStock * p.sellPrice), 0), 
  [products]);

  const potentialProfit = totalSellValue - totalBuyValue;
  const averageMargin = totalBuyValue > 0 ? (potentialProfit / totalBuyValue) * 100 : 0;

  // Filter and sort for the table
  const valuationData = useMemo(() => {
    return products
      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
      .map(p => {
        const margin = p.buyPrice > 0 ? ((p.sellPrice - p.buyPrice) / p.buyPrice) * 100 : 0;
        return {
          ...p,
          totalBuy: p.currentStock * p.buyPrice,
          totalSell: p.currentStock * p.sellPrice,
          margin
        };
      })
      .sort((a, b) => b.totalBuy - a.totalBuy); // Sort by highest asset value
  }, [products, searchTerm]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Valuasi Aset</h2>
        <p className="text-[#94a3b8] text-sm mt-1">Analisis nilai inventori dan potensi keuntungan</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Modal (Nilai Beli)"
          value={totalBuyValue}
          icon={DollarSign}
          prefix="Rp "
          className="stagger-1"
          iconClassName="text-[#3b82f6] bg-[rgba(59,130,246,0.1)] border-[rgba(59,130,246,0.2)]"
        />
        <SummaryCard
          title="Potensi Pendapatan (Nilai Jual)"
          value={totalSellValue}
          icon={TrendingUp}
          prefix="Rp "
          className="stagger-2"
          iconClassName="text-[#8b5cf6] bg-[rgba(139,92,246,0.1)] border-[rgba(139,92,246,0.2)]"
        />
        <SummaryCard
          title="Potensi Profit Kotor"
          value={potentialProfit}
          icon={ArrowUpRight}
          prefix="Rp "
          className="stagger-3"
          iconClassName="text-[#22c55e] bg-[rgba(34,197,94,0.1)] border-[rgba(34,197,94,0.2)]"
        />
        <SummaryCard
          title="Rata-Rata Margin"
          value={averageMargin}
          icon={PieChart}
          suffix="%"
          decimals={1}
          className="stagger-4"
          iconClassName="text-[#f59e0b] bg-[rgba(245,158,11,0.1)] border-[rgba(245,158,11,0.2)]"
        />
      </div>

      <div className="card space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="font-semibold text-white">Rincian Valuasi per Produk</h3>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b] z-10" size={16} />
            <input 
              type="text" 
              placeholder="Cari produk..." 
              className="w-full bg-[rgba(15,23,42,0.6)] border border-[var(--border)] text-white text-sm rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Produk</th>
                <th className="text-right">Stok</th>
                <th className="text-right">Harga Beli</th>
                <th className="text-right">Total Modal</th>
                <th className="text-right">Harga Jual</th>
                <th className="text-right">Potensi Jual</th>
                <th className="text-right">Margin (%)</th>
              </tr>
            </thead>
            <tbody>
              {valuationData.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="font-medium text-white">{item.name}</div>
                    <div className="text-xs text-[#94a3b8] mono mt-0.5">{item.sku}</div>
                  </td>
                  <td className="text-right mono text-[#cbd5e1]">{item.currentStock} {item.unit}</td>
                  <td className="text-right mono text-[#cbd5e1]">{formatCurrency(item.buyPrice)}</td>
                  <td className="text-right mono font-medium text-[#3b82f6]">
                    {formatCurrency(item.totalBuy)}
                  </td>
                  <td className="text-right mono text-[#cbd5e1]">{formatCurrency(item.sellPrice)}</td>
                  <td className="text-right mono font-medium text-[#22c55e]">
                    {formatCurrency(item.totalSell)}
                  </td>
                  <td className="text-right mono">
                    <span className={item.margin > 50 ? 'text-[#22c55e]' : item.margin < 10 ? 'text-[#ef4444]' : 'text-[#f59e0b]'}>
                      {item.margin.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
              {valuationData.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-[#64748b]">
                    Tidak ada data valuasi ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
