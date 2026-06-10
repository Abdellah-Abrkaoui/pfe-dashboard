import { useMemo } from 'react';
import { useAppStore } from '../store/appStore';
import { checkThreshold } from '../utils/thresholds';

export function useThresholds() {
  const latestReading = useAppStore((s) => s.latestReading);

  const statuses = useMemo(() => {
    const result = {};
    const sensorKeys = ['weight_g', 'ec_mscm', 'ph', 'soil_pct', 'temp'];
    sensorKeys.forEach((key) => {
      result[key] = checkThreshold(key, latestReading[key]);
    });
    return result;
  }, [latestReading]);

  const hasAlert = useMemo(
    () => Object.values(statuses).some((s) => s === 'critical' || s === 'warning'),
    [statuses]
  );

  return { statuses, hasAlert };
}
