import { Product, Transaction, Supplier, User, Category, Unit } from './types';

// Helper to generate IDs
const id = (prefix: string, n: number) => `${prefix}-${String(n).padStart(4, '0')}`;
const date = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};

export const seedCategories: Category[] = [
  { id: 'cat-01', name: 'Elektronik' },
  { id: 'cat-02', name: 'Makanan & Minuman' },
  { id: 'cat-03', name: 'Alat Tulis' },
  { id: 'cat-04', name: 'Perlengkapan Rumah' },
  { id: 'cat-05', name: 'Pakaian' },
  { id: 'cat-06', name: 'Bahan Baku' },
  { id: 'cat-07', name: 'Kesehatan' },
];

export const seedUnits: Unit[] = [
  { id: 'unit-01', name: 'Buah', abbreviation: 'pcs' },
  { id: 'unit-02', name: 'Kilogram', abbreviation: 'kg' },
  { id: 'unit-03', name: 'Liter', abbreviation: 'L' },
  { id: 'unit-04', name: 'Meter', abbreviation: 'm' },
  { id: 'unit-05', name: 'Pak', abbreviation: 'pak' },
  { id: 'unit-06', name: 'Dus', abbreviation: 'dus' },
  { id: 'unit-07', name: 'Lusin', abbreviation: 'lsn' },
];

export const seedUsers: User[] = [
  { id: 'usr-0001', name: 'Admin Utama', email: 'admin@favelync.id', password: 'admin123', role: 'admin', createdAt: date(90) },
  { id: 'usr-0002', name: 'Budi Santoso', email: 'budi@favelync.id', password: 'staff123', role: 'staff', createdAt: date(60) },
  { id: 'usr-0003', name: 'Siti Viewer', email: 'siti@favelync.id', password: 'viewer123', role: 'viewer', createdAt: date(30) },
];

export const seedSuppliers: Supplier[] = [
  { id: 'sup-0001', name: 'PT Elektronik Jaya', contact: '021-5551234', email: 'info@elektronikjaya.id', address: 'Jl. Mangga Dua No. 15, Jakarta', productIds: ['prd-0001', 'prd-0002', 'prd-0003'], createdAt: date(80) },
  { id: 'sup-0002', name: 'CV Pangan Makmur', contact: '021-5555678', email: 'order@panganmakmur.id', address: 'Jl. Raya Bogor KM 30, Depok', productIds: ['prd-0004', 'prd-0005', 'prd-0006'], createdAt: date(75) },
  { id: 'sup-0003', name: 'UD Alat Tulis Gemilang', contact: '022-7331234', email: 'sales@gemilang.id', address: 'Jl. Braga No. 42, Bandung', productIds: ['prd-0007', 'prd-0008', 'prd-0009'], createdAt: date(70) },
  { id: 'sup-0004', name: 'PT Textile Indo', contact: '031-8451234', email: 'info@textileindo.id', address: 'Jl. Industri Raya, Surabaya', productIds: ['prd-0014', 'prd-0015'], createdAt: date(65) },
  { id: 'sup-0005', name: 'CV Sehat Farma', contact: '024-7651234', email: 'order@sehatfarma.id', address: 'Jl. Pemuda No. 88, Semarang', productIds: ['prd-0016', 'prd-0017'], createdAt: date(60) },
];

