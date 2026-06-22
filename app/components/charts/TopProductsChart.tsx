'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface TopProductsChartProps {
  data: { name: string; jumlah: number }[];
}

export function TopProductsChart({ data }: TopProductsChartProps) {
  // Colors gradient from amber to lighter amber
  const colors = ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a', '#fef3c7'];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#2a2a4a" />
          <XAxis 
            type="number"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <YAxis 
            dataKey="name" 
            type="category"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#e2e8f0', fontSize: 12 }}
            width={120}
            tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
          />
          <Tooltip 
            cursor={{ fill: '#1e2a4a' }}
            contentStyle={{ 
              backgroundColor: '#16213e', 
              borderColor: '#2a2a4a',
              borderRadius: '8px',
              color: '#e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
            }}
            formatter={(value: number) => [`${value} unit`, 'Terjual']}
            labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
          />
          <Bar dataKey="jumlah" radius={[0, 4, 4, 0]} barSize={24}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
