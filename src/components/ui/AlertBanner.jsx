import { AlertTriangle, X } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

export default function AlertBanner() {
  const alerts = useAppStore((s) => s.alerts);
  const dismissAlert = useAppStore((s) => s.dismissAlert);

  if (alerts.length === 0) return null;

  const latest = alerts[0];

  return (
    <div className="bg-accent-red/10 border border-accent-red/30 rounded-btn px-4 py-2.5 mb-4 flex items-center gap-3">
      <AlertTriangle className="w-4 h-4 text-accent-red flex-shrink-0" />
      <span className="text-sm text-accent-red flex-1">{latest.message}</span>
      {alerts.length > 1 && (
        <span className="text-xs text-accent-red/70">+{alerts.length - 1} more</span>
      )}
      <button onClick={() => dismissAlert(latest.id)} className="text-accent-red/50 hover:text-accent-red">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
