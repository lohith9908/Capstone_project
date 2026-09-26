import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, User, LogOut, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#0a0d14]/90 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-3">
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg group-hover:border-cyan-400/60 transition-colors">
            <span aria-hidden="true" className="inline-flex shrink-0">
              <Shield className="w-5 h-5 text-cyan-400" aria-hidden="true" focusable="false" />
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold tracking-wider text-slate-100 text-lg">ARES</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Automated Robustness Evaluation System</p>
          </div>
        </Link>
      </div>

      {/* System Status Indicators */}
      <div className="hidden md:flex items-center space-x-6 text-xs text-slate-400">
        <div className="flex items-center space-x-2 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-300 font-mono">Detection Engine: Active</span>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-full">
          <span aria-hidden="true" className="inline-flex shrink-0">
            <Activity className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" focusable="false" />
          </span>
          <span className="text-slate-300 font-mono">Simulations: Deterministic</span>
        </div>
      </div>

      {/* User Actions */}
      <div className="flex items-center space-x-3">
        {user ? (
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-200">{user.name}</span>
              <span className="text-[10px] font-mono text-cyan-400 uppercase">{user.role}</span>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-lg transition-colors"
            >
              <span aria-hidden="true" className="inline-flex shrink-0">
                <LogOut className="w-4 h-4" aria-hidden="true" focusable="false" />
              </span>
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center space-x-2 text-xs font-semibold px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg transition-colors"
          >
            <span aria-hidden="true" className="inline-flex shrink-0">
              <User className="w-3.5 h-3.5" aria-hidden="true" focusable="false" />
            </span>
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </header>
  );
};
