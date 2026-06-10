import { useState } from 'react';
import { Droplets, Play, Square } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { usePumpControl, useDrainPumpControl } from '../../hooks/usePumpControl';
import clsx from 'clsx';

export default function PumpToggle() {
  const latestReading = useAppStore((s) => s.latestReading);
  const { start: startPump, stop: stopPump } = usePumpControl();
  const { start: startDrain, stop: stopDrain } = useDrainPumpControl();
  const [showConfirm, setShowConfirm] = useState(null);

  const pumpActive = latestReading.pump === 1;
  const drainActive = latestReading.drain_pump === 1;

  const handleConfirm = () => {
    if (showConfirm === 'pump_start') startPump.mutate();
    else if (showConfirm === 'pump_stop') stopPump.mutate();
    else if (showConfirm === 'drain_start') startDrain.mutate();
    else if (showConfirm === 'drain_stop') stopDrain.mutate();
    setShowConfirm(null);
  };

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-6">
        <Droplets className="w-5 h-5 text-accent-blue" />
        <h3 className="font-display font-semibold">Pump Control</h3>
      </div>

      {/* Irrigation Pump */}
      <div className="mb-6 p-4 bg-bg-elevated rounded-card border border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-medium text-text-primary">Irrigation Pump</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className={clsx(
                'w-2 h-2 rounded-full',
                pumpActive ? 'bg-accent-green animate-pulse' : 'bg-text-muted'
              )} />
              <span className={clsx(
                'text-xs font-medium',
                pumpActive ? 'text-accent-green' : 'text-text-muted'
              )}>
                {pumpActive ? 'RUNNING' : 'STOPPED'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowConfirm('pump_start')}
            disabled={pumpActive}
            className={clsx(
              'py-2.5 rounded-btn text-sm font-medium flex items-center justify-center gap-2 transition-colors',
              pumpActive
                ? 'bg-bg-surface text-text-muted cursor-not-allowed'
                : 'bg-accent-green/10 text-accent-green hover:bg-accent-green/20'
            )}
          >
            <Play className="w-4 h-4" />
            Activate
          </button>
          <button
            onClick={() => setShowConfirm('pump_stop')}
            disabled={!pumpActive}
            className={clsx(
              'py-2.5 rounded-btn text-sm font-medium flex items-center justify-center gap-2 transition-colors',
              !pumpActive
                ? 'bg-bg-surface text-text-muted cursor-not-allowed'
                : 'bg-accent-red/10 text-accent-red hover:bg-accent-red/20'
            )}
          >
            <Square className="w-3.5 h-3.5" />
            Deactivate
          </button>
        </div>
      </div>

      {/* Drain Pump */}
      <div className="p-4 bg-bg-elevated rounded-card border border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-medium text-text-primary">Drain Pump</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className={clsx(
                'w-2 h-2 rounded-full',
                drainActive ? 'bg-accent-amber animate-pulse' : 'bg-text-muted'
              )} />
              <span className={clsx(
                'text-xs font-medium',
                drainActive ? 'text-accent-amber' : 'text-text-muted'
              )}>
                {drainActive ? 'RUNNING' : 'STOPPED'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowConfirm('drain_start')}
            disabled={drainActive}
            className={clsx(
              'py-2.5 rounded-btn text-sm font-medium flex items-center justify-center gap-2 transition-colors',
              drainActive
                ? 'bg-bg-surface text-text-muted cursor-not-allowed'
                : 'bg-accent-amber/10 text-accent-amber hover:bg-accent-amber/20'
            )}
          >
            <Play className="w-4 h-4" />
            Activate
          </button>
          <button
            onClick={() => setShowConfirm('drain_stop')}
            disabled={!drainActive}
            className={clsx(
              'py-2.5 rounded-btn text-sm font-medium flex items-center justify-center gap-2 transition-colors',
              !drainActive
                ? 'bg-bg-surface text-text-muted cursor-not-allowed'
                : 'bg-accent-red/10 text-accent-red hover:bg-accent-red/20'
            )}
          >
            <Square className="w-3.5 h-3.5" />
            Deactivate
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-bg-surface border border-border rounded-card max-w-sm mx-4 p-6 shadow-elevated">
            <h4 className="font-display font-semibold mb-2">Confirm Action</h4>
            <p className="text-sm text-text-secondary mb-4">
              {showConfirm === 'pump_start' && 'Activate the irrigation pump?'}
              {showConfirm === 'pump_stop' && 'Deactivate the irrigation pump?'}
              {showConfirm === 'drain_start' && 'Activate the drain pump?'}
              {showConfirm === 'drain_stop' && 'Deactivate the drain pump?'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(null)}
                className="flex-1 py-2 bg-bg-elevated text-text-secondary rounded-btn text-sm hover:bg-border transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className={clsx(
                  'flex-1 py-2 rounded-btn text-sm font-medium transition-colors text-white',
                  showConfirm.includes('stop')
                    ? 'bg-accent-red hover:bg-accent-red/80'
                    : 'bg-accent-green hover:bg-accent-green/80'
                )}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
