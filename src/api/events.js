import client from './client';

export const getEvents = async () => {
  const { data } = await client.get('/api/events');
  if (!data.ok) return [];
  return data.data;
};
