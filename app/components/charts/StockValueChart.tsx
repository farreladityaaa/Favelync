'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '@/app/lib/utils';

interface StockValueChartProps {
  data: { date: string; nilai: number }[];
}

export function StockValueChart({ data }: StockValueChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorNilai" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
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
            tickFormatter={(value) => `Rp ${value / 1000000}M`}
            width={80}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#16213e', 
              borderColor: '#2a2a4a',
              borderRadius: '8px',
              color: '#e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
            }}
            formatter={(value: number) => [formatCurrency(value), 'Total Nilai']}
            labelStyle={{ color: '#94a3b8', marginBottom: '4px', fontSize: '12px' }}
          />
          <Area 
            type="monotone" 
            dataKey="nilai" 
            stroke="#3b82f6" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorNilai)" 
            activeDot={{ r: 4, strokeWidth: 0, fill: '#3b82f6' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
