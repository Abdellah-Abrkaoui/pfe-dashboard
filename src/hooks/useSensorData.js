import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getSensorReadings, getTimers } from '../api/sensors';
import { useAppStore } from '../store/appStore';

export function useSensorData() {
  const setLatestReading = useAppStore((s) => s.setLatestReading);
  const setSensorHistory = useAppStore((s) => s.setSensorHistory);

  const query = useQuery({
    queryKey: ['sensors'],
    queryFn: getSensorReadings,
    refetchInterval: 5000,
    staleTime: 3000,
  });

  useEffect(() => {
    if (query.data) {
      if (query.data.latest) {
        setLatestReading(query.data.latest);
      }
      if (query.data.history?.length) {
        setSensorHistory(query.data.history);
      }
    }
  }, [query.data, setLatestReading, setSensorHistory]);

  return query;
}

export function useTimers() {
  return useQuery({
    queryKey: ['timers'],
    queryFn: getTimers,
    refetchInterval: 3000,
    staleTime: 2000,
  });
}

export function useSensorHistory() {
  return useAppStore((s) => s.sensorHistory);
}
