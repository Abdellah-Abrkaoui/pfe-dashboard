import { useAppStore } from '../store/appStore';
import { useSensorData, useTimers } from '../hooks/useSensorData';
import PumpToggle from '../components/ui/PumpToggle';
import AlertBanner from '../components/ui/AlertBanner';
import { Download, Clock, Droplets, Wind } from 'lucide-react';
import clsx from 'clsx';

function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return '—';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function formatTime(timestamp) {
  if (!timestamp) return '—';
  const d = new Date(timestamp);
  return d.toLocaleString('sv-SE', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export default function IrrigationControl() {
  useSensorData();
  const latestReading = useAppStore((s) => s.latestReading);
  const { data: timers = [] } = useTimers();

  const sortedTimers = [...timers].sort(
    (a, b) => new Date(b._time) - new Date(a._time)
  );
  const activeTimer = sortedTimers.find((t) => t.remaining_s > 0);
  const lastTour = sortedTimers[0] || null;

  return (
    <div>
      <AlertBanner />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <PumpToggle />
        <div className="card flex flex-col items-center justify-center">
          <h3 className="text-sm font-medium text-text-secondary mb-4">Active Tour Progress</h3>
          {activeTimer ? (
            <div className="w-full">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-xl font-mono font-semibold">Tour #{activeTimer.tour}</span>
                <span className={clsx(
                  'text-xs px-2 py-0.5 rounded-full font-medium',
                  activeTimer.type_str === 'irrigation'
                    ? 'bg-accent-green/10 text-accent-green'
                    : 'bg-accent-amber/10 text-accent-amber'
                )}>
                  {activeTimer.type_str}
                </span>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-xs text-text-secondary mb-1">
                  <span>Progress</span>
                  <span>{activeTimer.pct_done}%</span>
                </div>
                <div className="w-full h-3 bg-bg-elevated rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent-blue rounded-full transition-all duration-500"
                    style={{ width: `${activeTimer.pct_done}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-text-muted text-xs">Elapsed</p>
                  <p className="font-mono font-semibold text-sm">{activeTimer.elapsed_s}s</p>
                </div>
                <div>
                  <p className="text-text-muted text-xs">Remaining</p>
                  <p className="font-mono font-semibold text-sm text-accent-blue">{activeTimer.remaining_s}s</p>
                </div>
                <div>
                  <p className="text-text-muted text-xs">Total</p>
                  <p className="font-mono font-semibold text-sm">{activeTimer.total_s}s</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-text-muted text-sm mb-3">No active tour</p>
              {lastTour && (
                <div className="text-sm text-text-secondary">
                  <p>Last: <span className="font-mono font-semibold">Tour #{lastTour.tour}</span></p>
                  <span className={clsx(
                    'text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block',
                    lastTour.type_str === 'irrigation'
                      ? 'bg-accent-green/10 text-accent-green'
                      : 'bg-accent-amber/10 text-accent-amber'
                  )}>
                    {lastTour.type_str}
                  </span>
                  <p className="text-xs text-text-muted mt-2">{lastTour.total_s}s total</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent-blue/10 flex items-center justify-center">
              <Clock className="w-4.5 h-4.5 text-accent-blue" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-text-primary">Recent Timers</h3>
              <p className="text-[11px] text-text-muted">{sortedTimers.length} sessions recorded</p>
            </div>
          </div>
          <button
            onClick={() => {
              const csv = ['Timestamp,Tour,Type,Elapsed(s),Total(s),Remaining(s),Progress(%)']
                .concat(sortedTimers.map((t) =>
                  `${t._time},${t.tour},${t.type_str},${t.elapsed_s},${t.total_s},${t.remaining_s},${t.pct_done}`
                ))
                .join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'timers.csv';
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary border border-border rounded-btn hover:bg-bg-elevated transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2.5 px-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Tour</th>
                <th className="text-left py-2.5 px-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Type</th>
                <th className="text-left py-2.5 px-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Time</th>
                <th className="text-left py-2.5 px-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Duration</th>
                <th className="text-left py-2.5 px-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Progress</th>
                <th className="text-left py-2.5 px-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedTimers.slice(0, 30).map((timer, i) => {
                const isActive = timer.remaining_s > 0;
                const isIrrigation = timer.type_str === 'irrigation';
                return (
                  <tr
                    key={i}
                    className={clsx(
                      'border-b border-border/30 transition-colors',
                      isActive ? 'bg-accent-green/[0.03]' : 'hover:bg-bg-elevated/50'
                    )}
                  >
                    <td className="py-3 px-3">
                      <span className="font-mono font-semibold text-text-primary">#{timer.tour}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={clsx(
                        'inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-md font-medium',
                        isIrrigation
                          ? 'bg-accent-green/10 text-accent-green'
                          : 'bg-accent-amber/10 text-accent-amber'
                      )}>
                        {isIrrigation
                          ? <Droplets className="w-3 h-3" />
                          : <Wind className="w-3 h-3" />
                        }
                        {timer.type_str}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-xs text-text-secondary">
                        {formatTime(timer._time)}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-col">
                        <span className="font-mono text-text-primary text-xs font-medium">
                          {formatDuration(timer.total_s)}
                        </span>
                        {isActive && (
                          <span className="text-[10px] text-accent-blue font-mono">
                            {formatDuration(timer.remaining_s)} left
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-bg-elevated rounded-full overflow-hidden min-w-[60px]">
                          <div
                            className={clsx(
                              'h-full rounded-full transition-all duration-300',
                              isActive ? 'bg-accent-green' : 'bg-text-muted/40'
                            )}
                            style={{ width: `${timer.pct_done}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-text-muted w-8 text-right">
                          {timer.pct_done}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-accent-green">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-green"></span>
                          </span>
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
                          <span className="w-2 h-2 rounded-full bg-text-muted/40" />
                          Complete
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {sortedTimers.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-text-muted">
                    No timer data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
