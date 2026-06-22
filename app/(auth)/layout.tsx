import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4 sm:p-8 bg-[radial-gradient(ellipse_at_top_left,rgba(245,158,11,0.08)_0%,transparent_40%),radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.08)_0%,transparent_40%)]">
      {children}
    </div>
  );
}
