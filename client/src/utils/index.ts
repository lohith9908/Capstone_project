/**
 * ARES Client UI Formatting and Data Utilities
 */

export const formatPercentage = (val: number, decimals: number = 1): string => {
  return `${(val * 100).toFixed(decimals)}%`;
};

export const formatScore = (score: number): string => {
  return `${Math.round(score)}/100`;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const getScoreBadgeVariant = (score: number): 'success' | 'warning' | 'danger' => {
  if (score >= 70) return 'success';
  if (score >= 50) return 'warning';
  return 'danger';
};
