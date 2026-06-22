// ===== Enums =====
export type StockStatus = 'available' | 'low' | 'out';
export type TransactionType = 'in' | 'out';
export type UserRole = 'admin' | 'staff' | 'viewer';

// ===== Data Models =====
export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  buyPrice: number;
  sellPrice: number;
  currentStock: number;
  minimumStock: number;
  image?: string;
  supplierId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  date: string;
  productId: string;
  type: TransactionType;
  quantity: number;
  unitPrice: number;
  notes: string;
  recordedBy: string;
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  address: string;
  productIds: string[];
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Unit {
  id: string;
  name: string;
  abbreviation: string;
}

export interface Notification {
  id: string;
  type: 'warning' | 'danger' | 'info' | 'success';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// ===== AI Types =====
export interface AIInsight {
  id: string;
  type: 'top_seller' | 'slow_mover' | 'overstock' | 'cost_tip' | 'restock' | 'anomaly';
  icon: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'danger' | 'success';
  productId?: string;
}

export interface DemandPrediction {
  productId: string;
  productName: string;
  currentStock: number;
  predictedDailyUsage: number;
  daysUntilStockout: number;
  recommended30DayStock: number;
  confidence: number;
}

export interface AnomalyAlert {
  transactionId: string;
  productId: string;
  productName: string;
  date: string;
  quantity: number;
  expectedRange: [number, number];
  severity: 'warning' | 'danger';
  message: string;
}

// ===== App State =====
export interface AppState {
  products: Product[];
  transactions: Transaction[];
  suppliers: Supplier[];
  users: User[];
  categories: Category[];
  units: Unit[];
  currentUser: User | null;
  notifications: Notification[];
}

export type AppAction =
  | { type: 'SET_STATE'; payload: AppState }
  | { type: 'SET_CURRENT_USER'; payload: User | null }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'ADD_SUPPLIER'; payload: Supplier }
  | { type: 'UPDATE_SUPPLIER'; payload: Supplier }
  | { type: 'DELETE_SUPPLIER'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'ADD_UNIT'; payload: Unit }
  | { type: 'DELETE_UNIT'; payload: string }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'IMPORT_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: string };
