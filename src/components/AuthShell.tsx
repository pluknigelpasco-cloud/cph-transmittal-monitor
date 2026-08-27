'use client';
import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Lock, User, MapPin, ExternalLink, Navigation } from 'lucide-react';
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
      <div className="hidden lg:flex lg:col-span-7 bg-gradient-to-br from-navy via-navy to-brand-blue text-white p-10 xl:p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Ambient Circles */}
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full border-[60px] border-white/5 pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full border-[50px] border-white/5 pointer-events-none" />

        {/* Brand Header */}
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center p-0.5 shadow-xl overflow-hidden shrink-0 ring-2 ring-white/30">
            <img src="/cebu_seal.png" alt="Province of Cebu Seal" className="w-full h-full object-contain" />
          </div>
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center p-0.5 shadow-xl overflow-hidden shrink-0 ring-2 ring-white/30">
            <img src="/cph_logo.png" alt="Hospital Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight">{HOSPITAL_NAME}</h2>
            <p className="text-xs text-blue-200 font-medium">{SECTION_NAME} · Province of Cebu</p>
          </div>
        </div>

        {/* Hero Copy & Map Card */}
        <div className="max-w-xl relative z-10 my-4 space-y-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-blue-200 text-[11px] font-bold tracking-wider uppercase mb-3 backdrop-blur-sm border border-white/10">
              Claims & Compliance Monitor
            </span>
            <h1 className="text-3xl xl:text-4xl font-black tracking-tight leading-[1.15] mb-3">
              Claims deadlines, <br />
              <span className="text-sky-300">clear and controlled.</span>
            </h1>
            <p className="text-xs text-blue-100/90 leading-relaxed max-w-lg font-medium">
              Automated tracking for PhilHealth RTH compliance, denied motions for reconsideration,
              60-day inpatient transmittals, and hemodialysis encounters.
            </p>
          </div>

          {/* Interactive Hospital Map Card */}
          <div className="rounded-2xl overflow-hidden border border-white/20 bg-white/10 backdrop-blur-md shadow-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="text-xs font-bold text-white">Aliwanay, Balamban, Cebu</span>
              </div>
              <a
                href="https://maps.app.goo.gl/LMRU9CCkq1fSjJw8A"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-[10px] font-bold text-white transition-all flex items-center gap-1 cursor-pointer"
              >
                <Navigation className="w-3 h-3" />
                Open Google Maps
                <ExternalLink className="w-2.5 h-2.5 opacity-70" />
              </a>
            </div>

            {/* Embedded Google Map iframe */}
            <div className="w-full h-36 rounded-xl overflow-hidden border border-white/10 shadow-inner">
              <iframe
                title="Cebu Provincial Hospital - Balamban Map"
                src="https://maps.google.com/maps?q=Cebu+Provincial+Hospital+-+Balamban,+Balamban,+Cebu&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-blue-300 relative z-10 flex items-center justify-between border-t border-white/10 pt-4">
          <span>Cebu Provincial Hospital - Balamban</span>
          <span className="font-semibold text-[11px] text-blue-200">PhilHealth Claims Section</span>
        </div>
      </div>

      {/* Login Form Panel (Right 5 Cols) */}
      <div className="lg:col-span-5 flex items-center justify-center p-6 sm:p-12 bg-gradient-to-b from-white to-blue-50/40">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
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
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 bg-slate-50/50 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all placeholder:text-slate-400"
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
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-300 bg-slate-50/50 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all placeholder:text-slate-400"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-brand-blue hover:bg-navy text-white text-xs font-black shadow-lg shadow-brand-blue/25 hover:shadow-xl hover:shadow-brand-blue/30 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          {/* Mobile Map link */}
          <div className="lg:hidden mt-6 pt-4 border-t border-slate-100 text-center">
            <a
              href="https://maps.app.goo.gl/LMRU9CCkq1fSjJw8A"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-blue hover:underline"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              Cebu Provincial Hospital - Balamban on Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
