import clsx from 'clsx';
import { formatValue, formatTrend } from '../../utils/formatters';

export default function KpiCard({ label, value, unit, icon: Icon, status = 'normal', trend, history = [] }) {
  const borderColor = {
    normal: 'border-t-accent-green',
    warning: 'border-t-accent-amber',
    critical: 'border-t-accent-red',
  }[status];

  const valueColor = {
    normal: 'text-text-primary',
    warning: 'text-accent-amber',
    critical: 'text-accent-red',
  }[status];

  const maxH = Math.max(...history, 1);
  const minH = Math.min(...history, 0);
  const range = maxH - minH || 1;

  return (
    <div className={clsx('card border-t-2', borderColor)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-text-secondary" />}
          <span className="text-sm text-text-secondary font-medium">{label}</span>
        </div>
        {status === 'critical' && (
          <span className="w-2 h-2 rounded-full bg-accent-red animate-pulse" />
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <span className={clsx('text-2xl font-mono font-semibold', valueColor)}>
          {formatValue(value)}
        </span>
        <span className="text-sm text-text-muted">{unit}</span>
        {trend !== undefined && (
          <span className={clsx('text-xs ml-auto', trend >= 0 ? 'text-accent-green' : 'text-accent-red')}>
            {formatTrend(trend)}
          </span>
        )}
      </div>

      {history.length > 0 && (
        <div className="flex items-end gap-px h-8">
          {history.slice(-20).map((v, i) => (
            <div
              key={i}
              className="flex-1 bg-accent-green/30 rounded-sm min-h-[2px]"
              style={{ height: `${((v - minH) / range) * 100}%` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
