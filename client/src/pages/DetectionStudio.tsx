import React, { useState } from 'react';
import { interactiveApi } from '../services/api';
import { IFeatureVector, IDetectionResult } from '../types';
import { PredictionBadge, RiskBadge } from '../components/common/Badge';
import { Search, Sliders } from 'lucide-react';

const PRESETS: Record<string, IFeatureVector> = {
  'Packed Ransomware': {
    fileSize: 520000,
    entropy: 7.55,
    sectionCount: 5,
    importCount: 6,
    exportCount: 0,
    resourceCount: 2,
    stringCount: 45,
    apiCount: 14,
    headerSize: 1024,
    codeSize: 140000,
    dataSize: 360000,
    imageCount: 0,
    certificatePresent: 0,
    suspiciousApiCount: 5,
    packedIndicator: 1,
  },
  'Legitimate Utility (Benign)': {
    fileSize: 3400000,
    entropy: 5.8,
    sectionCount: 4,
    importCount: 160,
    exportCount: 5,
    resourceCount: 8,
    stringCount: 1800,
    apiCount: 220,
    headerSize: 1024,
    codeSize: 1500000,
    dataSize: 800000,
    imageCount: 3,
    certificatePresent: 1,
    suspiciousApiCount: 0,
    packedIndicator: 0,
  },
  'Suspicious Dropper': {
    fileSize: 180000,
    entropy: 6.9,
    sectionCount: 3,
    importCount: 12,
    exportCount: 0,
    resourceCount: 1,
    stringCount: 90,
    apiCount: 18,
    headerSize: 1024,
    codeSize: 45000,
    dataSize: 120000,
    imageCount: 0,
    certificatePresent: 0,
    suspiciousApiCount: 3,
    packedIndicator: 0,
  },
};

export const DetectionStudio: React.FC = () => {
  const [features, setFeatures] = useState<IFeatureVector>(PRESETS['Packed Ransomware']);
  const [result, setResult] = useState<IDetectionResult | null>(null);

  const handleAnalyze = async (vector: IFeatureVector) => {
    try {
      const res = await interactiveApi.analyzeDetection(vector);
      setResult(res);
    } catch (err) {
      console.error('Detection analysis error', err);
    }
  };

  React.useEffect(() => {
    handleAnalyze(features);
  }, []);

  const updateFeature = (key: keyof IFeatureVector, value: number) => {
    const updated = { ...features, [key]: value };
    setFeatures(updated);
    handleAnalyze(updated);
  };

  const applyPreset = (presetName: string) => {
    const p = PRESETS[presetName];
    if (p) {
      setFeatures(p);
      handleAnalyze(p);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Search className="w-6 h-6 text-cyan-400" />
            <span>Static Detection Engine Studio</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time deterministic feature classification, threat scoring, and transparent contribution mapping.
          </p>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 mr-1">Presets:</span>
          {Object.keys(PRESETS).map((name) => (
            <button
              key={name}
              onClick={() => applyPreset(name)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Feature Controls */}
        <div className="lg:col-span-2 p-6 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Static PE Feature Controls</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">15 Deterministic Signals</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            {/* Entropy */}
            <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300">Shannon Entropy</span>
                <span className="text-cyan-400 font-bold">{features.entropy}</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="8.0"
                step="0.05"
                value={features.entropy}
                onChange={(e) => updateFeature('entropy', parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0.0 (Uniform)</span>
                <span>8.0 (Packed/Encrypted)</span>
              </div>
            </div>

            {/* Suspicious APIs */}
            <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300">Suspicious APIs Count</span>
                <span className="text-red-400 font-bold">{features.suspiciousApiCount}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={features.suspiciousApiCount}
                onChange={(e) => updateFeature('suspiciousApiCount', parseInt(e.target.value, 10))}
                className="w-full accent-red-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0 APIs</span>
                <span>10 (VirtualAlloc, etc.)</span>
              </div>
            </div>

            {/* Packed Indicator */}
            <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300">Packed Signature</span>
                <span className="font-bold text-amber-400">{features.packedIndicator ? 'DETECTED' : 'CLEAN'}</span>
              </div>
              <button
                onClick={() => updateFeature('packedIndicator', features.packedIndicator ? 0 : 1)}
                className={`w-full py-1.5 rounded text-xs font-semibold transition-colors ${
                  features.packedIndicator ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Toggle UPX / Packed Indicator
              </button>
            </div>

            {/* Certificate Present */}
            <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300">Digital Certificate</span>
                <span className="font-bold text-emerald-400">{features.certificatePresent ? 'VALID' : 'UNSIGNED'}</span>
              </div>
              <button
                onClick={() => updateFeature('certificatePresent', features.certificatePresent ? 0 : 1)}
                className={`w-full py-1.5 rounded text-xs font-semibold transition-colors ${
                  features.certificatePresent ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Toggle Digital Signature
              </button>
            </div>

            {/* Import Count */}
            <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300">Import Count</span>
                <span className="text-cyan-400 font-bold">{features.importCount}</span>
              </div>
              <input
                type="range"
                min="0"
                max="300"
                step="5"
                value={features.importCount}
                onChange={(e) => updateFeature('importCount', parseInt(e.target.value, 10))}
                className="w-full accent-cyan-400"
              />
            </div>

            {/* String Count */}
            <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300">String Count</span>
                <span className="text-cyan-400 font-bold">{features.stringCount}</span>
              </div>
              <input
                type="range"
                min="10"
                max="3000"
                step="50"
                value={features.stringCount}
                onChange={(e) => updateFeature('stringCount', parseInt(e.target.value, 10))}
                className="w-full accent-cyan-400"
              />
            </div>

            {/* File Size */}
            <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2 sm:col-span-2">
              <div className="flex justify-between">
                <span className="text-slate-300">Binary File Size</span>
                <span className="text-cyan-400 font-bold">{(features.fileSize / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
              <input
                type="range"
                min={100 * 1024}
                max={25 * 1024 * 1024}
                step={256 * 1024}
                value={features.fileSize}
                onChange={(e) => updateFeature('fileSize', parseInt(e.target.value, 10))}
                className="w-full accent-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Classification & Score Output */}
        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md text-center space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Threat Assessment Output
            </div>

            {result && (
              <>
                <div className="relative inline-flex items-center justify-center">
                  <div className={`w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center transition-all ${
                    result.score >= 50 ? 'border-red-500 shadow-lg shadow-red-500/20' : 'border-emerald-500 shadow-lg shadow-emerald-500/20'
                  }`}>
                    <span className="text-3xl font-extrabold font-mono text-white">{result.score}</span>
                    <span className="text-[10px] font-mono text-slate-400">/ 100</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-center gap-2">
                    <PredictionBadge prediction={result.prediction} />
                    <RiskBadge risk={result.riskLevel} />
                  </div>
                  <p className="text-xs font-mono text-slate-400">
                    Decision Confidence: <span className="text-slate-200 font-bold">{Math.round(result.confidence * 100)}%</span>
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Feature Contributions List */}
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-3">
              Top Feature Contributions
            </h3>
            <div className="space-y-2 text-xs font-mono">
              {result?.featureContributions.slice(0, 5).map((fc) => (
                <div key={fc.featureName} className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-300">{fc.featureName}</span>
                  <span className={`font-bold ${fc.contribution > 0 ? 'text-red-400' : fc.contribution < 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {fc.contribution > 0 ? `+${fc.contribution}` : fc.contribution} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
