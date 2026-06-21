import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getEvents } from '../api/events';
import { formatDate } from '../utils/formatters';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

const ACTION_TYPES = {
  DAY_STARTED: { icon: '🌅', color: 'text-accent-blue', label: 'Day Started' },
  START_IRRIGATION: { icon: '💧', color: 'text-accent-green', label: 'Irrigation Started' },
  STOP_IRRIGATION: { icon: '✓', color: 'text-accent-green', label: 'Irrigation Stopped' },
  STOP_DAY: { icon: '🌙', color: 'text-accent-amber', label: 'Day Stopped' },
  IRRIGATION_START: { icon: '💧', color: 'text-accent-green', label: 'Irrigation Start' },
  IRRIGATION_END: { icon: '✓', color: 'text-accent-green', label: 'Irrigation End' },
  DRAIN_START: { icon: '🔽', color: 'text-accent-amber', label: 'Drain Start' },
  DRAIN_END: { icon: '✓', color: 'text-accent-amber', label: 'Drain End' },
  REPOS_START: { icon: '⏸️', color: 'text-accent-blue', label: 'Repos Start' },
  REPOS_DONE: { icon: '▶️', color: 'text-accent-blue', label: 'Repos Done' },
  IRRIGATION_DONE: { icon: '✅', color: 'text-accent-green', label: 'Irrigation Done' },
  ALERT: { icon: '⚠️', color: 'text-accent-red', label: 'Alert' },
};

const filters = ['All', 'DAY_STARTED', 'START_IRRIGATION', 'STOP_DAY'];

const PAGE_SIZE = 20;

export default function EventsLogs() {
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(0);

  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
    refetchInterval: 10000,
  });

  const sorted = [...events].sort(
    (a, b) => new Date(b._time) - new Date(a._time)
  );

  const filtered = filter === 'All'
    ? sorted
    : sorted.filter((e) => e.action === filter);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleFilterChange = (f) => {
    setFilter(f);
    setPage(0);
  };

  const exportCSV = () => {
    const csv = ['Timestamp,Action']
      .concat(filtered.map((e) => `${e._time},${e.action}`))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'events.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex gap-1 bg-bg-surface border border-border rounded-btn p-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              className={clsx(
                'px-3 py-1 text-xs font-medium rounded transition-colors',
                filter === f
                  ? 'bg-accent-green/10 text-accent-green'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              {f === 'All' ? 'All' : (ACTION_TYPES[f]?.label || f)}
            </button>
          ))}
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary border border-border rounded-btn hover:bg-bg-elevated transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>

      <div className="card">
        <div className="space-y-0">
          {paginated.map((event, i) => {
            const meta = ACTION_TYPES[event.action] || { icon: '●', color: 'text-text-primary', label: event.action };
            return (
              <div key={i} className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0">
                <span className="text-base mt-0.5">{meta.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={clsx('text-sm font-medium', meta.color)}>
                    {meta.label}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5 font-mono">
                    {formatDate(event._time)}
                  </p>
                </div>
              </div>
            );
          })}
          {paginated.length === 0 && (
            <p className="text-sm text-text-muted text-center py-8">No events found</p>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-border">
            <span className="text-xs text-text-muted">
              Page {page + 1} of {totalPages} · {filtered.length} events
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className={clsx(
                  'p-1.5 rounded-btn border border-border transition-colors',
                  page === 0
                    ? 'text-text-muted cursor-not-allowed'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                )}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className={clsx(
                  'p-1.5 rounded-btn border border-border transition-colors',
                  page >= totalPages - 1
                    ? 'text-text-muted cursor-not-allowed'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                )}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
