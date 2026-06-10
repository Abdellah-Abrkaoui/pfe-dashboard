import client from "./client";

function parseReading(raw) {
  return {
    weight_g: raw.weight_g,
    ec_mscm: raw.ec_mscm,
    ph: raw.ph,
    soil_pct: raw.soil_pct,
    temp: raw.temp,
    input_mL: raw.input_mL,
    drainage_mL: raw.drainage_mL,
    pct_drainage: raw.pct_drainage,
    water_used_mL: raw.water_used_mL,
    pump: raw.pump,
    drain_pump: raw.drain_pump,
    timestamp: raw._time,
  };
}

export const getSensorReadings = async () => {
  const { data } = await client.get("/api/sensors");
  if (!data.ok || !data.data?.length) return { latest: null, history: [] };

  const sorted = [...data.data].sort(
    (a, b) => new Date(b._time) - new Date(a._time)
  );

  const latest = parseReading(sorted[0]);
  const history = sorted.slice(0, 20).reverse().map(parseReading);

  return { latest, history };
};

export const getTimers = async () => {
  const { data } = await client.get("/api/timers");
  if (!data.ok) return [];
  return data.data;
};
