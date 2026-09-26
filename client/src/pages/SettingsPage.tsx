import React from 'react';
import { Settings, Shield, Server, Cpu, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-cyan-400" />
          <span>Platform Settings & System Diagnostics</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Review environment parameters, database connectivity, deterministic thresholds, and security controls.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Environment & API Specs */}
        <div className="glass-card rounded-xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Server className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
              Runtime Architecture & Diagnostics
            </h2>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
              <span className="text-slate-400">Node Environment</span>
              <span className="text-cyan-400 font-semibold">development</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
              <span className="text-slate-400">REST API Gateway</span>
              <span className="text-emerald-400 font-semibold">http://localhost:5000</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
              <span className="text-slate-400">Client Host</span>
              <span className="text-emerald-400 font-semibold">http://localhost:5173</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
              <span className="text-slate-400">Database Driver</span>
              <span className="text-slate-200">MongoDB + Mongoose 8.3</span>
            </div>
          </div>
        </div>

        {/* Security Controls */}
        <div className="glass-card rounded-xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
              Security & Defense Controls
            </h2>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
              <span className="text-slate-400">HTTP Security Headers</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Helmet Enabled</span>
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
              <span className="text-slate-400">Rate Limiter</span>
              <span className="text-emerald-400 font-semibold">500 req / 15 min</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
              <span className="text-slate-400">Authentication</span>
              <span className="text-slate-200">JWT + bcrypt (10 rounds)</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
              <span className="text-slate-400">Input Validation</span>
              <span className="text-slate-200">Strict Zod Schemas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Deterministic Simulation Parameters */}
      <div className="glass-card rounded-xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Cpu className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
            Deterministic Engine Parameters & Thresholds
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800">
            <div className="text-slate-400">Malware Classification Threshold</div>
            <div className="text-lg font-bold text-white mt-1">Score ≥ 50.0</div>
            <div className="text-[10px] text-slate-500 mt-1">Scores &lt; 50 classified as BENIGN</div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800">
            <div className="text-slate-400">Robustness Tiering Tiers</div>
            <div className="text-lg font-bold text-cyan-400 mt-1">0-59 | 60-79 | 80-100</div>
            <div className="text-[10px] text-slate-500 mt-1">LOW / MEDIUM / HIGH</div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800">
            <div className="text-slate-400">Feature Weights</div>
            <div className="text-lg font-bold text-emerald-400 mt-1">15 Deterministic Signals</div>
            <div className="text-[10px] text-slate-500 mt-1">Entropy, APIs, UPX, Code/Data Ratio</div>
          </div>
        </div>
      </div>

      {/* Academic Transparency Notice */}
      <div className="p-5 rounded-xl border border-cyan-500/30 bg-cyan-500/5 space-y-2">
        <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs font-mono uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4" />
          <span>Academic & Research Demonstration Disclosure</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          ARES is built exclusively for research and academic validation of static malware detection mechanisms against feature-level adversarial attacks. The platform operates exclusively on numeric feature vectors and synthetic benchmark data. No executable binaries are ever executed or modified.
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;
