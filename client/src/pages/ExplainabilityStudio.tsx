import React, { useState, useEffect } from 'react';
import { interactiveApi } from '../services/api';
import { IFeatureVector } from '../types';
import { BrainCircuit, AlertTriangle } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';

const SAMPLE_CLEAN: IFeatureVector = {
  fileSize: 450000,
  entropy: 7.45,
  sectionCount: 5,
  importCount: 8,
  exportCount: 0,
  resourceCount: 2,
  stringCount: 65,
  apiCount: 16,
  headerSize: 1024,
  codeSize: 130000,
  dataSize: 310000,
  imageCount: 0,
  certificatePresent: 0,
  suspiciousApiCount: 4,
  packedIndicator: 1,
};

const SAMPLE_PERTURBED: IFeatureVector = {
  fileSize: 6800000, // +6.3MB padding
  entropy: 5.25,     // diluted entropy
  sectionCount: 5,
  importCount: 8,
  exportCount: 0,
  resourceCount: 2,
  stringCount: 65,
  apiCount: 16,
  headerSize: 1024,
  codeSize: 130000,
  dataSize: 2200000,
  imageCount: 0,
  certificatePresent: 0,
  suspiciousApiCount: 4,
  packedIndicator: 1,
};

export const ExplainabilityStudio: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const res = await interactiveApi.explainInstability(SAMPLE_CLEAN, SAMPLE_PERTURBED);
      setData(res);
    } catch (err) {
      console.error('Failed to load explainability analysis', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const chartData = (data?.unstableFeatures || []).map((f: any) => ({
    name: f.featureName,
    shift: f.contributionShift,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <BrainCircuit className="w-6 h-6 text-cyan-400" />
            <span>Explainability & Feature Contribution Studio</span>
            {loading && <span className="text-xs text-cyan-400 font-normal font-mono animate-pulse">(Analyzing...)</span>}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Deterministic rule-based attribution analysis. Uncover which feature shifts caused evasion blind spots.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
          Academic Transparency: Deterministic Linear Attribution (Non-SHAP)
        </div>
      </div>

      {/* Primary Driver Banner */}
      {data && (
        <div className="p-5 rounded-xl border border-cyan-500/30 bg-cyan-500/5 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                Primary Adversarial Evasion Driver
              </div>
              <div className="text-base font-bold text-white mt-0.5">
                {data.primaryEvasionDriver}
              </div>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400">Confidence Attribution: High</span>
        </div>
      )}

      {/* Waterfall Shift Chart */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <h2 className="text-sm font-semibold text-white mb-4 font-mono">
          Feature Contribution Score Shifts (Clean vs Adversarial)
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} angle={-25} textAnchor="end" />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                formatter={(val: any) => [`${val} points`, 'Contribution Shift']}
              />
              <Bar dataKey="shift" radius={[4, 4, 0, 0]}>
                {chartData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.shift > 0 ? '#ef4444' : '#10b981'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Unstable Features Detailed Table */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <h2 className="text-sm font-semibold text-white mb-4 font-mono">
          Feature Instability Breakdown & Vulnerability Diagnoses
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3">Feature</th>
                <th className="py-3 px-3">Clean Contrib</th>
                <th className="py-3 px-3">Adversarial Contrib</th>
                <th className="py-3 px-3">Shift (Pts)</th>
                <th className="py-3 px-3">Security Diagnosis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {(data?.unstableFeatures || []).map((f: any) => (
                <tr key={f.featureName} className="hover:bg-slate-800/30">
                  <td className="py-3 px-3 font-semibold text-slate-200">{f.featureName}</td>
                  <td className="py-3 px-3">{f.cleanContribution} pts</td>
                  <td className="py-3 px-3">{f.adversarialContribution} pts</td>
                  <td className="py-3 px-3 font-bold text-red-400">
                    {f.contributionShift > 0 ? `-${f.contributionShift}` : `+${Math.abs(f.contributionShift)}`}
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-400">{f.vulnerabilityReason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
