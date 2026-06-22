'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface StockTrendChartProps {
  data: { date: string; masuk: number; keluar: number }[];
}

export function StockTrendChart({ data }: StockTrendChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2a4a" />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            dy={10}
            minTickGap={30}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#16213e', 
              borderColor: '#2a2a4a',
              borderRadius: '8px',
              color: '#e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
            }}
            itemStyle={{ color: '#e2e8f0', fontSize: '13px' }}
            labelStyle={{ color: '#94a3b8', marginBottom: '4px', fontSize: '12px' }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '10px', fontSize: '13px' }}
            iconType="circle"
            iconSize={8}
          />
          <Line 
            name="Stok Masuk"
            type="monotone" 
            dataKey="masuk" 
            stroke="#22c55e" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0, fill: '#22c55e' }}
          />
          <Line 
            name="Stok Keluar"
            type="monotone" 
            dataKey="keluar" 
            stroke="#ef4444" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0, fill: '#ef4444' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
