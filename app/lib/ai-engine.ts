import { Product, Transaction, AIInsight, DemandPrediction, AnomalyAlert } from './types';

// ===== Demand Prediction using Linear Regression =====
export function predictDemand(
  productId: string,
  transactions: Transaction[],
  products: Product[],
  days: number = 30
): DemandPrediction | null {
  const product = products.find(p => p.id === productId);
  if (!product) return null;

  // Get outgoing transactions for this product in last 60 days
  const now = Date.now();
  const sixtyDaysAgo = now - 60 * 24 * 60 * 60 * 1000;
  const outTxns = transactions.filter(
    t => t.productId === productId && t.type === 'out' && new Date(t.date).getTime() > sixtyDaysAgo
  );

  if (outTxns.length === 0) {
    return {
      productId,
      productName: product.name,
      currentStock: product.currentStock,
      predictedDailyUsage: 0,
      daysUntilStockout: product.currentStock > 0 ? 999 : 0,
      recommended30DayStock: product.minimumStock,
      confidence: 0,
    };
  }

  // Calculate daily usage using exponential moving average
  const dailyUsage: Map<string, number> = new Map();
  outTxns.forEach(t => {
    const dayKey = new Date(t.date).toISOString().slice(0, 10);
    dailyUsage.set(dayKey, (dailyUsage.get(dayKey) || 0) + t.quantity);
  });

  const usageValues = Array.from(dailyUsage.values());
  const avgDailyUsage = usageValues.reduce((s, v) => s + v, 0) / Math.max(usageValues.length, 1);

  // Exponential moving average (alpha = 0.3 for recent emphasis)
  let ema = usageValues[0] || 0;
  const alpha = 0.3;
  for (let i = 1; i < usageValues.length; i++) {
    ema = alpha * usageValues[i] + (1 - alpha) * ema;
  }

  const predictedDaily = ema || avgDailyUsage;
  const daysUntilOut = predictedDaily > 0 ? Math.floor(product.currentStock / predictedDaily) : 999;
  const recommended = Math.ceil(predictedDaily * days) + product.minimumStock;

  // Confidence based on data points
  const confidence = Math.min(usageValues.length / 30, 1) * 100;

  return {
    productId,
    productName: product.name,
    currentStock: product.currentStock,
    predictedDailyUsage: Math.round(predictedDaily * 100) / 100,
    daysUntilStockout: daysUntilOut,
    recommended30DayStock: recommended,
    confidence: Math.round(confidence),
  };
}

// ===== Anomaly Detection using Z-Score =====
export function detectAnomalies(
  transactions: Transaction[],
  products: Product[]
): AnomalyAlert[] {
  const alerts: AnomalyAlert[] = [];
  const productGroups = new Map<string, Transaction[]>();

  transactions.forEach(t => {
    if (!productGroups.has(t.productId)) productGroups.set(t.productId, []);
    productGroups.get(t.productId)!.push(t);
  });

  productGroups.forEach((txns, productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const outTxns = txns.filter(t => t.type === 'out');
    if (outTxns.length < 5) return;

    const quantities = outTxns.map(t => t.quantity);
    const mean = quantities.reduce((s, v) => s + v, 0) / quantities.length;
    const stdDev = Math.sqrt(quantities.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / quantities.length);

    if (stdDev === 0) return;

    outTxns.forEach(t => {
      const zScore = Math.abs((t.quantity - mean) / stdDev);
      if (zScore > 2) {
        alerts.push({
          transactionId: t.id,
          productId,
          productName: product.name,
          date: t.date,
          quantity: t.quantity,
          expectedRange: [Math.max(0, Math.round(mean - 2 * stdDev)), Math.round(mean + 2 * stdDev)],
          severity: zScore > 3 ? 'danger' : 'warning',
          message: `Pengeluaran ${t.quantity} ${product.unit} tidak wajar. Rata-rata: ${Math.round(mean)} ± ${Math.round(stdDev * 2)}`,
        });
      }
    });
  });

  return alerts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
}

// ===== Restock Alerts =====
export function getRestockAlerts(
  products: Product[],
  transactions: Transaction[]
): DemandPrediction[] {
  return products
    .map(p => predictDemand(p.id, transactions, products))
    .filter((p): p is DemandPrediction => p !== null && p.daysUntilStockout < 14)
    .sort((a, b) => a.daysUntilStockout - b.daysUntilStockout);
}

