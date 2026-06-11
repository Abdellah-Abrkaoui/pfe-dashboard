const NVIDIA_BASE_URL = import.meta.env.DEV
  ? '/nvidia-api/v1'
  : 'https://integrate.api.nvidia.com/v1';
const NVIDIA_API_KEY = import.meta.env.VITE_NVIDIA_API_KEY;
const MODEL = 'nvidia/llama-3.3-nemotron-super-49b-v1';

export async function streamChat(messages, _unused, onChunk, onDone, signal) {
  const response = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${NVIDIA_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.6,
      top_p: 0.9,
      max_tokens: 4096,
      stream: true,
    }),
    signal,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API Error: ${response.status} — ${err}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data: ')) continue;
      const data = trimmed.slice(6);
      if (data === '[DONE]') {
        onDone();
        return;
      }
      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onChunk(content);
      } catch {}
    }
  }
  onDone();
}

export function buildSystemPrompt(sensorData, timers) {
  const now = new Date().toLocaleString();
  return `You are Azura AI, the intelligent assistant for the Azura IoT Precision Agriculture Dashboard. You help farmers monitor and manage their irrigation system.

Current Date/Time: ${now}

== LIVE SENSOR DATA ==
- Substrate Weight: ${(sensorData.weight_g / 1000).toFixed(2)} kg (raw: ${sensorData.weight_g}g)
- EC (Electrical Conductivity): ${sensorData.ec_mscm} mS/cm
- pH: ${sensorData.ph}
- Soil Moisture: ${sensorData.soil_pct}%
- Drain Water Temperature: ${sensorData.temp}°C
- Water Input: ${sensorData.input_mL} mL
- Drainage: ${sensorData.drainage_mL} mL
- Drainage Percentage: ${sensorData.pct_drainage}%
- Water Used (Plant Uptake): ${sensorData.water_used_mL} mL
- Irrigation Pump Status: ${sensorData.pump ? 'ON' : 'OFF'}
- Drain Pump Status: ${sensorData.drain_pump ? 'ON' : 'OFF'}
- Last Reading: ${sensorData.timestamp || 'N/A'}

== RECENT IRRIGATION TIMERS ==
${timers.length > 0 ? timers.slice(0, 10).map(t =>
  `- Tour #${t.tour}: ${t.type_str} | Elapsed: ${t.elapsed_s}s | Remaining: ${t.remaining_s}s | Progress: ${t.pct_done}% | Total: ${t.total_s}s`
).join('\n') : 'No recent irrigation data available.'}

== OPTIMAL RANGES ==
- pH: 5.5 – 6.8 (ideal for most crops)
- EC: 1.2 – 2.5 mS/cm
- Soil Moisture: 55 – 80%
- Temperature: 18 – 28°C
- Drainage %: 15 – 30% is recommended

== YOUR BEHAVIOR ==
- Answer concisely and directly about the irrigation system.
- Use the live sensor data above to answer questions.
- If asked about trends, explain based on available data.
- Provide actionable recommendations when relevant.
- Use units (kg, mS/cm, °C, %, mL) in your answers.
- If you don't have enough data to answer, say so honestly.
- Format numbers clearly. Use bullet points for lists.
- You can speak in English or French depending on the user's language.`;
}
