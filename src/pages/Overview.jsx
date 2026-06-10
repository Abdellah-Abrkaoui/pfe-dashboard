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
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Timer className="w-5 h-5 text-accent-blue" />
            <h3 className="text-sm font-medium text-text-secondary">Active Tour</h3>
          </div>

          {activeTimer ? (
            <div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-mono font-semibold">Tour #{activeTimer.tour}</span>
                <span className={clsx(
                  'text-xs px-2 py-0.5 rounded-full font-medium',
                  activeTimer.type_str === 'irrigation'
                    ? 'bg-accent-green/10 text-accent-green'
                    : 'bg-accent-amber/10 text-accent-amber'
                )}>
                  {activeTimer.type_str}
                </span>
              </div>

              <div className="mt-3">
                <div className="flex justify-between text-xs text-text-secondary mb-1">
                  <span>Progress</span>
                  <span>{activeTimer.pct_done}%</span>
                </div>
                <div className="w-full h-2 bg-bg-elevated rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent-green rounded-full transition-all duration-500"
                    style={{ width: `${activeTimer.pct_done}%` }}
                  />
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-text-muted text-xs">Elapsed</p>
                  <p className="font-mono font-semibold">{activeTimer.elapsed_s}s</p>
                </div>
                <div>
                  <p className="text-text-muted text-xs">Remaining</p>
                  <p className="font-mono font-semibold">{activeTimer.remaining_s}s</p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-text-muted text-sm mb-3">No active tour</p>
              {lastTour && (
                <div className="text-sm text-text-secondary">
                  <p>Last tour: <span className="font-mono">#{lastTour.tour}</span></p>
                  <p className="text-xs text-text-muted mt-1">{lastTour.type_str} — {lastTour.total_s}s total</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-5 pt-4 border-t border-border">
            <div className="flex items-baseline gap-2">
              <Thermometer className="w-4 h-4 text-accent-red" />
              <span className="text-xl font-mono font-semibold">{latestReading.temp}</span>
              <span className="text-sm text-text-muted">°C</span>
            </div>
          </div>
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
          <h3 className="text-sm font-medium text-text-secondary mb-2">Temperature</h3>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-3xl font-mono font-semibold">{latestReading.temp}</span>
            <span className="text-text-muted">°C</span>
          </div>
        </div>
      </div>
    </div>
  );
}
