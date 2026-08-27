'use client';
import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Lock, User, Hospital } from 'lucide-react';
import { HOSPITAL_NAME, SECTION_NAME } from '@/lib/assets';
import { AppUser } from '@/lib/types';

interface AuthShellProps {
  onLoginSuccess: (token: string, user: AppUser) => void;
}

export default function AuthShell({ onLoginSuccess }: AuthShellProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Failed to sign in.');
      }

      onLoginSuccess(data.token, data.user);
    } catch (err: any) {
      setError(err?.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-white selection:bg-brand-blue selection:text-white">
      {/* Brand Hero Panel (Left 7 Cols on desktop) */}
      <div className="hidden lg:flex lg:col-span-7 bg-gradient-to-br from-navy-dark via-navy to-brand-blue text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Ambient Circles */}
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full border-[60px] border-white/5 pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full border-[50px] border-white/5 pointer-events-none" />

        {/* Brand Header */}
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center p-1 shadow-xl overflow-hidden shrink-0">
            <img src="/logo.png" alt="Hospital Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight">{HOSPITAL_NAME}</h2>
            <p className="text-xs text-blue-200 font-medium">{SECTION_NAME} · Province of Cebu</p>
          </div>
        </div>

        {/* Hero Copy */}
        <div className="max-w-lg relative z-10">
          <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-blue-200 text-[11px] font-bold tracking-wider uppercase mb-4 backdrop-blur-sm border border-white/10">
            Claims & Compliance Monitor
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.1] mb-5">
            Claims deadlines, <br />
            <span className="text-sky-300">clear and controlled.</span>
          </h1>
          <p className="text-sm text-blue-100/90 leading-relaxed">
            Automated tracking and countdowns for PhilHealth RTH compliance, denied motions for reconsideration,
            inpatient transmittals, and hemodialysis encounters.
          </p>

          <div className="flex flex-wrap gap-2.5 mt-8">
            <span className="px-3 py-1.5 rounded-full border border-white/20 bg-white/10 text-xs font-bold backdrop-blur-md">
              ⏱ 60-Day Deadlines
            </span>
            <span className="px-3 py-1.5 rounded-full border border-white/20 bg-white/10 text-xs font-bold backdrop-blur-md">
              📄 PDF Notice Extraction
            </span>
            <span className="px-3 py-1.5 rounded-full border border-white/20 bg-white/10 text-xs font-bold backdrop-blur-md">
              ⚡ Supabase & Vercel
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-blue-300 relative z-10">
          Cebu Provincial Hospital - Balamban · PhilHealth Claims Section
        </div>
      </div>

      {/* Login Form Panel (Right 5 Cols) */}
      <div className="lg:col-span-5 flex items-center justify-center p-6 sm:p-12 bg-gradient-to-b from-white to-blue-50/40">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Welcome back</h2>
              <p className="text-xs text-slate-500 font-medium">Sign in to your Transmittal Monitor account</p>
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold leading-relaxed animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full px-3.5 py-2.5 pl-10 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all placeholder:text-slate-400"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3.5 py-2.5 pl-10 pr-12 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all placeholder:text-slate-400"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2 px-2 py-1 text-xs font-bold text-brand-blue hover:text-navy rounded-md"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-blue to-brand-blue2 hover:from-navy hover:to-navy shadow-lg shadow-brand-blue/25 transition-all disabled:opacity-60 cursor-pointer mt-2"
            >
              {loading ? 'Signing in securely…' : 'Sign in securely'}
            </button>
          </form>

          <div className="mt-6 p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2.5 text-[11px] text-slate-600 leading-relaxed">
            <span className="text-base leading-none">🔒</span>
            <span>Five failed login attempts temporarily lock the account. Contact administrator for reset.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
