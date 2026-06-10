import { useAppStore } from '../store/appStore';
import { useSensorData } from '../hooks/useSensorData';
import { Download } from 'lucide-react';
import AlertBanner from '../components/ui/AlertBanner';
import WeightChart from '../components/charts/WeightChart';
import ECChart from '../components/charts/ECChart';
import PHChart from '../components/charts/PHChart';
import TempChart from '../components/charts/TempChart';
import MoistureGauge from '../components/charts/MoistureGauge';

export default function LiveMonitoring() {
  const { isSuccess } = useSensorData();
  const sensorHistory = useAppStore((s) => s.sensorHistory);

  const exportCSV = () => {
    const csv = ['Timestamp,Weight(g),EC(mS/cm),pH,Moisture(%),Temp(°C),Input(mL),Drainage(mL),Drainage(%),WaterUsed(mL),Pump,DrainPump']
      .concat(sensorHistory.map((d) =>
        `${d.timestamp},${d.weight_g},${d.ec_mscm},${d.ph},${d.soil_pct},${d.temp},${d.input_mL},${d.drainage_mL},${d.pct_drainage},${d.water_used_mL},${d.pump},${d.drain_pump}`
      ))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sensor_readings.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <AlertBanner />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isSuccess ? 'bg-accent-green animate-pulse' : 'bg-text-muted'}`} />
          <span className="text-sm text-text-secondary">
            {isSuccess ? 'Polling' : 'Connecting...'}
            {sensorHistory.length > 0 && ` · ${sensorHistory.length} readings`}
          </span>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary border border-border rounded-btn hover:bg-bg-elevated transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="card">
          <h3 className="text-sm font-medium text-text-secondary mb-2">Weight (g) — Live</h3>
          <WeightChart />
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-text-secondary mb-2">EC (mS/cm) — Live</h3>
          <ECChart />
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-text-secondary mb-2">pH — Live</h3>
          <PHChart />
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-text-secondary mb-2">Temperature (°C)</h3>
          <TempChart />
        </div>
      </div>

      <div className="card">
        <h3 className="text-sm font-medium text-text-secondary mb-2">Soil Moisture (%) — Live</h3>
        <MoistureGauge />
      </div>
    </div>
  );
}
