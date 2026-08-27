'use client';
import React from 'react';
import { LayoutGrid, Upload, RotateCcw, Ban, Building2, Activity, History, Settings, LogOut, Shield } from 'lucide-react';
import { AppUser } from '@/lib/types';
import { HOSPITAL_NAME } from '@/lib/assets';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  user: AppUser | null;
  onLogout: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const NAV_ITEMS = [
  { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutGrid },
  { id: 'UPLOAD', label: 'Upload Notice PDF', icon: Upload },
  { id: 'RTH', label: 'RTH Notice', icon: RotateCcw },
  { id: 'DENIED', label: 'Denied Notice', icon: Ban },
  { id: 'INPATIENT', label: '60 Days Inpatient', icon: Building2 },
  { id: 'HD', label: '60 Days Hemodialysis', icon: Activity },
  { id: 'ACTIVITY', label: 'Activity Log', icon: History },
  { id: 'ACCOUNT', label: 'Account Settings', icon: Settings },
];

export default function Sidebar({
  currentView,
  onNavigate,
  user,
  onLogout,
  isOpenMobile,
  onCloseMobile,
}: SidebarProps) {
  return (
    <>
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-gradient-to-b from-navy to-navy-dark text-white p-4 flex flex-col justify-between z-50 transition-transform duration-200 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Header Brand */}
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-0.5 shadow-md shrink-0 overflow-hidden">
              <img src="/logo.png" alt="Hospital Logo" className="w-full h-full logo-circle" />
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-sm leading-tight truncate">Transmittal Monitor</h1>
              <p className="text-[10px] text-blue-200 truncate">{HOSPITAL_NAME}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-4 space-y-1">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-colors text-left ${
                    active
                      ? 'bg-white text-navy shadow-md font-bold'
                      : 'text-blue-100/90 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-brand-blue' : 'text-blue-300'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card */}
        {user && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue to-emerald-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold leading-tight truncate text-white">{user.fullName}</p>
                <p className="text-[10px] text-blue-200 truncate">
                  {user.role} · @{user.username}
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="mt-2.5 w-full flex items-center justify-center gap-1.5 py-1 text-[11px] font-semibold text-red-200 hover:text-red-100 hover:bg-white/5 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
