'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, AppAction, Product, User } from './types';
import { seedProducts, seedTransactions, seedSuppliers, seedUsers, seedCategories, seedUnits } from './data';

const STORAGE_KEY = 'favelync-data';

const initialState: AppState = {
  products: seedProducts,
  transactions: seedTransactions,
  suppliers: seedSuppliers,
  users: seedUsers,
  categories: seedCategories,
  units: seedUnits,
  currentUser: null,
  notifications: [],
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_STATE':
      return { ...action.payload };

    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };

    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };

    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p => p.id === action.payload.id ? action.payload : p),
      };

    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload),
      };

    case 'ADD_TRANSACTION': {
      const txn = action.payload;
      const updatedProducts = state.products.map(p => {
        if (p.id === txn.productId) {
          const newStock = txn.type === 'in'
            ? p.currentStock + txn.quantity
            : Math.max(0, p.currentStock - txn.quantity);
          return { ...p, currentStock: newStock, updatedAt: new Date().toISOString() };
        }
        return p;
      });
      return {
        ...state,
        transactions: [txn, ...state.transactions],
        products: updatedProducts,
      };
    }

    case 'ADD_SUPPLIER':
      return { ...state, suppliers: [...state.suppliers, action.payload] };

    case 'UPDATE_SUPPLIER':
      return {
        ...state,
        suppliers: state.suppliers.map(s => s.id === action.payload.id ? action.payload : s),
      };

    case 'DELETE_SUPPLIER':
      return {
        ...state,
        suppliers: state.suppliers.filter(s => s.id !== action.payload),
      };

    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };

    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(c => c.id !== action.payload),
      };

    case 'ADD_UNIT':
      return { ...state, units: [...state.units, action.payload] };

    case 'DELETE_UNIT':
      return {
        ...state,
        units: state.units.filter(u => u.id !== action.payload),
      };

    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };

    case 'IMPORT_PRODUCTS':
      return { ...state, products: [...state.products, ...action.payload] };

    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };

    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(u => u.id === action.payload.id ? action.payload : u),
      };

    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(u => u.id !== action.payload),
      };

    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [hydrated, setHydrated] = React.useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        dispatch({ type: 'SET_STATE', payload: { ...initialState, ...parsed } });
      }
    } catch {
      // Use default data
    }
    setHydrated(true);
  }, []);

  // Save to localStorage on change (after hydration)
  useEffect(() => {
    if (hydrated) {
      try {
        const toSave = { ...state };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      } catch {
        // Storage full or unavailable
      }
    }
  }, [state, hydrated]);

  if (!hydrated) {
    return null;
  }

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

export function useAuth() {
  const { state, dispatch } = useApp();

  const login = (email: string, password: string): User | null => {
    const user = state.users.find(u => u.email === email && u.password === password);
    if (user) {
      dispatch({ type: 'SET_CURRENT_USER', payload: user });
      localStorage.setItem('favelync-session', JSON.stringify(user));
      return user;
    }
    return null;
  };

  const logout = () => {
    dispatch({ type: 'SET_CURRENT_USER', payload: null });
    localStorage.removeItem('favelync-session');
  };

  const restoreSession = () => {
    try {
      const session = localStorage.getItem('favelync-session');
      if (session) {
        const user = JSON.parse(session);
        dispatch({ type: 'SET_CURRENT_USER', payload: user });
        return user;
      }
    } catch {
      // Invalid session
    }
    return null;
  };

  return { currentUser: state.currentUser, login, logout, restoreSession };
}
