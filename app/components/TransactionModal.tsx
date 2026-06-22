'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Transaction, TransactionType } from '@/app/lib/types';
import { useApp, useAuth } from '@/app/lib/store';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TransactionModal({ isOpen, onClose }: TransactionModalProps) {
  const { state, dispatch } = useApp();
  const { currentUser } = useAuth();
  const { products } = state;
  
  const [formData, setFormData] = useState<Partial<Transaction>>({
    productId: products[0]?.id || '',
    type: 'in',
    quantity: 1,
    unitPrice: 0,
    notes: '',
    date: new Date().toISOString().slice(0, 16), // YYYY-MM-DDThh:mm
  });

  // Auto-fill price based on product and type
  useEffect(() => {
    if (formData.productId) {
      const product = products.find(p => p.id === formData.productId);
      if (product) {
        setFormData(prev => ({
          ...prev,
          unitPrice: prev.type === 'in' ? product.buyPrice : product.sellPrice
        }));
      }
    }
  }, [formData.productId, formData.type, products]);

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setFormData({
        productId: products[0]?.id || '',
        type: 'in',
        quantity: 1,
        unitPrice: 0,
        notes: '',
        date: new Date().toISOString().slice(0, 16),
      });
    }
  }, [isOpen, products]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate stock for outgoing transaction
    if (formData.type === 'out') {
      const product = products.find(p => p.id === formData.productId);
      if (product && formData.quantity && formData.quantity > product.currentStock) {
        alert(`Stok tidak mencukupi! Stok saat ini: ${product.currentStock}`);
        return;
      }
    }

    const newTxn: Transaction = {
      ...(formData as Transaction),
      id: `txn-${Date.now().toString(36)}`,
      recordedBy: currentUser?.id || 'unknown',
      createdAt: new Date().toISOString(),
      // Ensure date is properly formatted ISO string
      date: new Date(formData.date || new Date()).toISOString(),
    };
    
    dispatch({ type: 'ADD_TRANSACTION', payload: newTxn });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    let parsedValue: string | number = value;
    if (type === 'number') {
      parsedValue = value === '' ? 0 : Number(value);
    }

    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  const selectedProduct = products.find(p => p.id === formData.productId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Catat Transaksi Baru"
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose} type="button">
            Batal
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleSubmit}
            type="submit"
            form="txn-form"
          >
            Simpan Transaksi
          </button>
        </>
      }
    >
      <form id="txn-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="type">Tipe Transaksi</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="type" 
                value="in" 
                checked={formData.type === 'in'}
                onChange={handleChange}
                className="accent-[#f59e0b]"
              />
              <span className="text-[#e2e8f0]">Stok Masuk</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="type" 
                value="out" 
                checked={formData.type === 'out'}
                onChange={handleChange}
                className="accent-[#f59e0b]"
              />
              <span className="text-[#e2e8f0]">Stok Keluar</span>
            </label>
          </div>
        </div>

        <div>
          <label className="label" htmlFor="productId">Pilih Produk</label>
          <select
            id="productId"
            name="productId"
            value={formData.productId || ''}
            onChange={handleChange}
            className="select"
            required
          >
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name} (Stok: {p.currentStock} {p.unit})</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="date">Waktu Transaksi</label>
            <input
              id="date"
              name="date"
              type="datetime-local"
              value={formData.date || ''}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="quantity">Jumlah ({selectedProduct?.unit || ''})</label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              value={formData.quantity || ''}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="label" htmlFor="unitPrice">
              Harga Satuan (Rp) 
              <span className="text-[#64748b] ml-2 font-normal">
                (Otomatis terisi dari data produk)
              </span>
            </label>
            <input
              id="unitPrice"
              name="unitPrice"
              type="number"
              min="0"
              value={formData.unitPrice || ''}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="notes">Keterangan</label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={formData.notes || ''}
            onChange={handleChange}
            className="input resize-none"
            placeholder={formData.type === 'in' ? "Nomor PO, Nama Supplier..." : "Nomor Invoice, Tujuan Pengiriman..."}
          />
        </div>
      </form>
    </Modal>
  );
}
