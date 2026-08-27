'use client';
import React from 'react';
import { Menu, RefreshCw } from 'lucide-react';

interface TopbarProps {
  title: string;
  subtitle: string;
  generatedAt?: string;
  onOpenMobileMenu: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export default function Topbar({
  title,
  subtitle,
  generatedAt,
  onOpenMobileMenu,
  onRefresh,
  isLoading,
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight tracking-tight">{title}</h2>
          <p className="text-[11px] text-slate-500 font-medium">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
            title="Refresh records"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-brand-blue' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        )}
        <div className="text-right hidden sm:block">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Supabase Sync
          </span>
          {generatedAt && <p className="text-[10px] text-slate-400 mt-0.5">Updated {generatedAt}</p>}
        </div>
      </div>
    </header>
  );
}
