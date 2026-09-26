import React, { useState, useEffect } from 'react';
import { experimentService } from '../services/experimentService';
import { datasetService } from '../services/datasetService';
import { IExperiment, IDataset, AttackType, ExperimentStatus } from '../types';
import { Badge } from '../components/common/Badge';
import {
  Layers,
  Play,
  PlusCircle,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ExperimentsStudio: React.FC = () => {
  const [experiments, setExperiments] = useState<IExperiment[]>([]);
  const [datasets, setDatasets] = useState<IDataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // New Experiment Form
  const [name, setName] = useState('');
  const [datasetId, setDatasetId] = useState('');
  const [attackType, setAttackType] = useState<AttackType>(AttackType.PADDING);
  const [running, setRunning] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [expList, dList] = await Promise.all([
        experimentService.getExperiments(),
        datasetService.getDatasets(),
      ]);
      setExperiments(expList);
      setDatasets(dList);
      if (dList.length > 0 && !datasetId) {
        setDatasetId(dList[0]._id);
      }
    } catch (err) {
      console.error('Failed to load experiments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateExperiment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!datasetId) return;
    setRunning(true);
    try {
      await experimentService.runExperiment({
        name: name || `Adversarial Evaluation ${new Date().toLocaleTimeString()}`,
        datasetId,
        attackType,
      });
      setShowModal(false);
      setName('');
      await loadData();
    } catch (err) {
      console.error('Failed to run experiment', err);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-cyan-400" />
            <span>Experiment Management Studio</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure, schedule, and review end-to-end adversarial robustness evaluations stored in MongoDB.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 rounded-lg transition-colors"
            title="Refresh Experiments"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg shadow-lg shadow-cyan-500/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Benchmark Run</span>
          </button>
        </div>
      </div>

      {/* Experiments Table */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="flex flex-col items-center space-y-3">
            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
            <span className="text-sm font-mono text-slate-400">Loading Experiment Pipeline Records...</span>
          </div>
        </div>
      ) : experiments.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-xl border border-slate-800 space-y-4">
          <Layers className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-200">No Experiments Registered</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Click "New Benchmark Run" above or run the automated seed script to populate adversarial experiment records.
          </p>
        </div>
      ) : (
        <div className="glass-card rounded-xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3 font-semibold">Experiment Name</th>
                  <th className="px-4 py-3 font-semibold">Dataset</th>
                  <th className="px-4 py-3 font-semibold">Attack Mode</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Robustness</th>
                  <th className="px-4 py-3 font-semibold">Retention</th>
                  <th className="px-4 py-3 font-semibold">Evasion</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {experiments.map((exp) => (
                  <tr key={exp._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-sans font-medium text-slate-200">
                      <div>{exp.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {new Date(exp.createdAt).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {typeof exp.datasetId === 'object' ? exp.datasetId.name : 'Dataset'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400">
                        {exp.attackType || 'PADDING'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        label={exp.status}
                        variant={
                          exp.status === ExperimentStatus.COMPLETED
                            ? 'success'
                            : exp.status === ExperimentStatus.RUNNING
                            ? 'info'
                            : 'danger'
                        }
                        size="sm"
                      />
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-100">
                      {exp.robustnessScore !== undefined ? `${exp.robustnessScore}/100` : '—'}
                    </td>
                    <td className="px-4 py-3 text-cyan-400 font-semibold">
                      {exp.detectionRetention !== undefined
                        ? `${Math.round(exp.detectionRetention * 100)}%`
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-red-400">
                      {exp.attackSuccessRate !== undefined
                        ? `${Math.round(exp.attackSuccessRate * 100)}%`
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to="/reports"
                        className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold hover:underline"
                      >
                        <span>Audit</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: New Experiment Run */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Play className="w-5 h-5 text-cyan-400 fill-current" />
              <span>Launch Adversarial Experiment</span>
            </h3>
            <p className="text-xs text-slate-400">
              Run an end-to-end evaluation pipeline against synthetic feature vectors and record multi-defense results in MongoDB.
            </p>

            <form onSubmit={handleCreateExperiment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-mono">Experiment Title</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Robustness Stress Test — Slack Space Overlay"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-mono">Target PE Benchmark Dataset</label>
                <select
                  value={datasetId}
                  onChange={(e) => setDatasetId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                >
                  {datasets.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name} ({d.sampleCount} vectors)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-mono">Adversarial Simulation Technique</label>
                <select
                  value={attackType}
                  onChange={(e) => setAttackType(e.target.value as AttackType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value={AttackType.PADDING}>Padding Attack Simulation (Size expansion & Entropy dilution)</option>
                  <option value={AttackType.GAMMA_INSPIRED}>GAMMA-inspired Simulation (Benign section/import injection)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={running}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg transition-colors flex items-center gap-2"
                >
                  {running && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{running ? 'Executing Pipeline...' : 'Start Benchmark'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperimentsStudio;
