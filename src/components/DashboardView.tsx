'use client';
import React, { useState } from 'react';
import { RotateCcw, AlertTriangle, Ban, Building2, Activity, ArrowUpDown, ChevronRight } from 'lucide-react';
import { DashboardMetrics, AppUser, BaseRecord } from '@/lib/types';
import { HOSPITAL_NAME } from '@/lib/assets';

interface DashboardViewProps {
  metrics: DashboardMetrics;
  user: AppUser;
  onNavigateModule: (module: string, status?: string) => void;
}

export default function DashboardView({ metrics, user, onNavigateModule }: DashboardViewProps) {
  const [sortKey, setSortKey] = useState<string>('daysLeft');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const sortedUrgentRows = [...metrics.urgentRows].sort((a: any, b: any) => {
    let av = a[sortKey];
    let bv = b[sortKey];
    if (sortKey === 'daysLeft') {
      av = a.daysLeft ?? 99999;
      bv = b.daysLeft ?? 99999;
    }
    if (av === null || av === undefined) return 1;
    if (bv === null || bv === undefined) return -1;
    if (typeof av === 'number' && typeof bv === 'number') {
      return (av - bv) * (sortDir === 'asc' ? 1 : -1);
    }
    return String(av).localeCompare(String(bv)) * (sortDir === 'asc' ? 1 : -1);
  });

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-navy via-brand-blue to-brand-blue2 text-white p-6 sm:p-8 shadow-xl shadow-blue-900/10">
        <div className="relative z-10 max-w-2xl">
          <span className="text-[11px] font-extrabold tracking-wider uppercase text-sky-200">
            {HOSPITAL_NAME} · Live Monitor
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1 mb-2">
            Good day, {user.fullName}!
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Your live priority list is ready. Review urgent RTH compliance, Denied motions, 60-day Inpatient, and
            Hemodialysis transmission deadlines.
          </p>

          <div className="flex flex-wrap gap-2 mt-4 text-[11px] font-bold text-blue-200">
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
              ● Secure JWT Session
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
              ↻ Supabase Live Data
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
              ⚡ 60-Day Cutoff Logic
            </span>
          </div>
        </div>

        {/* Decorative Circle */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 pointer-events-none" />
      </section>

      {/* Metric Cards Grid */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <button
          onClick={() => onNavigateModule('RTH', 'PENDING')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-left group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">RTH Pending</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-colors">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 mb-1">
            {metrics.rthPending.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-400 font-medium">Awaiting compliance / refile</p>
        </button>

        <button
          onClick={() => onNavigateModule('RTH', 'CRITICAL')}
          className="bg-white p-4 rounded-2xl border border-red-200/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-left group bg-red-50/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-600">RTH Urgent</span>
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-red-600 mt-2 mb-1">
            {metrics.rthUrgent.toLocaleString()}
          </div>
          <p className="text-[10px] text-red-500/80 font-medium">Expired or ≤ 7 days</p>
        </button>

        <button
          onClick={() => onNavigateModule('DENIED', 'PENDING')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-left group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Denied Pending</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <Ban className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 mb-1">
            {metrics.deniedPending.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-400 font-medium">Awaiting MR transmission</p>
        </button>

        <button
          onClick={() => onNavigateModule('INPATIENT', 'PENDING')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-left group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Inpatient Pending</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-colors">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 mb-1">
            {metrics.inpatientPending.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-400 font-medium">Not transmitted</p>
        </button>

        <button
          onClick={() => onNavigateModule('HD', 'PENDING')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-left group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">HD Pending</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 mb-1">
            {metrics.hdPending.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-400 font-medium">Not transmitted</p>
        </button>
      </section>

      {/* Priority Deadline Queue Panel */}
      <section className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 sm:px-6 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-slate-900">Priority Deadline Queue</h3>
            <p className="text-xs text-slate-500 font-medium">
              {metrics.totalUrgent} actionable expired, critical, or warning claim(s)
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-red-600">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              Critical (≤7d)
            </span>
            <span className="flex items-center gap-1.5 text-amber-600">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Warning (≤15d)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Safe (&gt;15d)
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto max-h-[520px]">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-sm border-b border-slate-200 z-10">
              <tr>
                <th className="py-3 px-4 text-[10px] font-black tracking-wider uppercase text-slate-500">
                  <button onClick={() => toggleSort('module')} className="flex items-center gap-1">
                    Module / Reference
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-3 px-4 text-[10px] font-black tracking-wider uppercase text-slate-500">
                  <button onClick={() => toggleSort('patientName')} className="flex items-center gap-1">
                    Patient / Category
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-3 px-4 text-[10px] font-black tracking-wider uppercase text-slate-500">
                  <button onClick={() => toggleSort('baseDate')} className="flex items-center gap-1">
                    Source Date
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-3 px-4 text-[10px] font-black tracking-wider uppercase text-slate-500">
                  <button onClick={() => toggleSort('expiryDate')} className="flex items-center gap-1">
                    Compliance Expiry
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-3 px-4 text-[10px] font-black tracking-wider uppercase text-slate-500">
                  <button onClick={() => toggleSort('daysLeft')} className="flex items-center gap-1">
                    Countdown
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-3 px-4 text-[10px] font-black tracking-wider uppercase text-slate-500">Status</th>
                <th className="py-3 px-4 text-[10px] font-black tracking-wider uppercase text-slate-500 text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {sortedUrgentRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                    No urgent pending deadlines. Great job!
                  </td>
                </tr>
              ) : (
                sortedUrgentRows.map((r, i) => (
                  <tr key={r.id || i} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <span className="inline-block font-extrabold text-brand-blue mr-1.5">{r.module}</span>
                      <span className="text-[11px] font-medium text-slate-500">{r.reference}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {r.patientName || r.memberCategory}
                      {r.patientName && r.memberCategory && (
                        <span className="block text-[10px] text-slate-400 font-normal">{r.memberCategory}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{r.baseDate || '—'}</td>
                    <td className="py-3 px-4 font-medium text-slate-700">{r.expiryDate || '—'}</td>
                    <td className="py-3 px-4 font-black">
                      {r.daysLeft !== null && r.daysLeft !== undefined ? (
                        <span className={r.daysLeft <= 0 ? 'text-red-600' : r.daysLeft <= 7 ? 'text-red-500' : 'text-amber-600'}>
                          {r.daysLeft < 0 ? `${Math.abs(r.daysLeft)}d overdue` : `${r.daysLeft} day(s)`}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          r.status === 'CRITICAL'
                            ? 'bg-red-100 text-red-700'
                            : r.status === 'WARNING'
                            ? 'bg-amber-100 text-amber-800'
                            : r.status === 'EXPIRED'
                            ? 'bg-red-50 text-red-600 border border-red-200'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onNavigateModule(r.module)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-blue hover:text-navy"
                      >
                        Open <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
