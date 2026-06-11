import { Scale, Zap, FlaskConical, Droplets, Thermometer, Timer } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useSensorData, useTimers } from '../hooks/useSensorData';
import { useThresholds } from '../hooks/useThresholds';
import KpiCard from '../components/ui/KpiCard';
import AlertBanner from '../components/ui/AlertBanner';
import WeightChart from '../components/charts/WeightChart';
import PHChart from '../components/charts/PHChart';
import ECChart from '../components/charts/ECChart';
import clsx from 'clsx';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function Overview() {
  useSensorData();
  const latestReading = useAppStore((s) => s.latestReading);
  const sensorHistory = useAppStore((s) => s.sensorHistory);
  const { statuses } = useThresholds();
  const { data: timers = [] } = useTimers();

  const sortedTimers = [...timers].sort(
    (a, b) => new Date(b._time) - new Date(a._time)
  );
  const activeTimer = sortedTimers.find((t) => t.remaining_s > 0);
  const lastTour = sortedTimers[0] || null;

  const last20 = sensorHistory.slice(-20);

  return (
    <div>
      <AlertBanner />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          label="Substrate Weight"
          value={(latestReading.weight_g / 1000).toFixed(2)}
          unit="kg"
          icon={Scale}
          status={statuses.weight_g}
          history={last20.map((d) => d.weight_g / 1000)}
        />
        <KpiCard
          label="EC"
          value={latestReading.ec_mscm}
          unit="mS/cm"
          icon={Zap}
          status={statuses.ec_mscm}
          history={last20.map((d) => d.ec_mscm)}
        />
        <KpiCard
          label="pH"
          value={latestReading.ph}
          unit=""
          icon={FlaskConical}
          status={statuses.ph}
          history={last20.map((d) => d.ph)}
        />
        <KpiCard
          label="Moisture"
          value={latestReading.soil_pct}
          unit="%"
          icon={Droplets}
          status={statuses.soil_pct}
          history={last20.map((d) => d.soil_pct)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 card">
          <h3 className="text-sm font-medium text-text-secondary mb-2">Weight — Recent</h3>
          <WeightChart />
        </div>
        <div className="card flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={clsx(
                'w-8 h-8 rounded-lg flex items-center justify-center',
                activeTimer ? 'bg-accent-green/10' : 'bg-bg-elevated'
              )}>
                <Timer className={clsx('w-4 h-4', activeTimer ? 'text-accent-green' : 'text-text-muted')} />
              </div>
              <h3 className="text-sm font-medium text-text-primary">Active Tour</h3>
            </div>
            {activeTimer && (
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-green"></span>
              </span>
            )}
          </div>

          {activeTimer ? (
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl font-mono font-bold text-text-primary">Tour #{activeTimer.tour}</span>
                <span className={clsx(
                  'text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wide',
                  activeTimer.type_str === 'irrigation'
                    ? 'bg-accent-green/10 text-accent-green'
                    : 'bg-accent-amber/10 text-accent-amber'
                )}>
                  {activeTimer.type_str}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-xs text-text-secondary mb-1.5">
                  <span>Progress</span>
                  <span className="font-mono font-medium">{activeTimer.pct_done}%</span>
                </div>
                <div className="w-full h-2.5 bg-bg-elevated rounded-full overflow-hidden">
                  <div
                    className={clsx(
                      'h-full rounded-full transition-all duration-500',
                      activeTimer.type_str === 'irrigation' ? 'bg-accent-green' : 'bg-accent-amber'
                    )}
                    style={{ width: `${activeTimer.pct_done}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-bg-elevated rounded-lg p-3 text-center">
                  <p className="text-text-muted text-[10px] uppercase tracking-wider mb-1">Elapsed</p>
                  <p className="font-mono font-bold text-lg text-text-primary">{formatTime(activeTimer.elapsed_s)}</p>
                </div>
                <div className="bg-bg-elevated rounded-lg p-3 text-center">
                  <p className="text-text-muted text-[10px] uppercase tracking-wider mb-1">Remaining</p>
                  <p className="font-mono font-bold text-lg text-accent-amber">{formatTime(activeTimer.remaining_s)}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-4">
              <div className="w-12 h-12 rounded-full bg-bg-elevated flex items-center justify-center mb-3">
                <Timer className="w-6 h-6 text-text-muted" />
              </div>
              <p className="text-text-muted text-sm mb-1">No active tour</p>
              {lastTour && (
                <p className="text-xs text-text-secondary">
                  Last: <span className="font-mono">#{lastTour.tour}</span> — {lastTour.type_str} ({formatTime(lastTour.total_s)})
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card">
          <h3 className="text-sm font-medium text-text-secondary mb-2">pH Gauge</h3>
          <PHChart />
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-text-secondary mb-2">EC Trend</h3>
          <ECChart />
        </div>
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-accent-red/10 flex items-center justify-center">
              <Thermometer className="w-4 h-4 text-accent-red" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-text-primary">Drain Water Temp</h3>
              <p className="text-[10px] text-text-muted uppercase tracking-wider">Real-time</p>
            </div>
          </div>
          <div className="flex items-center justify-center py-4">
            <div className="relative">
              <div className={clsx(
                'text-5xl font-mono font-bold',
                latestReading.temp > 30 ? 'text-accent-red' :
                latestReading.temp > 25 ? 'text-accent-amber' :
                latestReading.temp < 15 ? 'text-accent-blue' : 'text-accent-green'
              )}>
                {latestReading.temp}
              </div>
              <span className="absolute -top-1 -right-6 text-lg text-text-secondary">°C</span>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <div className="text-center py-2 rounded-lg bg-accent-blue/5 border border-accent-blue/10">
              <p className="text-[10px] text-text-muted mb-0.5">Cold</p>
              <p className="text-xs font-mono text-accent-blue">&lt;15°</p>
            </div>
            <div className="text-center py-2 rounded-lg bg-accent-green/5 border border-accent-green/10">
              <p className="text-[10px] text-text-muted mb-0.5">Optimal</p>
              <p className="text-xs font-mono text-accent-green">15-28°</p>
            </div>
            <div className="text-center py-2 rounded-lg bg-accent-red/5 border border-accent-red/10">
              <p className="text-[10px] text-text-muted mb-0.5">Hot</p>
              <p className="text-xs font-mono text-accent-red">&gt;30°</p>
            </div>
          </div>
          <div className="mt-3 w-full h-1.5 rounded-full bg-bg-elevated overflow-hidden">
            <div
              className={clsx(
                'h-full rounded-full transition-all',
                latestReading.temp > 30 ? 'bg-accent-red' :
                latestReading.temp > 25 ? 'bg-accent-amber' :
                latestReading.temp < 15 ? 'bg-accent-blue' : 'bg-accent-green'
              )}
              style={{ width: `${Math.min(100, Math.max(0, ((latestReading.temp - 10) / 30) * 100))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
