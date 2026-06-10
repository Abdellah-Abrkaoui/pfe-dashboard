import dayjs from 'dayjs';

export function formatValue(value, decimals = 1) {
  if (value === null || value === undefined) return '--';
  return Number(value).toFixed(decimals);
}

export function formatTimestamp(ts) {
  return dayjs(ts).format('HH:mm:ss');
}

export function formatDate(ts) {
  return dayjs(ts).format('YYYY-MM-DD HH:mm');
}

export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

export function formatTrend(value) {
  if (value === 0) return '0%';
  const sign = value > 0 ? '↑' : '↓';
  return `${sign} ${Math.abs(value).toFixed(1)}%`;
}
