import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  variant?: 'cyan' | 'emerald' | 'amber' | 'red';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'cyan',
}) => {
  const variantStyles = {
    cyan: 'border-cyan-500/20 text-cyan-400 bg-cyan-500/5 hover:border-cyan-500/40',
    emerald: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5 hover:border-emerald-500/40',
    amber: 'border-amber-500/20 text-amber-400 bg-amber-500/5 hover:border-amber-500/40',
    red: 'border-red-500/20 text-red-400 bg-red-500/5 hover:border-red-500/40',
  };

  return (
    <div className={`p-5 rounded-xl border bg-slate-900/60 backdrop-blur-md transition-all duration-200 ${variantStyles[variant]}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">{title}</span>
        <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-slate-100">{value}</div>
        {trend && <span className="text-xs font-mono text-slate-400">{trend}</span>}
      </div>
      {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
    </div>
  );
};
