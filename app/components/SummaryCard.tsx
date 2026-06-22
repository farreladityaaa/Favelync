'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { CountUp } from './ui/CountUp';
import { cn } from '@/app/lib/utils';

interface SummaryCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  prefix?: string;
  suffix?: string;
  trend?: number;
  trendLabel?: string;
  className?: string;
  iconClassName?: string;
}

export function SummaryCard({
  title,
  value,
  icon: Icon,
  prefix = '',
  suffix = '',
  trend,
  trendLabel,
  className,
  iconClassName,
  decimals,
}: SummaryCardProps & { decimals?: number }) {
  return (
    <div className={cn("summary-card", className)}>
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#1e2a4a] border border-[#2a2a4a]",
          iconClassName
        )}>
          <Icon size={22} />
        </div>
        
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-[#94a3b8] leading-tight mb-1 truncate">{title}</p>
          <h3 className="text-xl font-bold text-white mono leading-tight">
            <CountUp end={value} prefix={prefix} suffix={suffix} decimals={decimals} />
          </h3>
          
          {trend !== undefined && (
            <div className="flex items-center gap-2 mt-1.5">
              <span className={cn(
                "text-[10px] font-medium px-1.5 py-0.5 rounded flex items-center",
                trend > 0 ? "text-[#22c55e] bg-[rgba(34,197,94,0.1)]" : 
                trend < 0 ? "text-[#ef4444] bg-[rgba(239,68,68,0.1)]" : 
                "text-[#94a3b8] bg-[rgba(148,163,184,0.1)]"
              )}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
              {trendLabel && <span className="text-[10px] text-[#64748b]">{trendLabel}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
