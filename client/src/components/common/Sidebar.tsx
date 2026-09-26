import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Database,
  Search,
  FileCheck2,
  Zap,
  ShieldAlert,
  BrainCircuit,
  ShieldCheck,
  Layers,
  Award,
  FileSpreadsheet,
  Settings,
} from 'lucide-react';

const NAV_SECTIONS = [
  {
    title: 'Overview',
    items: [{ name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }],
  },
  {
    title: 'Analysis',
    items: [
      { name: 'Dataset Studio', path: '/dataset', icon: Database },
      { name: 'Detection Studio', path: '/detection', icon: Search },
      { name: 'Clean Evaluation', path: '/evaluation', icon: FileCheck2 },
    ],
  },
  {
    title: 'Adversarial',
    items: [{ name: 'Attack Simulation', path: '/attacks', icon: Zap }],
  },
  {
    title: 'Robustness',
    items: [
      { name: 'Robustness Studio', path: '/robustness', icon: ShieldAlert },
      { name: 'Explainability', path: '/explainability', icon: BrainCircuit },
    ],
  },
  {
    title: 'Defense',
    items: [{ name: 'Defense Studio', path: '/defenses', icon: ShieldCheck }],
  },
  {
    title: 'Management',
    items: [
      { name: 'Experiments', path: '/experiments', icon: Layers },
      { name: 'Recommendations', path: '/recommendations', icon: Award },
      { name: 'Security Reports', path: '/reports', icon: FileSpreadsheet },
    ],
  },
  {
    title: 'System',
    items: [{ name: 'Settings', path: '/settings', icon: Settings }],
  },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-[#0a0d14]/95 border-r border-slate-800/80 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between overflow-y-auto max-h-[calc(100vh-4rem)]">
      <div className="space-y-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="px-3 pb-1 text-[10px] font-mono tracking-wider uppercase text-slate-500 font-semibold">
              {section.title}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* Safety Notice Footer */}
      <div className="mt-4 p-3 bg-slate-900/40 border border-slate-800/60 rounded-lg text-[11px] text-slate-400 space-y-1">
        <div className="font-semibold text-slate-300 flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          <span>Safety Notice</span>
        </div>
        <p className="leading-relaxed text-[10px]">
          Evaluations strictly modify synthetic feature vectors. No executable binaries are executed.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
