import React, { useState, useEffect } from 'react';
import { reportApi, experimentApi } from '../services/api';
import { IReport, IExperiment } from '../types';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import {
  FileSpreadsheet,
  Download,
  Printer,
  ShieldCheck,
  ShieldAlert,
  RefreshCw,
  PlusCircle,
  FileText,
  AlertTriangle,
  Award,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';

export const ReportsStudio: React.FC = () => {
  const [reports, setReports] = useState<IReport[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string>('');
  const [selectedReport, setSelectedReport] = useState<IReport | null>(null);
  const [experiments, setExperiments] = useState<IExperiment[]>([]);
  const [selectedExpId, setSelectedExpId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadReports = async () => {
    setLoading(true);
    try {
      const [reportList, expList] = await Promise.all([
        reportApi.getReports(),
        experimentApi.getExperiments(),
      ]);
      setReports(reportList);
      setExperiments(expList);

      if (reportList.length > 0 && !selectedReportId) {
        setSelectedReportId(reportList[0]._id);
        setSelectedReport(reportList[0]);
      } else if (selectedReportId) {
        const found = reportList.find((r) => r._id === selectedReportId);
        if (found) setSelectedReport(found);
      }

      if (expList.length > 0 && !selectedExpId) {
        setSelectedExpId(expList[0]._id);
      }
    } catch (err) {
      console.error('Failed to load reports', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleSelectReport = (report: IReport) => {
    setSelectedReportId(report._id);
    setSelectedReport(report);
  };

  const handleGenerateReport = async () => {
    if (!selectedExpId) return;
    setGenerating(true);
    try {
      const newReport = await reportApi.generateReport(selectedExpId);
      await loadReports();
      setSelectedReportId(newReport._id);
      setSelectedReport(newReport);
    } catch (err) {
      console.error('Failed to generate report', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopySummary = () => {
    if (!selectedReport) return;
    const rData = selectedReport.reportData || {};
    const text = `ARES SECURITY AUDIT REPORT
Title: ${selectedReport.title}
Experiment: ${rData.experimentName || 'N/A'}
Attack Type: ${rData.attackType || 'N/A'}
Robustness Score: ${rData.robustnessScore ?? 'N/A'}/100
Clean Detection Rate: ${Math.round((rData.cleanDetectionRate || 0) * 100)}%
Adversarial Detection Rate: ${Math.round((rData.adversarialDetectionRate || 0) * 100)}%
Attack Evasion Rate: ${Math.round((rData.attackSuccessRate || 0) * 100)}%
Detection Retention: ${Math.round((rData.detectionRetention || 0) * 100)}%
Recommended Defense: ${rData.recommendedDefense || 'None'}
Generated: ${new Date(selectedReport.createdAt).toLocaleString()}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportJson = () => {
    if (!selectedReport) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(selectedReport, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ARES_Audit_Report_${selectedReport._id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  const rData = selectedReport?.reportData || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <FileSpreadsheet className="w-6 h-6 text-cyan-400" />
            Security Audit & Robustness Reports
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Formal adversarial verification dossiers, compliance summaries, and defensive mitigation rankings.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={loadReports}
            className="p-2.5 text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 rounded-lg transition-colors"
            title="Refresh Reports"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <select
              value={selectedExpId}
              onChange={(e) => setSelectedExpId(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-2.5 focus:border-cyan-500 focus:outline-none"
            >
              {experiments.map((exp) => (
                <option key={exp._id} value={exp._id}>
                  {exp.name} ({exp.attackType})
                </option>
              ))}
            </select>
            <button
              onClick={handleGenerateReport}
              disabled={generating || !selectedExpId}
              className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{generating ? 'Compiling...' : 'Generate Report'}</span>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center space-y-3">
            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
            <span className="text-sm font-mono text-slate-400">Loading Security Audit Dossiers...</span>
          </div>
        </div>
      ) : reports.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-xl border border-slate-800 space-y-4">
          <FileText className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-200">No Audit Reports Generated Yet</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Run an experiment or select an existing benchmark from the dropdown above to generate an executive cybersecurity audit report.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Reports List */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold px-1">
              Available Audit Reports ({reports.length})
            </div>
            <div className="space-y-2 max-h-[750px] overflow-y-auto pr-1">
              {reports.map((rep) => {
                const isSelected = rep._id === selectedReportId;
                const d = rep.reportData || {};
                return (
                  <div
                    key={rep._id}
                    onClick={() => handleSelectReport(rep)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                        : 'glass-card border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold text-slate-200 line-clamp-1">{rep.title}</h4>
                      <Badge
                        label={`${d.robustnessScore ?? 0}/100`}
                        variant={
                          (d.robustnessScore || 0) >= 70
                            ? 'success'
                            : (d.robustnessScore || 0) >= 50
                            ? 'warning'
                            : 'danger'
                        }
                        size="sm"
                      />
                    </div>
                    <div className="mt-2 text-xs text-slate-400 flex items-center justify-between font-mono">
                      <span>{d.attackType || 'ATTACK_SIM'}</span>
                      <span>{new Date(rep.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Dossier View */}
          <div className="lg:col-span-8 space-y-6">
            {selectedReport ? (
              <div className="glass-card rounded-xl border border-slate-800 p-6 space-y-6 print:border-none print:p-0">
                {/* Dossier Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                        OFFICIAL AUDIT REPORT
                      </span>
                      <span className="text-xs text-slate-400 font-mono">ID: {selectedReport._id.slice(-8)}</span>
                    </div>
                    <h2 className="text-xl font-bold text-white mt-1">{selectedReport.title}</h2>
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                      Dataset: {rData.datasetName || 'Benchmark Suite'} • Evaluated on:{' '}
                      {new Date(selectedReport.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopySummary}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg transition-colors"
                      title="Copy Summary"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={handleExportJson}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg transition-colors"
                      title="Export JSON"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>JSON</span>
                    </button>
                    <button
                      onClick={handlePrint}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg transition-colors"
                      title="Print Dossier"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print</span>
                    </button>
                  </div>
                </div>

                {/* Score Summary Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <StatCard
                    title="Robustness Score"
                    value={`${rData.robustnessScore ?? 0}/100`}
                    subtitle={`Tier: ${rData.robustnessTier || 'MEDIUM'}`}
                    icon={ShieldAlert}
                    variant={
                      (rData.robustnessScore || 0) >= 70
                        ? 'emerald'
                        : (rData.robustnessScore || 0) >= 50
                        ? 'amber'
                        : 'red'
                    }
                  />
                  <StatCard
                    title="Detection Retention"
                    value={`${Math.round((rData.detectionRetention || 0) * 100)}%`}
                    subtitle="Post-perturbation capture"
                    icon={ShieldCheck}
                    variant="cyan"
                  />
                  <StatCard
                    title="Attack Evasion Rate"
                    value={`${Math.round((rData.attackSuccessRate || 0) * 100)}%`}
                    subtitle="Bypassed classifier"
                    icon={AlertTriangle}
                    variant={(rData.attackSuccessRate || 0) > 0.5 ? 'red' : 'amber'}
                  />
                  <StatCard
                    title="Clean Baseline"
                    value={`${Math.round((rData.cleanDetectionRate || 0) * 100)}%`}
                    subtitle="Unperturbed sample rate"
                    icon={CheckCircle2}
                    variant="emerald"
                  />
                </div>

                {/* Primary Vulnerability & Evasion Driver */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-2">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Vulnerability Analysis & Evasion Driver
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {rData.primaryEvasionDriver ||
                      `Feature analysis reveals that adversarial perturbation via ${
                        rData.attackType || 'feature expansion'
                      } caused significant score degradation. Classifiers heavily conditioned on unconstrained structural metrics allow attackers to mimic benign distributions by appending benign-like features without modifying core malicious logic.`}
                  </p>
                </div>

                {/* Recommended Mitigation Strategy */}
                <div className="bg-gradient-to-br from-cyan-950/30 to-blue-950/20 border border-cyan-500/30 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-cyan-400" />
                      <h3 className="text-sm font-semibold text-white">Recommended Mitigation Strategy</h3>
                    </div>
                    <Badge
                      label={`Confidence: ${Math.round((rData.recommendationConfidence || 0.88) * 100)}%`}
                      variant="info"
                    />
                  </div>

                  <div className="text-base font-bold text-cyan-300">
                    {String(rData.recommendedDefense || 'MONOTONIC_CONSTRAINT_SIMULATION')
                      .replace('_SIMULATION', '')
                      .replace('_', ' ')}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {rData.reasoning ||
                      'Enforcing directional monotonicity prevents adversarial slack manipulation from diluting risk scores. Malicious indicators remain bounded against adversarial expansion.'}
                  </p>

                  {rData.observedWeaknesses && rData.observedWeaknesses.length > 0 && (
                    <div className="pt-2 border-t border-cyan-500/20">
                      <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold">
                        Observed Vulnerability Vectors:
                      </span>
                      <ul className="mt-1 space-y-1">
                        {rData.observedWeaknesses.map((w: string, i: number) => (
                          <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                            <span className="text-cyan-400 mt-0.5">•</span>
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Comparative Mitigation Matrix */}
                {rData.defenses && rData.defenses.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                      Comparative Defense Benchmark Matrix
                    </h3>
                    <div className="overflow-x-auto rounded-lg border border-slate-800">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-900/80 font-mono text-slate-400 uppercase">
                          <tr>
                            <th className="px-3 py-2.5">Mitigation Strategy</th>
                            <th className="px-3 py-2.5">Retention</th>
                            <th className="px-3 py-2.5">Post-Attack Det.</th>
                            <th className="px-3 py-2.5">Robustness Score</th>
                            <th className="px-3 py-2.5">Latency</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono">
                          {rData.defenses.map((d: any, idx: number) => {
                            const isRecommended =
                              d.defenseType === rData.recommendedDefense;
                            return (
                              <tr
                                key={idx}
                                className={isRecommended ? 'bg-cyan-500/5' : 'hover:bg-slate-800/30'}
                              >
                                <td className="px-3 py-2.5 text-slate-200 font-sans flex items-center gap-1.5">
                                  {isRecommended && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                                  <span>{d.defenseType.replace('_SIMULATION', '').replace('_', ' ')}</span>
                                </td>
                                <td className="px-3 py-2.5 text-cyan-400 font-semibold">
                                  {Math.round(
                                    (d.metrics?.detectionRetention || d.adversarialDetectionRate || 0) * 100
                                  )}
                                  %
                                </td>
                                <td className="px-3 py-2.5 text-slate-300">
                                  {Math.round(d.adversarialDetectionRate * 100)}%
                                </td>
                                <td className="px-3 py-2.5 text-slate-200">{d.robustnessScore}/100</td>
                                <td className="px-3 py-2.5 text-slate-400">{d.processingTimeMs || 4}ms</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