// ===== AI Insights Generator =====
export function generateInsights(
  products: Product[],
  transactions: Transaction[]
): AIInsight[] {
  const insights: AIInsight[] = [];
  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

  const recentTxns = transactions.filter(t => new Date(t.date).getTime() > thirtyDaysAgo);

  // Top sellers (by outgoing quantity)
  const salesByProduct = new Map<string, number>();
  recentTxns.filter(t => t.type === 'out').forEach(t => {
    salesByProduct.set(t.productId, (salesByProduct.get(t.productId) || 0) + t.quantity);
  });

  const sortedSales = Array.from(salesByProduct.entries()).sort((a, b) => b[1] - a[1]);
  if (sortedSales.length > 0) {
    const topProduct = products.find(p => p.id === sortedSales[0][0]);
    if (topProduct) {
      insights.push({
        id: 'ins-top-seller',
        type: 'top_seller',
        icon: '🏆',
        title: 'Produk Terlaris',
        description: `${topProduct.name} terjual ${sortedSales[0][1]} unit dalam 30 hari terakhir. Pastikan stok selalu tersedia!`,
        severity: 'success',
        productId: topProduct.id,
      });
    }
  }

  // Slow movers
  const allProductIds = new Set(products.map(p => p.id));
  const soldProductIds = new Set(salesByProduct.keys());
  const unsoldProducts = products.filter(p => !soldProductIds.has(p.id) && p.currentStock > 0);
  if (unsoldProducts.length > 0) {
    insights.push({
      id: 'ins-slow-mover',
      type: 'slow_mover',
      icon: '🐌',
      title: 'Produk Lambat Terjual',
      description: `${unsoldProducts.length} produk tidak ada penjualan dalam 30 hari: ${unsoldProducts.slice(0, 3).map(p => p.name).join(', ')}${unsoldProducts.length > 3 ? '...' : ''}`,
      severity: 'warning',
    });
  }

  // Out of stock
  const outOfStock = products.filter(p => p.currentStock === 0);
  if (outOfStock.length > 0) {
    insights.push({
      id: 'ins-out-stock',
      type: 'restock',
      icon: '🚨',
      title: 'Stok Habis!',
      description: `${outOfStock.length} produk habis: ${outOfStock.map(p => p.name).join(', ')}. Segera lakukan pengisian ulang.`,
      severity: 'danger',
    });
  }

  // Low stock
  const lowStock = products.filter(p => p.currentStock > 0 && p.currentStock < p.minimumStock);
  if (lowStock.length > 0) {
    insights.push({
      id: 'ins-low-stock',
      type: 'restock',
      icon: '⚠️',
      title: 'Stok Rendah',
      description: `${lowStock.length} produk di bawah batas minimum: ${lowStock.slice(0, 3).map(p => `${p.name} (${p.currentStock})`).join(', ')}`,
      severity: 'warning',
    });
  }

  // Overstock detection
  const overstocked = products.filter(p => p.currentStock > p.minimumStock * 5);
  if (overstocked.length > 0) {
    const totalOverstockValue = overstocked.reduce((s, p) => s + (p.currentStock - p.minimumStock * 3) * p.buyPrice, 0);
    insights.push({
      id: 'ins-overstock',
      type: 'overstock',
      icon: '📦',
      title: 'Kelebihan Stok',
      description: `${overstocked.length} produk melebihi 5x batas minimum. Modal tertahan ~Rp ${totalOverstockValue.toLocaleString('id-ID')}`,
      severity: 'info',
    });
  }

  // Cost tip
  const highMarginProducts = products.filter(p => {
    const margin = (p.sellPrice - p.buyPrice) / p.buyPrice;
    return margin > 0.8 && salesByProduct.has(p.id);
  }).sort((a, b) => {
    const salesA = salesByProduct.get(a.id) || 0;
    const salesB = salesByProduct.get(b.id) || 0;
    return salesB - salesA;
  });

  if (highMarginProducts.length > 0) {
    insights.push({
      id: 'ins-cost-tip',
      type: 'cost_tip',
      icon: '💡',
      title: 'Peluang Profit Tinggi',
      description: `${highMarginProducts[0].name} punya margin >80% dan laku keras. Pertimbangkan menambah stok untuk memaksimalkan keuntungan.`,
      severity: 'success',
      productId: highMarginProducts[0].id,
    });
  }

  return insights;
}

// ===== Stock Movement Data (for charts) =====
export function getStockMovementData(transactions: Transaction[], days: number = 30) {
  const now = new Date();
  const data: { date: string; masuk: number; keluar: number }[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayKey = d.toISOString().slice(0, 10);
    const dayLabel = `${d.getDate()}/${d.getMonth() + 1}`;

    const dayTxns = transactions.filter(t => t.date.slice(0, 10) === dayKey);
    const masuk = dayTxns.filter(t => t.type === 'in').reduce((s, t) => s + t.quantity, 0);
    const keluar = dayTxns.filter(t => t.type === 'out').reduce((s, t) => s + t.quantity, 0);

    data.push({ date: dayLabel, masuk, keluar });
  }

  return data;
}

// ===== Top Products by Outflow =====
export function getTopProducts(transactions: Transaction[], products: Product[], limit: number = 5) {
  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

  const salesMap = new Map<string, number>();
  transactions
    .filter(t => t.type === 'out' && new Date(t.date).getTime() > thirtyDaysAgo)
    .forEach(t => salesMap.set(t.productId, (salesMap.get(t.productId) || 0) + t.quantity));

  return Array.from(salesMap.entries())
    .map(([pid, qty]) => ({
      name: products.find(p => p.id === pid)?.name || 'Unknown',
      jumlah: qty,
    }))
    .sort((a, b) => b.jumlah - a.jumlah)
    .slice(0, limit);
}

// ===== Category Distribution =====
export function getCategoryDistribution(products: Product[]) {
  const catMap = new Map<string, number>();
  products.forEach(p => catMap.set(p.category, (catMap.get(p.category) || 0) + 1));
  return Array.from(catMap.entries()).map(([name, value]) => ({ name, value }));
}

// ===== Stock Value Over Time =====
export function getStockValueOverTime(transactions: Transaction[], products: Product[], days: number = 30) {
  const totalCurrentValue = products.reduce((s, p) => s + p.currentStock * p.buyPrice, 0);
  const now = new Date();
  const data: { date: string; nilai: number }[] = [];

  let runningValue = totalCurrentValue;
  // Go backwards, adjusting value
  for (let i = 0; i < days; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayKey = d.toISOString().slice(0, 10);
    const dayLabel = `${d.getDate()}/${d.getMonth() + 1}`;

    data.unshift({ date: dayLabel, nilai: Math.round(runningValue) });

    // Reverse the day's transactions to get previous day's value
    const dayTxns = transactions.filter(t => t.date.slice(0, 10) === dayKey);
    dayTxns.forEach(t => {
      const product = products.find(p => p.id === t.productId);
      if (!product) return;
      if (t.type === 'in') {
        runningValue -= t.quantity * product.buyPrice;
      } else {
        runningValue += t.quantity * product.buyPrice;
      }
    });
  }

  return data;
}
