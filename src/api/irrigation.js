import client from './client';

export const startPump = async () => {
  const { data } = await client.post('/api/pump/start');
  return data;
};

export const stopPump = async () => {
  const { data } = await client.post('/api/pump/stop');
  return data;
};

export const startDrainPump = async () => {
  const { data } = await client.post('/api/drain_pump/start');
  return data;
};

export const stopDrainPump = async () => {
  const { data } = await client.post('/api/drain_pump/stop');
  return data;
};
