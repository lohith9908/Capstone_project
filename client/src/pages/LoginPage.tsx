import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, AlertCircle, ArrowRight, KeyRound, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Invalid authentication credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (quickEmail: string, quickPass: string) => {
    setError('');
    setEmail(quickEmail);
    setPassword(quickPass);
    setLoading(true);
    try {
      await login(quickEmail, quickPass);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Demo authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass-card p-8 rounded-2xl border border-slate-800 shadow-2xl">
        {/* Logo & Heading */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl mb-1">
            <Shield className="w-8 h-8 text-cyan-400" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Access ARES Platform</h2>
          <p className="text-xs text-slate-400">
            Sign in to manage datasets, run adversarial simulations, and generate audit reports.
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center space-x-2 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5 font-semibold">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-4 h-4 text-slate-500" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@ares.security"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5 font-semibold">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-4 h-4 text-slate-500" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-cyan-500/20 text-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Logins */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
          <div className="text-[11px] font-mono uppercase text-slate-500 text-center tracking-wider">
            One-Click Demo Credentials
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@ares.security', 'AresAdmin2026!')}
              className="px-3 py-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 rounded-lg text-left transition-colors flex items-center gap-2 group"
            >
              <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
              <div className="overflow-hidden">
                <div className="text-[11px] font-semibold text-slate-200">Admin</div>
                <div className="text-[9px] text-slate-500 font-mono truncate">AresAdmin2026!</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('analyst@ares.security', 'AresAnalyst2026!')}
              className="px-3 py-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 rounded-lg text-left transition-colors flex items-center gap-2 group"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <div className="overflow-hidden">
                <div className="text-[11px] font-semibold text-slate-200">Analyst</div>
                <div className="text-[9px] text-slate-500 font-mono truncate">AresAnalyst2026!</div>
              </div>
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center text-xs text-slate-500">
          Need a research account?{' '}
          <Link to="/register" className="text-cyan-400 hover:underline font-semibold">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
