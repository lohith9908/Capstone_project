import React, { useState } from 'react';
import { interactiveApi } from '../services/api';
import { AttackType, IFeatureVector, IAdversarialResult } from '../types';
import { PredictionBadge } from '../components/common/Badge';
import { Zap, ArrowRight, ShieldCheck, ShieldAlert, Sliders } from 'lucide-react';

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

export const AttackStudio: React.FC = () => {
  const [attackType, setAttackType] = useState<AttackType>(AttackType.PADDING);
  const [paddingSizeMB, setPaddingSizeMB] = useState(6);
  const [entropyReduction, setEntropyReduction] = useState(0.28);
  const [injectedImports, setInjectedImports] = useState(90);
  const [injectedStrings, setInjectedStrings] = useState(1200);

  const [result, setResult] = useState<IAdversarialResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runSimulation = async () => {
    setLoading(true);
    try {
      if (attackType === AttackType.PADDING) {
        const res = await interactiveApi.simulatePadding(SAMPLE_MALWARE, {
          paddingSizeBytes: paddingSizeMB * 1024 * 1024,
          entropyReductionFactor: entropyReduction,
        });
        setResult(res);
      } else {
        const res = await interactiveApi.simulateGamma(SAMPLE_MALWARE, {
          injectedImports,
          injectedStrings,
        });
        setResult(res);
      }
    } catch (err) {
      console.error('Attack simulation failed', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    runSimulation();
  }, [attackType, paddingSizeMB, entropyReduction, injectedImports, injectedStrings]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Zap className="w-6 h-6 text-red-400" />
            <span>Adversarial Attack Simulation Studio</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Simulate safe feature-level evasion attacks (Padding & GAMMA-inspired benign injection) on malware vectors.
          </p>
        </div>

        {/* Attack Mode Switcher */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setAttackType(AttackType.PADDING)}
            className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all ${
              attackType === AttackType.PADDING
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Padding Attack Simulation
          </button>
          <button
            onClick={() => setAttackType(AttackType.GAMMA_INSPIRED)}
            className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all ${
              attackType === AttackType.GAMMA_INSPIRED
                ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            GAMMA-inspired Simulation
          </button>
        </div>
      </div>

      {/* Attack Parameter Tuning Card */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2 font-mono">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span>Simulation Hyperparameters</span>
          {loading && <span className="text-xs text-cyan-400 animate-pulse font-normal">(Simulating...)</span>}
        </h2>

        {attackType === AttackType.PADDING ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300">Overlay Padding Size</span>
                <span className="text-cyan-400 font-bold">{paddingSizeMB} MB</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={paddingSizeMB}
                onChange={(e) => setPaddingSizeMB(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-400"
              />
              <p className="text-[11px] text-slate-400 font-sans">Simulates appending zero/repetitive bytes into the overlay slack space.</p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300">Entropy Dilution Factor</span>
                <span className="text-cyan-400 font-bold">{Math.round(entropyReduction * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.50"
                step="0.01"
                value={entropyReduction}
                onChange={(e) => setEntropyReduction(parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <p className="text-[11px] text-slate-400 font-sans">Controls the rate at which whole-file Shannon entropy is suppressed.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300">Injected Benign Imports</span>
                <span className="text-red-400 font-bold">+{injectedImports} APIs</span>
              </div>
              <input
                type="range"
                min="20"
                max="250"
                step="10"
                value={injectedImports}
                onChange={(e) => setInjectedImports(parseInt(e.target.value, 10))}
                className="w-full accent-red-400"
              />
              <p className="text-[11px] text-slate-400 font-sans">Incorporate standard Windows API imports from legitimate binaries.</p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300">Injected Benign Strings</span>
                <span className="text-red-400 font-bold">+{injectedStrings} strings</span>
              </div>
              <input
                type="range"
                min="200"
                max="3000"
                step="100"
                value={injectedStrings}
                onChange={(e) => setInjectedStrings(parseInt(e.target.value, 10))}
                className="w-full accent-red-400"
              />
              <p className="text-[11px] text-slate-400 font-sans">Flood the PE string table with common benign dictionary strings.</p>
            </div>
          </div>
        )}
      </div>

      {/* Live Evasion Status Banner */}
      {result && (
        <div className={`p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          result.evaded
            ? 'bg-red-500/10 border-red-500/30 text-red-200'
            : result.attackSuccessful
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
        }`}>
          <div className="flex items-center gap-3">
            {result.evaded ? (
              <ShieldAlert className="w-7 h-7 text-red-400 shrink-0" />
            ) : (
              <ShieldCheck className="w-7 h-7 text-emerald-400 shrink-0" />
            )}
            <div>
              <div className="text-sm font-bold font-mono uppercase tracking-wide">
                {result.evaded
                  ? 'ATTACK EVASION SUCCESSFUL (Malware Bypassed Detection)'
                  : result.attackSuccessful
                  ? 'DETECTION COMPROMISED (Score significantly degraded)'
                  : 'DEFENSE RESILIENT (Malware classification sustained)'}
              </div>
              <p className="text-xs opacity-90 mt-0.5">
                Malware score dropped from{' '}
                <span className="font-bold font-mono">{result.originalDetection.score}</span> to{' '}
                <span className="font-bold font-mono">{result.adversarialDetection.score}</span> (
                {result.scoreDelta} pts shift).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono shrink-0">
            <div>
              <span className="text-slate-400 block text-[10px]">ORIGINAL</span>
              <PredictionBadge prediction={result.originalDetection.prediction} />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500" />
            <div>
              <span className="text-slate-400 block text-[10px]">PERTURBED</span>
              <PredictionBadge prediction={result.adversarialDetection.prediction} />
            </div>
          </div>
        </div>
      )}

      {/* Changed Features Table */}
      {result && (
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <h2 className="text-sm font-semibold text-white mb-4 font-mono">
            Feature Transformation Perturbations
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">Modified Feature</th>
                  <th className="py-3 px-3">Original Clean Value</th>
                  <th className="py-3 px-3">Adversarial Value</th>
                  <th className="py-3 px-3 text-right">Perturbation Delta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {Object.entries(result.changedFeatures).map(([feat, change]) => (
                  <tr key={feat} className="hover:bg-slate-800/30">
                    <td className="py-3 px-3 font-semibold text-slate-200">{feat}</td>
                    <td className="py-3 px-3 text-slate-400">{change.original}</td>
                    <td className="py-3 px-3 text-cyan-400 font-bold">{change.modified}</td>
                    <td className="py-3 px-3 text-right font-bold text-red-400">
                      {change.delta > 0 ? `+${change.delta}` : change.delta}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
