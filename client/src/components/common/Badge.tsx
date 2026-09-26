import React from 'react';
import { RiskLevel, SamplePrediction } from '../../types';

interface BadgeProps {
  label: string;
  variant?: 'danger' | 'warning' | 'success' | 'info' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  size = 'md',
}) => {
  const styles = {
    danger: 'bg-red-500/10 text-red-400 border-red-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    info: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    neutral: 'bg-slate-800/60 text-slate-300 border-slate-700/60',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center font-mono font-medium rounded-full border ${styles[variant]} ${sizeStyles[size]}`}
    >
      {label}
    </span>
  );
};

export const PredictionBadge: React.FC<{ prediction: SamplePrediction }> = ({ prediction }) => {
  const isMalware = prediction === SamplePrediction.MALWARE;
  return (
    <Badge
      label={prediction}
      variant={isMalware ? 'danger' : 'success'}
    />
  );
};

export const RiskBadge: React.FC<{ risk: RiskLevel }> = ({ risk }) => {
  const variants: Record<RiskLevel, 'danger' | 'warning' | 'info' | 'success'> = {
    [RiskLevel.CRITICAL]: 'danger',
    [RiskLevel.HIGH]: 'danger',
    [RiskLevel.MEDIUM]: 'warning',
    [RiskLevel.LOW]: 'success',
  };
  return <Badge label={risk} variant={variants[risk] || 'neutral'} />;
};
