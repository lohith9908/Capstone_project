import React, { useState, useEffect } from 'react';
import { interactiveApi } from '../services/api';
import { AttackType, IFeatureVector } from '../types';
import { ShieldCheck, Award, CheckCircle2, Cpu } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

const SAMPLE_MALWARE: IFeatureVector = {
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

export const DefenseStudio: React.FC = () => {
  const [attackType, setAttackType] = useState<AttackType>(AttackType.PADDING);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDefenses = async () => {
    setLoading(true);
    try {
      const res = await interactiveApi.compareDefenses(SAMPLE_MALWARE, attackType);
      setData(res);
    } catch (err) {
      console.error('Failed to load defense comparison', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDefenses();
  }, [attackType]);

  const defenses = data?.defenses || [];
  const recommendation = data?.recommendation;

  const chartData = defenses.map((d: any) => ({
    name: d.defenseType.replace('_SIMULATION', '').replace('_', ' '),
    'Clean Detection': Math.round(d.cleanDetectionRate * 100),
    'Post-Attack Detection': Math.round(d.adversarialDetectionRate * 100),
    'Robustness Score': d.robustnessScore,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <span>Simulated Defense Studio & Trade-Off Benchmarks</span>
            {loading && <span className="text-xs text-cyan-400 font-normal font-mono animate-pulse">(Benchmarking...)</span>}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Compare Adversarial Training and Monotonic Constraints against baseline static classifiers.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setAttackType(AttackType.PADDING)}
            className={`px-3.5 py-1.5 rounded-lg font-mono text-xs font-semibold ${
              attackType === AttackType.PADDING ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
            }`}
          >
            vs Padding Attack
          </button>
          <button
            onClick={() => setAttackType(AttackType.GAMMA_INSPIRED)}
            className={`px-3.5 py-1.5 rounded-lg font-mono text-xs font-semibold ${
              attackType === AttackType.GAMMA_INSPIRED ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'text-slate-400'
            }`}
          >
            vs GAMMA Attack
          </button>
        </div>
      </div>

      {/* Dynamic Recommendation Banner */}
      {recommendation && (
        <div className="p-6 rounded-xl border border-emerald-500/40 bg-emerald-500/5 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                Dynamic Defense Recommendation Engine
              </span>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Confidence: {Math.round(recommendation.confidence * 100)}%
            </span>
          </div>

          <div className="text-lg font-bold text-white">
            Recommended: {recommendation.recommendedDefense.replace(/_/g, ' ')}
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {recommendation.reasoning}
          </p>

          {/* Weaknesses Addressed */}
          <div className="pt-2 border-t border-emerald-500/20">
            <span className="text-[11px] font-mono text-slate-400 block mb-1">Observed Attack Weaknesses Addressed:</span>
            <ul className="space-y-1">
              {recommendation.observedWeaknesses.map((w: string, idx: number) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Comparison Chart */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <h2 className="text-sm font-semibold text-white mb-4 font-mono">
          Side-by-Side Performance Comparison
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                formatter={(val: any) => [`${val}%`, '']}
              />
              <Legend />
              <Bar dataKey="Clean Detection" fill="#64748b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Post-Attack Detection" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Robustness Score" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Defense Matrix Table */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <h2 className="text-sm font-semibold text-white mb-4 font-mono">
          Defense Strategy Comparison Matrix
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3">Defense Mitigation</th>
                <th className="py-3 px-3">Clean Retention</th>
                <th className="py-3 px-3">Post-Attack Retention</th>
                <th className="py-3 px-3">Evasion Rate</th>
                <th className="py-3 px-3">Robustness Score</th>
                <th className="py-3 px-3">Overhead</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {defenses.map((d: any) => (
                <tr key={d.defenseType} className="hover:bg-slate-800/30">
                  <td className="py-3 px-3 font-semibold text-slate-200">
                    {d.defenseType.replace(/_/g, ' ')}
                  </td>
                  <td className="py-3 px-3 text-slate-400">{Math.round(d.cleanDetectionRate * 100)}%</td>
                  <td className="py-3 px-3 text-cyan-400 font-bold">{Math.round(d.adversarialDetectionRate * 100)}%</td>
                  <td className="py-3 px-3 text-red-400 font-bold">{Math.round(d.attackSuccessRate * 100)}%</td>
                  <td className="py-3 px-3 font-bold text-emerald-400">{d.robustnessScore}/100</td>
                  <td className="py-3 px-3 text-slate-400 flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5 text-slate-500" />
                    <span>{d.estimatedCost || 1}/10</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
