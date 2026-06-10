import { Droplets, ArrowDown, Leaf, Download } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useSensorData } from '../hooks/useSensorData';
import AlertBanner from '../components/ui/AlertBanner';
import WaterBalanceChart from '../components/charts/WaterBalanceChart';
import WeightChart from '../components/charts/WeightChart';

export default function WaterBalance() {
  useSensorData();
  const latestReading = useAppStore((s) => s.latestReading);
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
    a.download = 'water_balance.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputL = (latestReading.input_mL / 1000).toFixed(2);
  const drainageL = (latestReading.drainage_mL / 1000).toFixed(2);
  const usedL = (latestReading.water_used_mL / 1000).toFixed(2);
  const efficiency = latestReading.input_mL > 0
    ? Math.round((latestReading.water_used_mL / latestReading.input_mL) * 100)
    : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <AlertBanner />
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary border border-border rounded-btn hover:bg-bg-elevated transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card text-center">
          <Droplets className="w-6 h-6 text-accent-blue mx-auto mb-2" />
          <p className="text-2xl font-mono font-semibold">{inputL} L</p>
          <p className="text-xs text-text-secondary mt-1">Total Input</p>
        </div>
        <div className="card text-center">
          <ArrowDown className="w-6 h-6 text-accent-amber mx-auto mb-2" />
          <p className="text-2xl font-mono font-semibold">{drainageL} L</p>
          <p className="text-xs text-text-secondary mt-1">Drainage ({latestReading.pct_drainage}%)</p>
        </div>
        <div className="card text-center">
          <Leaf className="w-6 h-6 text-accent-green mx-auto mb-2" />
          <p className="text-2xl font-mono font-semibold">{usedL} L</p>
          <p className="text-xs text-text-secondary mt-1">Water Used</p>
        </div>
      </div>

      <div className="card mb-6">
        <h3 className="text-sm font-medium text-text-secondary mb-2">Water Balance — Input vs Drainage</h3>
        <WaterBalanceChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-sm font-medium text-text-secondary mb-2">Weight Evolution</h3>
          <WeightChart />
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-text-secondary mb-4">Water Use Efficiency</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-text-secondary">Efficiency</span>
                <span className="text-sm font-mono font-semibold">{efficiency}%</span>
              </div>
              <div className="w-full h-3 bg-bg-elevated rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-green rounded-full transition-all duration-500"
                  style={{ width: `${efficiency}%` }}
                />
              </div>
            </div>
          </div>
          <p className="text-xs text-text-muted mt-3">
            Efficiency = Water Used / Total Input × 100
          </p>
        </div>
      </div>
    </div>
  );
}
