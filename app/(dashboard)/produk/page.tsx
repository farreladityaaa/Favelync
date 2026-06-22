'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Download, Upload, Edit, Trash2, FileText, FileSpreadsheet, Package } from 'lucide-react';
import { useApp } from '@/app/lib/store';
import { Product } from '@/app/lib/types';
import { formatCurrency, getStockStatus, getStockStatusLabel } from '@/app/lib/utils';
import { exportToExcel, exportToPDF, exportToWord } from '@/app/lib/export';
import { ProductModal } from '@/app/components/ProductModal';
import { ConfirmDialog } from '@/app/components/ui/ConfirmDialog';

export default function ProductsPage() {
  const { state, dispatch } = useApp();
  const { products, categories } = state;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
      
      let matchesStatus = true;
      if (selectedStatus) {
        const status = getStockStatus(p.currentStock, p.minimumStock);
        matchesStatus = status === selectedStatus;
      }

      return matchesSearch && matchesCategory && matchesStatus;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [products, searchTerm, selectedCategory, selectedStatus]);

  const prepareExportData = () => {
    return filteredProducts.map(p => ({
      SKU: p.sku,
      Nama: p.name,
      Kategori: p.category,
      'Harga Beli': p.buyPrice,
      'Harga Jual': p.sellPrice,
      Stok: p.currentStock,
      Satuan: p.unit,
      'Min Stok': p.minimumStock,
      Status: getStockStatusLabel(getStockStatus(p.currentStock, p.minimumStock))
    }));
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      dispatch({ type: 'DELETE_PRODUCT', payload: productToDelete });
    }
  };

  const getStatusBadge = (current: number, minimum: number) => {
    const status = getStockStatus(current, minimum);
    const label = getStockStatusLabel(status);
    
    let className = 'badge ';
    if (status === 'available') className += 'badge-success';
    else if (status === 'low') className += 'badge-warning';
    else className += 'badge-danger';

    return <span className={className}>{label}</span>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Manajemen Produk</h2>
          <p className="text-[#94a3b8] text-sm mt-1">Kelola data produk, harga, dan stok Anda</p>
        </div>
        <div className="flex gap-2 relative">
          <button className="btn btn-secondary btn-sm" title="Import Data">
            <Upload size={16} /> <span className="hidden sm:inline">Import</span>
          </button>
          
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
                  exportToExcel(prepareExportData(), `Produk_${new Date().toISOString().slice(0,10)}`);
                  setExportMenuOpen(false);
                }}
              >
                <FileSpreadsheet size={16} /> Export ke Excel
              </button>
              <button 
                className="w-full text-left px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-white flex items-center gap-2 transition-colors"
                onClick={() => {
                  exportToPDF(prepareExportData(), 'Laporan Daftar Produk', `Produk_${new Date().toISOString().slice(0,10)}`);
                  setExportMenuOpen(false);
                }}
              >
                <FileText size={16} /> Export ke PDF
              </button>
              <button 
                className="w-full text-left px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[#3b82f6] flex items-center gap-2 transition-colors"
                onClick={() => {
                  exportToWord(prepareExportData(), 'Laporan Daftar Produk', `Produk_${new Date().toISOString().slice(0,10)}`);
                  setExportMenuOpen(false);
                }}
              >
                <FileText size={16} /> Export ke Word
              </button>
            </div>
          )}

          <button className="btn btn-primary btn-sm" onClick={handleCreate}>
            <Plus size={16} /> Tambah Produk
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
              placeholder="Cari SKU atau Nama Produk..." 
              className="w-full bg-[rgba(15,23,42,0.6)] border border-[var(--border)] text-white text-sm rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-40">
              <select 
                className="select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Semua Kategori</option>
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            
            <div className="relative w-full sm:w-40">
              <select 
                className="select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">Semua Status</option>
                <option value="available">Tersedia</option>
                <option value="low">Stok Rendah</option>
                <option value="out">Habis</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Produk</th>
                <th>Kategori</th>
                <th className="text-right">Harga Jual</th>
                <th className="text-right">Stok</th>
                <th className="text-center">Status</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="font-medium text-white">{product.name}</div>
                    <div className="text-xs text-[#94a3b8] mono mt-0.5">{product.sku}</div>
                  </td>
                  <td className="text-[#cbd5e1]">{product.category}</td>
                  <td className="text-right mono text-[#cbd5e1]">{formatCurrency(product.sellPrice)}</td>
                  <td className="text-right mono">
                    <span className={product.currentStock <= product.minimumStock ? 'text-[#f59e0b] font-bold' : 'text-[#cbd5e1]'}>
                      {product.currentStock}
                    </span>
                    <span className="text-xs text-[#64748b] ml-1">{product.unit}</span>
                  </td>
                  <td className="text-center">
                    {getStatusBadge(product.currentStock, product.minimumStock)}
                  </td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <button 
                        className="btn-icon text-[#3b82f6] hover:bg-[#3b82f6]/10 rounded"
                        title="Edit"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="btn-icon text-[#ef4444] hover:bg-[#ef4444]/10 rounded"
                        title="Hapus"
                        onClick={() => handleDeleteClick(product.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-[#64748b]">
                      <Package size={48} className="mb-4 opacity-50" />
                      <p className="text-base font-medium text-[#94a3b8]">Tidak ada produk ditemukan</p>
                      <p className="text-sm mt-1">Coba sesuaikan kata kunci pencarian atau filter Anda</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={selectedProduct} 
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Produk"
        message="Apakah Anda yakin ingin menghapus produk ini? Data yang dihapus tidak dapat dikembalikan."
        isDestructive={true}
        confirmText="Ya, Hapus"
      />
    </div>
  );
}
