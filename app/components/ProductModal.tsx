'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Product, Category, Unit } from '@/app/lib/types';
import { useApp } from '@/app/lib/store';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

export function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const { state, dispatch } = useApp();
  const { categories, units } = state;
  
  const [formData, setFormData] = useState<Partial<Product>>({
    sku: '',
    name: '',
    category: categories[0]?.name || '',
    unit: units[0]?.name || '',
    buyPrice: 0,
    sellPrice: 0,
    currentStock: 0,
    minimumStock: 0,
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        sku: '',
        name: '',
        category: categories[0]?.name || '',
        unit: units[0]?.name || '',
        buyPrice: 0,
        sellPrice: 0,
        currentStock: 0,
        minimumStock: 0,
      });
    }
  }, [product, isOpen, categories, units]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (product) {
      // Edit mode
      dispatch({ 
        type: 'UPDATE_PRODUCT', 
        payload: { ...product, ...formData, updatedAt: new Date().toISOString() } as Product 
      });
    } else {
      // Create mode
      const newProduct: Product = {
        ...(formData as Product),
        id: `prd-${Date.now().toString(36)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
    }
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let parsedValue: string | number = value;
    if (type === 'number') {
      parsedValue = value === '' ? 0 : Number(value);
    }

    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Edit Produk' : 'Tambah Produk Baru'}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose} type="button">
            Batal
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleSubmit}
            type="submit"
            form="product-form"
          >
            Simpan Produk
          </button>
        </>
      }
    >
      <form id="product-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="sku">SKU / Barcode</label>
            <input
              id="sku"
              name="sku"
              type="text"
              value={formData.sku || ''}
              onChange={handleChange}
              className="input"
              placeholder="Contoh: ELK-001"
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="name">Nama Produk</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name || ''}
              onChange={handleChange}
              className="input"
              placeholder="Contoh: Kabel USB Type-C"
              required
            />
          </div>

          <div>
            <label className="label" htmlFor="category">Kategori</label>
            <select
              id="category"
              name="category"
              value={formData.category || ''}
              onChange={handleChange}
              className="select"
              required
            >
              <option value="" disabled>Pilih Kategori</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="unit">Satuan</label>
            <select
              id="unit"
              name="unit"
              value={formData.unit || ''}
              onChange={handleChange}
              className="select"
              required
            >
              <option value="" disabled>Pilih Satuan</option>
              {units.map(u => (
                <option key={u.id} value={u.name}>{u.name} ({u.abbreviation})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="buyPrice">Harga Beli (Rp)</label>
            <input
              id="buyPrice"
              name="buyPrice"
              type="number"
              min="0"
              value={formData.buyPrice || ''}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="sellPrice">Harga Jual (Rp)</label>
            <input
              id="sellPrice"
              name="sellPrice"
              type="number"
              min="0"
              value={formData.sellPrice || ''}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label className="label" htmlFor="currentStock">Stok Saat Ini</label>
            <input
              id="currentStock"
              name="currentStock"
              type="number"
              min="0"
              value={formData.currentStock || ''}
              onChange={handleChange}
              className="input"
              disabled={!!product} // Disable if editing (should use transactions)
              title={product ? "Gunakan menu Transaksi untuk mengubah stok" : ""}
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="minimumStock">Batas Minimum Stok</label>
            <input
              id="minimumStock"
              name="minimumStock"
              type="number"
              min="0"
              value={formData.minimumStock || ''}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
