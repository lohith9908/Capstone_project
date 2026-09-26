import React, { useState, useEffect } from 'react';
import { recommendationService } from '../services/recommendationService';
import { AttackType, IRecommendationResult } from '../types';
import { Badge } from '../components/common/Badge';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Layers,
  HelpCircle,
} from 'lucide-react';

export const RecommendationsStudio: React.FC = () => {
  const [attackType, setAttackType] = useState<AttackType>(AttackType.PADDING);
  const [recommendation, setRecommendation] = useState<IRecommendationResult | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRecommendation = async () => {
    setLoading(true);
    try {
      const res = await recommendationService.getRecommendation(undefined, attackType);
      setRecommendation(res);
    } catch (err) {
      console.error('Failed to load dynamic defense recommendation', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendation();
  }, [attackType]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Award className="w-6 h-6 text-cyan-400" />
            <span>Dynamic Defense Recommendation Engine</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Automated multi-criteria trade-off optimization balancing robustness gains against computational overhead.
          </p>
        </div>

        {/* Attack Mode Switcher */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setAttackType(AttackType.PADDING)}
            className={`px-3.5 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all ${
              attackType === AttackType.PADDING
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            vs Padding Attack
          </button>
          <button
            onClick={() => setAttackType(AttackType.GAMMA_INSPIRED)}
            className={`px-3.5 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all ${
              attackType === AttackType.GAMMA_INSPIRED
                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            vs GAMMA Attack
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="flex flex-col items-center space-y-3">
            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
            <span className="text-sm font-mono text-slate-400">
              Synthesizing Multi-Criteria Defense Ranking...
            </span>
          </div>
        </div>
      ) : recommendation ? (
        <div className="space-y-6">
          {/* Hero Recommendation Card */}
          <div className="p-6 rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-cyan-950/20 via-slate-900/80 to-blue-950/30 backdrop-blur-md space-y-5 shadow-xl shadow-cyan-500/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                    Optimal Defensive Strategy
                  </div>
                  <h2 className="text-2xl font-extrabold text-white mt-0.5">
                    {recommendation.recommendedDefense.replace(/_/g, ' ')}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  label={`Confidence: ${Math.round(recommendation.confidence * 100)}%`}
                  variant="info"
                  size="md"
                />
              </div>
            </div>

            {/* Strategic Rationale */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>Analytical Reasoning & Rationale</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-sans">
                {recommendation.reasoning}
              </p>
            </div>

            {/* Weaknesses Addressed */}
            {recommendation.observedWeaknesses &&
              recommendation.observedWeaknesses.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-mono uppercase text-slate-400 font-semibold">
                    Target Vulnerabilities Mitigated:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {recommendation.observedWeaknesses.map((w, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{w}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* Defense Comparison & Ranking Table */}
          <div className="glass-card rounded-xl border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Multi-Criteria Defense Strategy Ranking</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">
                Sorted by Trade-Off Score
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left font-mono">
                <thead className="bg-slate-900/80 uppercase text-slate-400 tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Rank</th>
                    <th className="px-4 py-3">Defense Mechanism</th>
                    <th className="px-4 py-3">Raw Score</th>
                    <th className="px-4 py-3">Cost-Adjusted Score</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {recommendation.ranking.map((item) => {
                    const isTop = item.rank === 1;
                    return (
                      <tr
                        key={item.defense}
                        className={isTop ? 'bg-cyan-500/5 font-semibold' : 'hover:bg-slate-800/30'}
                      >
                        <td className="px-4 py-3">
                          <span
                            className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-xs ${
                              isTop
                                ? 'bg-cyan-500 text-slate-950 font-bold'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            #{item.rank}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-sans text-slate-200">
                          {item.defense.replace(/_/g, ' ')}
                        </td>
                        <td className="px-4 py-3 text-cyan-400 font-bold">
                          {item.score}/100
                        </td>
                        <td className="px-4 py-3 text-emerald-400 font-bold">
                          {item.tradeOffScore}/100
                        </td>
                        <td className="px-4 py-3">
                          {isTop ? (
                            <Badge label="RECOMMENDED" variant="success" size="sm" />
                          ) : (
                            <Badge label="SECONDARY" variant="neutral" size="sm" />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default RecommendationsStudio;
