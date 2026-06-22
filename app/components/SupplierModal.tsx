'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Supplier } from '@/app/lib/types';
import { useApp } from '@/app/lib/store';

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier?: Supplier | null;
}

export function SupplierModal({ isOpen, onClose, supplier }: SupplierModalProps) {
  const { state, dispatch } = useApp();
  const { products } = state;
  
  const [formData, setFormData] = useState<Partial<Supplier>>({
    name: '',
    contact: '',
    email: '',
    address: '',
    productIds: [],
  });

  useEffect(() => {
    if (supplier) {
      setFormData(supplier);
    } else {
      setFormData({
        name: '',
        contact: '',
        email: '',
        address: '',
        productIds: [],
      });
    }
  }, [supplier, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (supplier) {
      dispatch({ 
        type: 'UPDATE_SUPPLIER', 
        payload: { ...supplier, ...formData } as Supplier 
      });
    } else {
      const newSupplier: Supplier = {
        ...(formData as Supplier),
        id: `sup-${Date.now().toString(36)}`,
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_SUPPLIER', payload: newSupplier });
    }
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProductToggle = (productId: string) => {
    setFormData(prev => {
      const ids = prev.productIds || [];
      if (ids.includes(productId)) {
        return { ...prev, productIds: ids.filter(id => id !== productId) };
      } else {
        return { ...prev, productIds: [...ids, productId] };
      }
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={supplier ? 'Edit Supplier' : 'Tambah Supplier Baru'}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose} type="button">
            Batal
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleSubmit}
            type="submit"
            form="supplier-form"
          >
            Simpan Supplier
          </button>
        </>
      }
    >
      <form id="supplier-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="name">Nama Perusahaan / Supplier</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name || ''}
            onChange={handleChange}
            className="input"
            placeholder="PT. Contoh Sejahtera"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="contact">No. Telepon / HP</label>
            <input
              id="contact"
              name="contact"
              type="text"
              value={formData.contact || ''}
              onChange={handleChange}
              className="input"
              placeholder="08123456789"
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="input"
              placeholder="email@supplier.com"
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="address">Alamat Lengkap</label>
          <textarea
            id="address"
            name="address"
            rows={3}
            value={formData.address || ''}
            onChange={handleChange}
            className="input resize-none"
            placeholder="Jl. Contoh No. 123, Kota..."
          />
        </div>

        <div>
          <label className="label mb-2">Produk yang Disuplai</label>
          <div className="border border-[#2a2a4a] rounded-lg p-3 max-h-48 overflow-y-auto bg-[#0f0f1a]">
            {products.length === 0 ? (
              <p className="text-[#64748b] text-sm text-center py-2">Belum ada produk terdaftar</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {products.map(product => {
                  const isSelected = formData.productIds?.includes(product.id) || false;
                  return (
                    <label 
                      key={product.id} 
                      className={`flex items-start gap-3 p-2 rounded cursor-pointer border transition-colors ${
                        isSelected 
                          ? 'border-[#f59e0b] bg-[rgba(245,158,11,0.05)]' 
                          : 'border-[#2a2a4a] bg-[#1a1a2e] hover:border-[#3a3a5a]'
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => handleProductToggle(product.id)}
                        className="mt-1 accent-[#f59e0b]"
                      />
                      <div>
                        <p className="text-sm font-medium text-white line-clamp-1" title={product.name}>
                          {product.name}
                        </p>
                        <p className="text-xs text-[#94a3b8] mono">{product.sku}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