export const seedProducts: Product[] = [
  { id: 'prd-0001', sku: 'ELK-001', name: 'Kabel USB Type-C 1m', category: 'Elektronik', unit: 'Buah', buyPrice: 15000, sellPrice: 28000, currentStock: 150, minimumStock: 30, createdAt: date(60), updatedAt: date(2) },
  { id: 'prd-0002', sku: 'ELK-002', name: 'Mouse Wireless Logitech', category: 'Elektronik', unit: 'Buah', buyPrice: 85000, sellPrice: 145000, currentStock: 42, minimumStock: 10, createdAt: date(58), updatedAt: date(1) },
  { id: 'prd-0003', sku: 'ELK-003', name: 'Earphone Bluetooth TWS', category: 'Elektronik', unit: 'Buah', buyPrice: 45000, sellPrice: 89000, currentStock: 8, minimumStock: 15, createdAt: date(55), updatedAt: date(3) },
  { id: 'prd-0004', sku: 'MKN-001', name: 'Kopi Arabika 250gr', category: 'Makanan & Minuman', unit: 'Pak', buyPrice: 35000, sellPrice: 55000, currentStock: 75, minimumStock: 20, createdAt: date(50), updatedAt: date(1) },
  { id: 'prd-0005', sku: 'MKN-002', name: 'Teh Hijau Premium 100gr', category: 'Makanan & Minuman', unit: 'Pak', buyPrice: 22000, sellPrice: 38000, currentStock: 0, minimumStock: 15, createdAt: date(48), updatedAt: date(5) },
  { id: 'prd-0006', sku: 'MKN-003', name: 'Madu Hutan Asli 500ml', category: 'Makanan & Minuman', unit: 'Buah', buyPrice: 65000, sellPrice: 110000, currentStock: 23, minimumStock: 10, createdAt: date(45), updatedAt: date(2) },
  { id: 'prd-0007', sku: 'ATK-001', name: 'Pulpen Pilot G2 0.5', category: 'Alat Tulis', unit: 'Lusin', buyPrice: 48000, sellPrice: 72000, currentStock: 35, minimumStock: 10, createdAt: date(40), updatedAt: date(4) },
  { id: 'prd-0008', sku: 'ATK-002', name: 'Buku Tulis A5 80 Lembar', category: 'Alat Tulis', unit: 'Lusin', buyPrice: 36000, sellPrice: 54000, currentStock: 12, minimumStock: 15, createdAt: date(38), updatedAt: date(3) },
  { id: 'prd-0009', sku: 'ATK-003', name: 'Kertas HVS A4 70gr', category: 'Alat Tulis', unit: 'Dus', buyPrice: 42000, sellPrice: 58000, currentStock: 50, minimumStock: 20, createdAt: date(35), updatedAt: date(1) },
  { id: 'prd-0010', sku: 'RMH-001', name: 'Lampu LED 12 Watt', category: 'Perlengkapan Rumah', unit: 'Buah', buyPrice: 18000, sellPrice: 32000, currentStock: 88, minimumStock: 25, createdAt: date(33), updatedAt: date(2) },
  { id: 'prd-0011', sku: 'RMH-002', name: 'Sapu Ijuk Premium', category: 'Perlengkapan Rumah', unit: 'Buah', buyPrice: 25000, sellPrice: 42000, currentStock: 15, minimumStock: 8, createdAt: date(30), updatedAt: date(5) },
  { id: 'prd-0012', sku: 'RMH-003', name: 'Ember Plastik 20L', category: 'Perlengkapan Rumah', unit: 'Buah', buyPrice: 20000, sellPrice: 35000, currentStock: 30, minimumStock: 10, createdAt: date(28), updatedAt: date(3) },
  { id: 'prd-0013', sku: 'RMH-004', name: 'Rak Besi Serbaguna', category: 'Perlengkapan Rumah', unit: 'Buah', buyPrice: 150000, sellPrice: 250000, currentStock: 5, minimumStock: 3, createdAt: date(25), updatedAt: date(7) },
  { id: 'prd-0014', sku: 'PKN-001', name: 'Kaos Polos Cotton 30s', category: 'Pakaian', unit: 'Buah', buyPrice: 35000, sellPrice: 65000, currentStock: 60, minimumStock: 20, createdAt: date(22), updatedAt: date(1) },
  { id: 'prd-0015', sku: 'PKN-002', name: 'Celana Jeans Standar', category: 'Pakaian', unit: 'Buah', buyPrice: 95000, sellPrice: 175000, currentStock: 0, minimumStock: 10, createdAt: date(20), updatedAt: date(4) },
  { id: 'prd-0016', sku: 'KSH-001', name: 'Masker Medis 3 Ply', category: 'Kesehatan', unit: 'Dus', buyPrice: 25000, sellPrice: 45000, currentStock: 100, minimumStock: 30, createdAt: date(18), updatedAt: date(2) },
  { id: 'prd-0017', sku: 'KSH-002', name: 'Hand Sanitizer 500ml', category: 'Kesehatan', unit: 'Buah', buyPrice: 18000, sellPrice: 30000, currentStock: 45, minimumStock: 15, createdAt: date(15), updatedAt: date(1) },
  { id: 'prd-0018', sku: 'BB-001', name: 'Tepung Terigu 1kg', category: 'Bahan Baku', unit: 'Kilogram', buyPrice: 12000, sellPrice: 16000, currentStock: 200, minimumStock: 50, createdAt: date(12), updatedAt: date(1) },
  { id: 'prd-0019', sku: 'BB-002', name: 'Gula Pasir 1kg', category: 'Bahan Baku', unit: 'Kilogram', buyPrice: 14000, sellPrice: 18000, currentStock: 3, minimumStock: 40, createdAt: date(10), updatedAt: date(2) },
  { id: 'prd-0020', sku: 'ELK-004', name: 'Power Bank 10000mAh', category: 'Elektronik', unit: 'Buah', buyPrice: 75000, sellPrice: 135000, currentStock: 28, minimumStock: 10, createdAt: date(8), updatedAt: date(1) },
];

// Generate realistic transactions over 60 days
function generateTransactions(): Transaction[] {
  const txns: Transaction[] = [];
  let counter = 1;
  const userIds = ['usr-0001', 'usr-0002'];
  const productIds = seedProducts.map(p => p.id);

  for (let day = 60; day >= 0; day--) {
    // 2-5 transactions per day
    const txnsPerDay = 2 + Math.floor(Math.random() * 4);
    for (let i = 0; i < txnsPerDay; i++) {
      const pIdx = Math.floor(Math.random() * productIds.length);
      const product = seedProducts[pIdx];
      const isIncoming = Math.random() > 0.6; // 40% incoming, 60% outgoing
      const qty = isIncoming
        ? 5 + Math.floor(Math.random() * 30)
        : 1 + Math.floor(Math.random() * 10);

      txns.push({
        id: id('txn', counter++),
        date: date(day),
        productId: product.id,
        type: isIncoming ? 'in' : 'out',
        quantity: qty,
        unitPrice: isIncoming ? product.buyPrice : product.sellPrice,
        notes: isIncoming
          ? `Restock dari supplier`
          : `Penjualan harian`,
        recordedBy: userIds[Math.floor(Math.random() * userIds.length)],
        createdAt: date(day),
      });
    }
  }
  return txns;
}

export const seedTransactions: Transaction[] = generateTransactions();
