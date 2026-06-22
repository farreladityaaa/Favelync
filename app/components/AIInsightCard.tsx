'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { AIInsight } from '@/app/lib/types';
import { cn } from '@/app/lib/utils';

interface AIInsightCardProps {
  insight: AIInsight;
  onDismiss?: (id: string) => void;
}

export function AIInsightCard({ insight, onDismiss }: AIInsightCardProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onDismiss) onDismiss(insight.id);
    }, 300);
  };

  if (!isVisible && !onDismiss) return null;

  const severityStyles = {
    info: 'border-[rgba(59,130,246,0.3)] bg-[rgba(59,130,246,0.05)] text-[#3b82f6]',
    warning: 'border-[rgba(245,158,11,0.3)] bg-[rgba(245,158,11,0.05)] text-[#f59e0b]',
    danger: 'border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.05)] text-[#ef4444]',
    success: 'border-[rgba(34,197,94,0.3)] bg-[rgba(34,197,94,0.05)] text-[#22c55e]',
  };

  return (
    <div className={cn(
      "relative p-4 rounded-xl border flex gap-4 transition-all duration-300",
      severityStyles[insight.severity],
      isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
    )}>
      <div className="flex-shrink-0 text-2xl pt-0.5">
        {insight.icon}
      </div>
      
      <div className="flex-1 pr-6">
        <div className="flex justify-between items-start mb-1">
          <h4 className="font-semibold text-white text-sm">
            {insight.title}
            <span className="ml-2 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-white/10 text-white/80">
              AI Insight
            </span>
          </h4>
        </div>
        <p className="text-sm text-[#cbd5e1] leading-relaxed">
          {insight.description}
        </p>
      </div>

      <button 
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-[#94a3b8] hover:text-white transition-colors"
        aria-label="Dismiss insight"
      >
        <X size={16} />
      </button>
    </div>
  );
}
