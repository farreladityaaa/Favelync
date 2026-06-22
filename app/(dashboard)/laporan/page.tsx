'use client';

import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Calendar, Filter } from 'lucide-react';
import { useApp } from '@/app/lib/store';
import { formatCurrency, formatDateTime } from '@/app/lib/utils';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, WidthType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export default function ReportsPage() {
  const { state } = useApp();
  const { products, transactions, suppliers } = state;

  const [reportType, setReportType] = useState('stock'); // stock, transactions, low_stock
  const [dateRange, setDateRange] = useState('30');
  const [isExporting, setIsExporting] = useState(false);

  const getFilteredData = () => {
    if (reportType === 'stock') {
      return products.map(p => ({
        SKU: p.sku,
        Nama: p.name,
        Kategori: p.category,
        Stok: `${p.currentStock} ${p.unit}`,
        Status: p.currentStock === 0 ? 'Habis' : p.currentStock <= p.minimumStock ? 'Rendah' : 'Aman',
        HargaBeli: p.buyPrice,
        HargaJual: p.sellPrice,
        NilaiTotal: p.currentStock * p.buyPrice
      }));
    } else if (reportType === 'low_stock') {
      return products
        .filter(p => p.currentStock <= p.minimumStock)
        .map(p => ({
          SKU: p.sku,
          Nama: p.name,
          Stok: p.currentStock,
          Minimum: p.minimumStock,
          Kekurangan: p.minimumStock - p.currentStock,
          Supplier: suppliers.find(s => s.productIds?.includes(p.id))?.name || '-'
        }));
    } else { // transactions
      const cutoff = dateRange === 'all' ? 0 : Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000;
      return transactions
        .filter(t => new Date(t.date).getTime() >= cutoff)
        .map(t => {
          const product = products.find(p => p.id === t.productId);
          return {
            Tanggal: formatDateTime(t.date),
            Tipe: t.type === 'in' ? 'Masuk' : 'Keluar',
            Produk: product?.name || 'Unknown',
            Jumlah: t.quantity,
            HargaSatuan: t.unitPrice,
            Total: t.quantity * t.unitPrice,
            Keterangan: t.notes
          };
        })
        .sort((a, b) => new Date(b.Tanggal).getTime() - new Date(a.Tanggal).getTime());
    }
  };

  const handleExportExcel = () => {
    setIsExporting(true);
    try {
      const data = getFilteredData();
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Report");
      XLSX.writeFile(wb, `FAVELYNC_Report_${reportType}_${new Date().toISOString().slice(0,10)}.xlsx`);
    } catch (e) {
      console.error(e);
      alert('Gagal mengekspor data Excel');
    }
    setIsExporting(false);
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF();
      const data = getFilteredData();
      
      let title = 'Laporan FAVELYNC';
      if (reportType === 'stock') title = 'Laporan Stok Barang';
      if (reportType === 'low_stock') title = 'Laporan Barang Harus Restock';
      if (reportType === 'transactions') title = 'Laporan Transaksi';

      doc.setFontSize(16);
      doc.text(title, 14, 15);
      doc.setFontSize(10);
      doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`, 14, 22);

      if (data.length > 0) {
        const headers = Object.keys(data[0]);
        const rows = data.map(obj => Object.values(obj).map(val => {
          if (typeof val === 'number') {
            // Very simple currency formatting check
            if (val > 1000) return formatCurrency(val);
            return val.toString();
          }
          return val;
        }));

        doc.autoTable({
          head: [headers],
          body: rows,
          startY: 28,
          theme: 'grid',
          styles: { fontSize: 8 },
          headStyles: { fillColor: [24, 33, 62] } // #18213e
        });
      }

      doc.save(`FAVELYNC_Report_${reportType}_${new Date().toISOString().slice(0,10)}.pdf`);
    } catch (e) {
      console.error(e);
      alert('Gagal mengekspor PDF');
    }
    setIsExporting(false);
  };

  const handleExportWord = async () => {
    setIsExporting(true);
    try {
      const data = getFilteredData();
      
      let title = 'Laporan FAVELYNC';
      if (reportType === 'stock') title = 'Laporan Stok Barang';
      if (reportType === 'low_stock') title = 'Laporan Barang Harus Restock';
      if (reportType === 'transactions') title = 'Laporan Transaksi';

      if (data.length > 0) {
        const headers = Object.keys(data[0]);
        
        // Buat baris header
        const headerRow = new TableRow({
          children: headers.map(header => new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: header, bold: true })] })],
            shading: { fill: "f0f0f0" }
          }))
        });

        // Buat baris data
        const dataRows = data.map(obj => {
          return new TableRow({
            children: Object.values(obj).map(val => {
              let textVal = '';
              if (typeof val === 'number') {
                textVal = val > 1000 ? formatCurrency(val) : val.toString();
              } else {
                textVal = val as string;
              }
              return new TableCell({
                children: [new Paragraph(textVal)]
              });
            })
          });
        });

        const table = new Table({
          rows: [headerRow, ...dataRows],
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1 },
            bottom: { style: BorderStyle.SINGLE, size: 1 },
            left: { style: BorderStyle.SINGLE, size: 1 },
            right: { style: BorderStyle.SINGLE, size: 1 },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
            insideVertical: { style: BorderStyle.SINGLE, size: 1 },
          }
        });

        const doc = new Document({
          sections: [{
            children: [
              new Paragraph({
                children: [new TextRun({ text: title, bold: true, size: 32 })]
              }),
              new Paragraph({
                children: [new TextRun({ text: `Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}` })]
              }),
              new Paragraph(""), // spasi
              table
            ]
          }]
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, `FAVELYNC_Report_${reportType}_${new Date().toISOString().slice(0,10)}.docx`);
      }
    } catch (e) {
      console.error(e);
      alert('Gagal mengekspor Word');
    }
    setIsExporting(false);
  };

  const data = getFilteredData();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Laporan & Ekspor</h2>
        <p className="text-[#94a3b8] text-sm mt-1">Hasilkan laporan inventori dalam format PDF atau Excel</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="card">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Filter size={18} className="text-[#f59e0b]" />
              Konfigurasi Laporan
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="label">Jenis Laporan</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-[#2a2a4a] bg-[#1a1a2e] cursor-pointer hover:border-[#3a3a5a] transition-colors">
                    <input 
                      type="radio" 
                      name="reportType" 
                      value="stock" 
                      checked={reportType === 'stock'}
                      onChange={(e) => setReportType(e.target.value)}
                      className="accent-[#f59e0b]"
                    />
                    <div>
                      <p className="font-medium text-sm text-white">Semua Stok</p>
                      <p className="text-xs text-[#94a3b8]">Daftar lengkap produk & nilai</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-[#2a2a4a] bg-[#1a1a2e] cursor-pointer hover:border-[#3a3a5a] transition-colors">
                    <input 
                      type="radio" 
                      name="reportType" 
                      value="low_stock" 
                      checked={reportType === 'low_stock'}
                      onChange={(e) => setReportType(e.target.value)}
                      className="accent-[#f59e0b]"
                    />
                    <div>
                      <p className="font-medium text-sm text-white">Stok Kritis / Restock</p>
                      <p className="text-xs text-[#94a3b8]">Produk di bawah batas minimum</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-[#2a2a4a] bg-[#1a1a2e] cursor-pointer hover:border-[#3a3a5a] transition-colors">
                    <input 
                      type="radio" 
                      name="reportType" 
                      value="transactions" 
                      checked={reportType === 'transactions'}
                      onChange={(e) => setReportType(e.target.value)}
                      className="accent-[#f59e0b]"
                    />
                    <div>
                      <p className="font-medium text-sm text-white">Riwayat Transaksi</p>
                      <p className="text-xs text-[#94a3b8]">Log masuk/keluar berdasarkan waktu</p>
                    </div>
                  </label>
                </div>
              </div>

              {reportType === 'transactions' && (
                <div className="animate-fade-in">
                  <label className="label flex items-center gap-2">
                    <Calendar size={14} /> Rentang Waktu
                  </label>
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
              )}
            </div>
            
            <div className="mt-8 pt-6 border-t border-[#2a2a4a] flex flex-col gap-3">
              <button 
                className="btn btn-primary w-full justify-center"
                onClick={handleExportPDF}
                disabled={isExporting || data.length === 0}
              >
                <FileText size={18} /> Export ke PDF
              </button>
              <button 
                className="btn btn-secondary w-full justify-center text-[#22c55e] border-[rgba(34,197,94,0.3)] hover:bg-[rgba(34,197,94,0.1)] hover:border-[#22c55e]"
                onClick={handleExportExcel}
                disabled={isExporting || data.length === 0}
              >
                <FileSpreadsheet size={18} /> Export ke Excel
              </button>
              <button 
                className="btn btn-secondary w-full justify-center text-[#3b82f6] border-[rgba(59,130,246,0.3)] hover:bg-[rgba(59,130,246,0.1)] hover:border-[#3b82f6]"
                onClick={handleExportWord}
                disabled={isExporting || data.length === 0}
              >
                <FileText size={18} /> Export ke Word
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-white">Pratinjau Data ({data.length} baris)</h3>
            </div>
            
            <div className="flex-1 border border-[#2a2a4a] rounded-lg overflow-hidden bg-[#0f0f1a]">
              <div className="max-h-[500px] overflow-auto">
                {data.length > 0 ? (
                  <table className="w-full text-sm">
                    <thead className="bg-[#1e2a4a] sticky top-0">
                      <tr>
                        {Object.keys(data[0]).map(key => (
                          <th key={key} className="px-4 py-3 text-left font-semibold text-[#94a3b8] uppercase tracking-wider text-xs border-b border-[#2a2a4a] whitespace-nowrap">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2a2a4a]">
                      {data.slice(0, 50).map((row: any, i) => (
                        <tr key={i} className="hover:bg-[#1a1a2e]">
                          {Object.values(row).map((val: any, j) => (
                            <td key={j} className="px-4 py-3 text-[#cbd5e1] whitespace-nowrap">
                              {typeof val === 'number' && val > 1000 ? formatCurrency(val) : val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex items-center justify-center h-full min-h-[300px] text-[#64748b]">
                    Tidak ada data untuk filter ini
                  </div>
                )}
              </div>
              {data.length > 50 && (
                <div className="bg-[#1e2a4a] p-2 text-center text-xs text-[#94a3b8] border-t border-[#2a2a4a]">
                  Menampilkan 50 baris pertama. Export untuk melihat seluruh data.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
