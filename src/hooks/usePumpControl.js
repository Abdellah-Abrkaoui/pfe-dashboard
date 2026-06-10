import { useMutation, useQueryClient } from '@tanstack/react-query';
import { startPump, stopPump, startDrainPump, stopDrainPump } from '../api/irrigation';

export function usePumpControl() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['sensors'] });
    queryClient.invalidateQueries({ queryKey: ['timers'] });
  };

  const start = useMutation({
    mutationFn: startPump,
    onSuccess: invalidate,
  });

  const stop = useMutation({
    mutationFn: stopPump,
    onSuccess: invalidate,
  });

  return { start, stop };
}

export function useDrainPumpControl() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['sensors'] });
    queryClient.invalidateQueries({ queryKey: ['timers'] });
  };

  const start = useMutation({
    mutationFn: startDrainPump,
    onSuccess: invalidate,
  });

  const stop = useMutation({
    mutationFn: stopDrainPump,
    onSuccess: invalidate,
  });

  return { start, stop };
}
