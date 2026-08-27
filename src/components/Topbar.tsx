'use client';
import React from 'react';
import { Menu, RefreshCw, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface TopbarProps {
  title: string;
  subtitle: string;
  generatedAt?: string;
  onOpenMobileMenu: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export default function Topbar({
  title,
  subtitle,
  generatedAt,
  onOpenMobileMenu,
  onRefresh,
  isLoading,
  isSidebarCollapsed,
  onToggleSidebar,
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between transition-all">
      <div className="flex items-center gap-3.5">
        {/* Mobile toggle */}
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Sidebar Toggle */}
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="hidden lg:flex p-2 rounded-xl border border-slate-200/80 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        )}

        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight tracking-tight">{title}</h2>
          <p className="text-[11px] text-slate-500 font-medium">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all disabled:opacity-50 shadow-sm"
            title="Refresh records"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-brand-blue' : ''}`} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>
        )}

        <div className="text-right hidden sm:block">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Supabase Sync
          </span>
          {generatedAt && <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Updated {generatedAt}</p>}
        </div>
      </div>
    </header>
  );
}
