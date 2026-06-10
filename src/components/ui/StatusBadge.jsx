import clsx from 'clsx';

export default function StatusBadge({ status = 'online', label }) {
  const config = {
    online: { color: 'bg-accent-green', text: 'text-accent-green', bg: 'bg-accent-green/10' },
    offline: { color: 'bg-text-muted', text: 'text-text-muted', bg: 'bg-bg-elevated' },
    warning: { color: 'bg-accent-amber', text: 'text-accent-amber', bg: 'bg-accent-amber/10' },
    active: { color: 'bg-accent-blue', text: 'text-accent-blue', bg: 'bg-accent-blue/10' },
  }[status] || { color: 'bg-text-muted', text: 'text-text-secondary', bg: 'bg-bg-elevated' };

  return (
    <span className={clsx('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-chip text-xs font-medium', config.bg, config.text)}>
      <span className={clsx('w-1.5 h-1.5 rounded-full', config.color)} />
      {label || status}
    </span>
  );
}
