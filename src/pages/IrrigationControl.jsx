import { useAppStore } from '../store/appStore';
import { useSensorData, useTimers } from '../hooks/useSensorData';
import PumpToggle from '../components/ui/PumpToggle';
import AlertBanner from '../components/ui/AlertBanner';
import { Download } from 'lucide-react';
import clsx from 'clsx';

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
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold">Recent Timers</h3>
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
            Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-text-secondary border-b border-border">
                <th className="text-left py-2 px-3 font-medium">Tour #</th>
                <th className="text-left py-2 px-3 font-medium">Type</th>
                <th className="text-left py-2 px-3 font-medium">Elapsed</th>
                <th className="text-left py-2 px-3 font-medium">Total</th>
                <th className="text-left py-2 px-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedTimers.slice(0, 30).map((timer, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-bg-elevated/50">
                  <td className="py-2 px-3 font-mono">#{timer.tour}</td>
                  <td className="py-2 px-3">{timer.type_str}</td>
                  <td className="py-2 px-3 font-mono">{timer.elapsed_s}s</td>
                  <td className="py-2 px-3 font-mono">{timer.total_s}s</td>
                  <td className="py-2 px-3">
                    <span className={clsx(
                      'inline-flex items-center gap-1.5 text-xs',
                      timer.remaining_s > 0 ? 'text-accent-green' : 'text-text-secondary'
                    )}>
                      <span className={clsx(
                        'w-1.5 h-1.5 rounded-full',
                        timer.remaining_s > 0 ? 'bg-accent-green' : 'bg-text-muted'
                      )} />
                      {timer.remaining_s > 0 ? 'Active' : 'Complete'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
