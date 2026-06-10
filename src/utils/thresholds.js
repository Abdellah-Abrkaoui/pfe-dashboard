export const DEFAULT_THRESHOLDS = {
  weight_g: { low: 2800, high: null },
  ec_mscm: { low: 0.8, high: 3.0 },
  ph: { low: 5.5, high: 7.0 },
  soil_pct: { low: 40, high: 90 },
  temp: { low: 15, high: 32 },
};

export function checkThreshold(sensor, value) {
  const threshold = DEFAULT_THRESHOLDS[sensor];
  if (!threshold) return 'normal';
  if (threshold.low !== null && value < threshold.low) return 'critical';
  if (threshold.high !== null && value > threshold.high) return 'critical';
  const range = (threshold.high || Infinity) - (threshold.low || 0);
  if (threshold.low !== null && value < threshold.low + range * 0.15) return 'warning';
  if (threshold.high !== null && value > threshold.high - range * 0.15) return 'warning';
  return 'normal';
}
