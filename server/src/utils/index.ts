/**
 * ARES Core Utilities
 */

/**
 * Rounds a floating point number to a given number of decimal places
 */
export const roundToPrecision = (num: number, decimals: number = 3): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
};

/**
 * Converts a byte count into a human-readable string (e.g. 4.2 MB)
 */
export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

/**
 * Clamps a number between a minimum and maximum bound
 */
export const clamp = (val: number, min: number, max: number): number => {
  return Math.min(Math.max(val, min), max);
};
