'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, Mail, Phone, MapPin, Package } from 'lucide-react';
import { useApp } from '@/app/lib/store';
import { Supplier } from '@/app/lib/types';
import { SupplierModal } from '@/app/components/SupplierModal';
import { ConfirmDialog } from '@/app/components/ui/ConfirmDialog';

export default function SupplierPage() {
  const { state, dispatch } = useApp();
  const { suppliers, products } = state;

  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<string | null>(null);

  // Filter suppliers
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(s => {
      return s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
             s.contact.includes(searchTerm) ||
             s.email.toLowerCase().includes(searchTerm.toLowerCase());
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [suppliers, searchTerm]);

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedSupplier(null);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setSupplierToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (supplierToDelete) {
      dispatch({ type: 'DELETE_SUPPLIER', payload: supplierToDelete });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Manajemen Supplier</h2>
          <p className="text-[#94a3b8] text-sm mt-1">Kelola data mitra pemasok barang Anda</p>
        </div>
        <div>
          <button className="btn btn-primary" onClick={handleCreate}>
            <Plus size={16} /> Tambah Supplier
          </button>
        </div>
      </div>

      <div className="flex items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b] z-10" size={16} />
          <input 
            type="text" 
            placeholder="Cari nama supplier, telepon, atau email..." 
            className="w-full bg-[rgba(15,23,42,0.6)] border border-[var(--border)] text-white text-sm rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <div key={supplier.id} className="card hover:-translate-y-1 transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-[#1e2a4a] rounded-xl flex items-center justify-center text-[#f59e0b] font-bold text-xl border border-[#2a2a4a]">
                {supplier.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex gap-2">
                <button 
                  className="btn-icon text-[#3b82f6] hover:bg-[#3b82f6]/10 rounded"
                  title="Edit"
                  onClick={() => handleEdit(supplier)}
                >
                  <Edit size={16} />
                </button>
                <button 
                  className="btn-icon text-[#ef4444] hover:bg-[#ef4444]/10 rounded"
                  title="Hapus"
                  onClick={() => handleDeleteClick(supplier.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-white mb-4">{supplier.name}</h3>

            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-[#cbd5e1]">
                <Phone size={16} className="text-[#64748b] mt-0.5" />
                <span>{supplier.contact}</span>
              </div>
              
              <div className="flex items-start gap-3 text-sm text-[#cbd5e1]">
                <Mail size={16} className="text-[#64748b] mt-0.5" />
                <span className="truncate" title={supplier.email}>{supplier.email || '-'}</span>
              </div>
              
              <div className="flex items-start gap-3 text-sm text-[#cbd5e1]">
                <MapPin size={16} className="text-[#64748b] mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2" title={supplier.address}>{supplier.address || '-'}</span>
              </div>

              <div className="pt-3 mt-3 border-t border-[#2a2a4a]">
                <div className="flex items-center gap-2 text-sm text-[#94a3b8] mb-2">
                  <Package size={14} />
                  <span>Menyuplai {supplier.productIds?.length || 0} Produk</span>
                </div>
                {supplier.productIds && supplier.productIds.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {supplier.productIds.slice(0, 3).map(id => {
                      const p = products.find(prod => prod.id === id);
                      return p ? (
                        <span key={id} className="text-[10px] bg-[#1e2a4a] text-[#cbd5e1] px-2 py-1 rounded truncate max-w-[120px]">
                          {p.name}
                        </span>
                      ) : null;
                    })}
                    {supplier.productIds.length > 3 && (
                      <span className="text-[10px] bg-[#1e2a4a] text-[#94a3b8] px-2 py-1 rounded">
                        +{supplier.productIds.length - 3} lainnya
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredSuppliers.length === 0 && (
          <div className="col-span-full py-12 text-center card border-dashed">
            <div className="w-16 h-16 bg-[#1e2a4a] rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-[#64748b]" />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">Tidak ada supplier ditemukan</h3>
            <p className="text-[#94a3b8]">Coba sesuaikan kata kunci pencarian Anda</p>
          </div>
        )}
      </div>

      <SupplierModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        supplier={selectedSupplier} 
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Supplier"
        message="Apakah Anda yakin ingin menghapus supplier ini? Tindakan ini tidak akan menghapus produk yang terhubung."
        isDestructive={true}
        confirmText="Ya, Hapus"
      />
    </div>
  );
}
