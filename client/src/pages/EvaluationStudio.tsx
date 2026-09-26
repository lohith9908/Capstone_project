import React, { useState, useEffect } from 'react';
import { evaluationService } from '../services/evaluationService';
import { datasetService } from '../services/datasetService';
import { IDataset, SampleLabel, SamplePrediction } from '../types';
import { StatCard } from '../components/common/StatCard';
import { Badge, PredictionBadge, RiskBadge } from '../components/common/Badge';
import {
  FileCheck2,
  Play,
  RefreshCw,
  Target,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';

export const EvaluationStudio: React.FC = () => {
  const [datasets, setDatasets] = useState<IDataset[]>([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('');
  const [data, setData] = useState<any>(null);
  const [evaluating, setEvaluating] = useState(false);

  const loadDatasets = async () => {
    try {
      const list = await datasetService.getDatasets();
      setDatasets(list);
      if (list.length > 0 && !selectedDatasetId) {
        setSelectedDatasetId(list[0]._id);
      }
    } catch (err) {
      console.error('Failed to load datasets', err);
    }
  };

  useEffect(() => {
    loadDatasets();
  }, []);

  const handleRunEvaluation = async (idToEval?: string) => {
    const targetId = idToEval || selectedDatasetId;
    if (!targetId) return;
    setEvaluating(true);
    try {
      const res = await evaluationService.runCleanEvaluation(targetId);
      setData(res);
    } catch (err) {
      console.error('Evaluation failed', err);
    } finally {
      setEvaluating(false);
    }
  };

  useEffect(() => {
    if (selectedDatasetId) {
      handleRunEvaluation(selectedDatasetId);
    }
  }, [selectedDatasetId]);

  const metrics = data?.metrics || {};
  const cm = data?.confusionMatrix || { tp: 0, tn: 0, fp: 0, fn: 0 };
  const predictions = data?.predictions || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <FileCheck2 className="w-6 h-6 text-emerald-400" />
            <span>Clean Baseline Evaluation Studio</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Establish ground-truth classifier efficacy on unperturbed PE samples before adversarial stress-testing.
          </p>
        </div>

        {/* Dataset selector & Run CTA */}
        <div className="flex items-center gap-3">
          <select
            value={selectedDatasetId}
            onChange={(e) => setSelectedDatasetId(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-2.5 focus:border-cyan-500 focus:outline-none font-mono"
          >
            {datasets.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name} ({d.sampleCount} samples)
              </option>
            ))}
          </select>

          <button
            onClick={() => handleRunEvaluation()}
            disabled={evaluating || !selectedDatasetId}
            className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
          >
            {evaluating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
            <span>{evaluating ? 'Evaluating...' : 'Run Evaluation'}</span>
          </button>
        </div>
      </div>

      {evaluating ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="flex flex-col items-center space-y-3">
            <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
            <span className="text-sm font-mono text-slate-400">
              Computing baseline predictions and confusion matrix...
            </span>
          </div>
        </div>
      ) : data ? (
        <>
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <StatCard
              title="Accuracy"
              value={`${Math.round((metrics.accuracy || 0) * 100)}%`}
              subtitle="Overall correct"
              icon={Target}
              variant="emerald"
            />
            <StatCard
              title="Detection Rate (Recall)"
              value={`${Math.round((metrics.detectionRate || 0) * 100)}%`}
              subtitle="Malware captured"
              icon={CheckCircle2}
              variant="cyan"
            />
            <StatCard
              title="Precision"
              value={`${Math.round((metrics.precision || 0) * 100)}%`}
              subtitle="Malware fidelity"
              icon={Target}
              variant="cyan"
            />
            <StatCard
              title="F1 Score"
              value={metrics.f1 !== undefined ? metrics.f1.toFixed(3) : '0.000'}
              subtitle="Harmonic mean"
              icon={FileCheck2}
              variant="emerald"
            />
            <StatCard
              title="False Positive Rate"
              value={`${Math.round((metrics.falsePositiveRate || 0) * 100)}%`}
              subtitle="Benign flagged"
              icon={XCircle}
              variant={(metrics.falsePositiveRate || 0) > 0.05 ? 'amber' : 'emerald'}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Confusion Matrix */}
            <div className="lg:col-span-5 glass-card rounded-xl border border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                  <span>Binary Confusion Matrix</span>
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  Total: {metrics.totalSamples || 0}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                {/* True Positives */}
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                  <div className="text-[11px] font-mono uppercase text-emerald-400 font-semibold">
                    True Positives (TP)
                  </div>
                  <div className="text-3xl font-extrabold font-mono text-emerald-300">
                    {cm.tp}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Actual Malware → Predicted Malware
                  </div>
                </div>

                {/* False Negatives */}
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 space-y-1">
                  <div className="text-[11px] font-mono uppercase text-red-400 font-semibold">
                    False Negatives (FN)
                  </div>
                  <div className="text-3xl font-extrabold font-mono text-red-300">
                    {cm.fn}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Actual Malware → Missed as Benign
                  </div>
                </div>

                {/* False Positives */}
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                  <div className="text-[11px] font-mono uppercase text-amber-400 font-semibold">
                    False Positives (FP)
                  </div>
                  <div className="text-3xl font-extrabold font-mono text-amber-300">
                    {cm.fp}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Actual Benign → Flagged as Malware
                  </div>
                </div>

                {/* True Negatives */}
                <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 space-y-1">
                  <div className="text-[11px] font-mono uppercase text-cyan-400 font-semibold">
                    True Negatives (TN)
                  </div>
                  <div className="text-3xl font-extrabold font-mono text-cyan-300">
                    {cm.tn}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Actual Benign → Confirmed Benign
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <p>
                  High clean detection rate guarantees our baseline classifier reliably identifies malicious PE vectors before adversarial feature evasion testing.
                </p>
              </div>
            </div>

            {/* Predictions Sample Table */}
            <div className="lg:col-span-7 glass-card rounded-xl border border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
                  Sample-Level Baseline Inferences
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  Showing top {predictions.length} samples
                </span>
              </div>

              <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
                <table className="w-full text-xs text-left font-mono">
                  <thead className="bg-slate-900/80 uppercase text-slate-400 sticky top-0">
                    <tr>
                      <th className="px-3 py-2">Sample ID</th>
                      <th className="px-3 py-2">Ground Truth</th>
                      <th className="px-3 py-2">Prediction</th>
                      <th className="px-3 py-2">Score</th>
                      <th className="px-3 py-2">Risk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {predictions.map((p: any, idx: number) => {
                      const correct =
                        (p.trueLabel === SampleLabel.MALWARE &&
                          p.predictedLabel === SamplePrediction.MALWARE) ||
                        (p.trueLabel === SampleLabel.BENIGN &&
                          p.predictedLabel === SamplePrediction.BENIGN);

                      return (
                        <tr key={idx} className="hover:bg-slate-800/30">
                          <td className="px-3 py-2 text-slate-500 flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${correct ? 'bg-emerald-400' : 'bg-red-400'}`} />
                            {String(p.sampleId).slice(-8)}
                          </td>
                          <td className="px-3 py-2">
                            <Badge
                              label={p.trueLabel}
                              variant={
                                p.trueLabel === SampleLabel.MALWARE ? 'danger' : 'success'
                              }
                              size="sm"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <PredictionBadge prediction={p.predictedLabel} />
                          </td>
                          <td className="px-3 py-2 font-bold text-slate-200">
                            {p.score}/100
                          </td>
                          <td className="px-3 py-2">
                            <RiskBadge risk={p.riskLevel} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="glass-card p-12 text-center rounded-xl border border-slate-800 space-y-3">
          <FileCheck2 className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-200">No Clean Evaluation Run Yet</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Select a dataset from the top dropdown and click "Run Evaluation" to establish your clean baseline accuracy and confusion matrix.
          </p>
        </div>
      )}
    </div>
  );
};

export default EvaluationStudio;
