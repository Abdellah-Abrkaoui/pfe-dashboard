import { useState } from 'react';
import { DEFAULT_THRESHOLDS } from '../utils/thresholds';

export default function Settings() {
  const [thresholds, setThresholds] = useState(DEFAULT_THRESHOLDS);

  const updateThreshold = (sensor, bound, value) => {
    setThresholds((prev) => ({
      ...prev,
      [sensor]: { ...prev[sensor], [bound]: Number(value) },
    }));
  };

  return (
    <div className="max-w-3xl">
      <section className="card mb-6">
        <h3 className="font-display font-semibold mb-4">Alert Thresholds</h3>
        <div className="space-y-4">
          {Object.entries(thresholds).map(([sensor, { low, high }]) => (
            <div key={sensor} className="grid grid-cols-3 gap-4 items-center">
              <span className="text-sm text-text-secondary capitalize">{sensor}</span>
              <div>
                <label className="text-xs text-text-muted">Min</label>
                <input
                  type="number"
                  value={low ?? ''}
                  onChange={(e) => updateThreshold(sensor, 'low', e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 bg-bg-elevated border border-border rounded-btn text-sm font-mono text-text-primary focus:outline-none focus:border-accent-green"
                />
              </div>
              <div>
                <label className="text-xs text-text-muted">Max</label>
                <input
                  type="number"
                  value={high ?? ''}
                  onChange={(e) => updateThreshold(sensor, 'high', e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 bg-bg-elevated border border-border rounded-btn text-sm font-mono text-text-primary focus:outline-none focus:border-accent-green"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card mb-6">
        <h3 className="font-display font-semibold mb-4">Connection Settings</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-text-muted">Node-RED API Base URL</label>
            <input
              type="text"
              defaultValue={import.meta.env.VITE_API_BASE_URL || 'http://localhost:1880'}
              readOnly
              className="w-full mt-1 px-3 py-1.5 bg-bg-elevated border border-border rounded-btn text-sm font-mono text-text-secondary"
            />
          </div>
        </div>
      </section>

      <section className="card">
        <h3 className="font-display font-semibold mb-4">About</h3>
        <div className="text-sm text-text-secondary space-y-1">
          <p>AgroSense v1.0.0</p>
          <p>IoT Precision Agriculture Dashboard</p>
          <p>Backend: Node-RED + InfluxDB</p>
        </div>
      </section>
    </div>
  );
}
