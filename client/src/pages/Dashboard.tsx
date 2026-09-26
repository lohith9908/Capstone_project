import React, { useEffect, useState } from 'react';
import { dashboardApi, interactiveApi } from '../services/api';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import {
  Database,
  FileCheck2,
  ShieldAlert,
  Zap,
  ArrowUpRight,
  ArrowRight,
  RefreshCw,
  Play,
  Sparkles,
  CheckCircle2,
  X,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Complete Demo Modal state
  const [demoRunning, setDemoRunning] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoStage, setDemoStage] = useState(0);
  const [demoResult, setDemoResult] = useState<any>(null);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardApi.getMetrics();
      setData(res);
    } catch (err: any) {
      console.error('Failed to load dashboard metrics', err);
      setError(err?.response?.data?.error?.message || err?.message || 'Failed to connect to backend telemetry service.');
    } finally {
      setLoading(false);
    }
  };

  const runCompleteDemo = async () => {
    setDemoModalOpen(true);
    setDemoRunning(true);
    setDemoStage(1);
    try {
      const res = await interactiveApi.runDemo();
      setDemoResult(res);
      setDemoStage(9);
      await fetchMetrics();
    } catch (err) {
      console.error('Demo execution failed', err);
      setDemoStage(-1);
    } finally {
      setDemoRunning(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-3">
          <span aria-hidden="true" className="inline-flex shrink-0">
            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" aria-hidden="true" focusable="false" />
          </span>
          <span className="text-sm font-mono text-slate-400">Loading Database-Backed Security Metrics...</span>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="p-8 rounded-2xl border border-red-500/30 bg-red-500/10 text-center space-y-4 max-w-md">
          <span aria-hidden="true" className="inline-flex p-3 rounded-xl bg-red-500/20 text-red-400">
            <ShieldAlert className="w-8 h-8" aria-hidden="true" focusable="false" />
          </span>
          <h2 className="text-base font-bold text-white font-mono">Telemetry Service Unavailable</h2>
          <p className="text-xs text-red-300 font-mono">{error}</p>
          <button
            onClick={fetchMetrics}
            className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white rounded-lg text-xs font-mono font-bold transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const summary = data?.summary || {};
  const defenseDist = data?.defenseDistribution || {};

  const defenseChartData = [
    { name: 'Monotonic Constraints', count: defenseDist['MONOTONIC_CONSTRAINT_SIMULATION'] || 0, color: '#06b6d4' },
    { name: 'Adversarial Training', count: defenseDist['ADVERSARIAL_TRAINING_SIMULATION'] || 0, color: '#10b981' },
  ];

  const attackChartData = [
    { name: 'Padding Attacks', successful: data?.attackStats?.successfulPaddingAttacks || 0 },
    { name: 'GAMMA Attacks', successful: data?.attackStats?.successfulGammaAttacks || 0 },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            Security Posture & Robustness Overview
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Deterministic robustness benchmarks across static malware-detection feature vectors.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchMetrics}
            className="p-2.5 text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 rounded-lg transition-colors flex items-center justify-center"
            title="Refresh Metrics"
          >
            <span aria-hidden="true" className="inline-flex shrink-0">
              <RefreshCw className="w-4 h-4" aria-hidden="true" focusable="false" />
            </span>
          </button>
          <button
            onClick={runCompleteDemo}
            className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-slate-950 rounded-lg shadow-lg shadow-emerald-500/20 transition-all font-mono"
          >
            <span aria-hidden="true" className="inline-flex shrink-0">
              <Sparkles className="w-4 h-4 fill-current" aria-hidden="true" focusable="false" />
            </span>
            <span>Run Complete ARES Demo</span>
          </button>
          <Link
            to="/attacks"
            className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg transition-all"
          >
            <span aria-hidden="true" className="inline-flex shrink-0">
              <Play className="w-3.5 h-3.5 fill-current text-cyan-400" aria-hidden="true" focusable="false" />
            </span>
            <span>Attack Studio</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Robustness Score"
          value={`${summary.averageRobustnessScore || 0}/100`}
          subtitle="Multi-factor evaluation metric"
          icon={ShieldAlert}
          variant={summary.averageRobustnessScore >= 70 ? 'emerald' : summary.averageRobustnessScore >= 50 ? 'amber' : 'red'}
        />
        <StatCard
          title="Detection Retention"
          value={`${summary.averageDetectionRetention || 0}%`}
          subtitle="Post-attack malware capture"
          icon={FileCheck2}
          variant="cyan"
        />
        <StatCard
          title="Attack Evasion Rate"
          value={`${summary.averageAttackSuccessRate || 0}%`}
          subtitle="Adversarial evasion rate"
          icon={Zap}
          variant="red"
        />
        <StatCard
          title="Benchmarked Samples"
          value={summary.totalSamples || 0}
          subtitle={`Across ${summary.totalDatasets || 0} datasets`}
          icon={Database}
          variant="cyan"
        />
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attack Resilience Breakdown */}
        <div className="lg:col-span-2 p-6 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-white">Adversarial Evasion Breakdown</h2>
              <p className="text-xs text-slate-400 mt-0.5">Successful evasion counts categorized by attack technique</p>
            </div>
            <Link to="/robustness" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono">
              <span>View Curves</span>
              <span aria-hidden="true" className="inline-flex shrink-0">
                <ArrowUpRight className="w-3 h-3" aria-hidden="true" focusable="false" />
              </span>
            </Link>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attackChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  cursor={{ fill: '#1e293b', opacity: 0.4 }}
                />
                <Bar dataKey="successful" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Defense Allocation Distribution */}
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-semibold text-white">Defense Allocation</h2>
              <Link to="/defenses" className="text-xs text-cyan-400 hover:text-cyan-300 font-mono">
                Explore
              </Link>
            </div>
            <p className="text-xs text-slate-400 mb-6">Optimal defense recommendations dynamically generated</p>
          </div>

          <div className="h-48 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={defenseChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {defenseChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 mt-2">
            {defenseChartData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="font-mono text-slate-400 font-semibold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Experiments Table */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-white">Recent Evaluation Runs</h2>
            <p className="text-xs text-slate-400 mt-0.5">Automated benchmark experiments saved to MongoDB</p>
          </div>
          <Link to="/reports" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono">
            <span>View All Reports</span>
            <span aria-hidden="true" className="inline-flex shrink-0">
              <ArrowUpRight className="w-3 h-3" aria-hidden="true" focusable="false" />
            </span>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-slate-400 uppercase font-mono tracking-wider">
              <tr>
                <th className="py-3 px-4">Experiment</th>
                <th className="py-3 px-4">Dataset</th>
                <th className="py-3 px-4">Attack Mode</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Robustness</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {data?.recentExperiments?.length > 0 ? (
                data.recentExperiments.map((exp: any) => (
                  <tr key={exp._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-sans font-medium text-slate-200">{exp.name}</td>
                    <td className="py-3 px-4 text-slate-400">{exp.datasetId?.name || 'Static PE'}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                        {exp.attackType}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge label={exp.status} variant={exp.status === 'COMPLETED' ? 'success' : 'warning'} size="sm" />
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-100">
                      {exp.robustnessScore !== undefined ? `${exp.robustnessScore}/100` : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/reports?experimentId=${exp._id}`}
                        className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 hover:underline font-mono text-xs"
                      >
                        <span>Inspect</span>
                        <span aria-hidden="true" className="inline-flex shrink-0">
                          <ArrowUpRight className="w-3 h-3" aria-hidden="true" focusable="false" />
                        </span>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-500 font-sans">
                    No experiment records found in MongoDB. Launch a benchmark to generate audit history.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complete ARES Demo Pipeline Modal */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xl w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
                  <span aria-hidden="true" className="inline-flex shrink-0">
                    <Sparkles className="w-5 h-5" aria-hidden="true" focusable="false" />
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Full ARES Demonstration Pipeline</h3>
                  <p className="text-[11px] text-slate-400 font-mono">End-to-end execution of all 10 analytical phases</p>
                </div>
              </div>
              {!demoRunning && (
                <button
                  onClick={() => setDemoModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
                >
                  <span aria-hidden="true" className="inline-flex shrink-0">
                    <X className="w-4 h-4" aria-hidden="true" focusable="false" />
                  </span>
                </button>
              )}
            </div>

            {/* Stage Progress List */}
            <div className="space-y-2.5 font-mono text-xs">
              {[
                '1. Synthetic PE Benchmark Dataset loaded',
                '2. Clean baseline classifier evaluation executed',
                '3. Feature-level Padding simulation executed',
                '4. GAMMA-inspired feature transformation simulated',
                '5. Multi-factor robustness scores evaluated',
                '6. Hardening defenses (Adversarial Training & Monotonic) evaluated',
                '7. Linear feature contribution instability analyzed',
                '8. Dynamic multi-criteria defense recommendation derived',
                '9. Formal cybersecurity audit report compiled and stored in MongoDB',
              ].map((stageLabel, idx) => {
                const stageNum = idx + 1;
                const isDone = demoStage >= stageNum || demoStage === 9;
                const isCurrent = demoRunning && demoStage === stageNum;

                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                      isDone
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : isCurrent
                        ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300 animate-pulse'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-500'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {isDone ? (
                        <span aria-hidden="true" className="inline-flex shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" focusable="false" />
                        </span>
                      ) : isCurrent ? (
                        <span aria-hidden="true" className="inline-flex shrink-0">
                          <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin shrink-0" aria-hidden="true" focusable="false" />
                        </span>
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-slate-700 inline-block shrink-0" />
                      )}
                      <span>{stageLabel}</span>
                    </span>
                    <span className="text-[10px] uppercase font-bold">
                      {isDone ? 'COMPLETE' : isCurrent ? 'RUNNING' : 'PENDING'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Result actions */}
            {!demoRunning && demoStage === 9 && (
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                  <span aria-hidden="true" className="inline-flex shrink-0">
                    <ShieldCheck className="w-4 h-4" aria-hidden="true" focusable="false" />
                  </span>
                  <span>Pipeline successfully executed! {demoResult?.reportId ? `(Report: ${demoResult.reportId.slice(-6)})` : ''}</span>
                </span>
                <div className="flex items-center gap-2">
                  <Link
                    to="/reports"
                    onClick={() => setDemoModalOpen(false)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors font-mono"
                  >
                    <span>View Audit Dossier</span>
                    <span aria-hidden="true" className="inline-flex shrink-0">
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" focusable="false" />
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
