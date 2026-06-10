export const CHART_COLORS = {
  green: '#3FB950',
  amber: '#D29922',
  blue: '#388BFD',
  red: '#F85149',
  purple: '#A371F7',
  cyan: '#56D4DD',
};

export const SENSOR_COLORS = {
  weight: CHART_COLORS.green,
  ec: CHART_COLORS.amber,
  ph: CHART_COLORS.purple,
  moisture: CHART_COLORS.blue,
  temperature: CHART_COLORS.red,
};

export function statusColor(status) {
  switch (status) {
    case 'normal': return CHART_COLORS.green;
    case 'warning': return CHART_COLORS.amber;
    case 'critical': return CHART_COLORS.red;
    default: return CHART_COLORS.green;
  }
}
