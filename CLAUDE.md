# 🌱 PFE — IoT Precision Agriculture Dashboard

## Full Development Plan for Claude Code

---

## 📋 Project Overview

**Goal:** Build a production-quality React dashboard for real-time IoT precision agriculture monitoring and irrigation control.

**Stack:** React + Vite · Tailwind CSS · Apache ECharts · React Query · Socket.io · FastAPI (mock-ready)

**Design Philosophy:** Dark-mode-first dashboard with a deep forest-green and amber accent palette — inspired by soil, chlorophyll, and industrial sensor hardware. Clean data density over decoration.

---

## 🎨 Design System (Tokens)

### Color Palette

```
--color-bg-base:       #0D1117   /* Near-black background */
--color-bg-surface:    #161B22   /* Card/panel surfaces */
--color-bg-elevated:   #1C2128   /* Elevated elements */
--color-border:        #30363D   /* Subtle borders */
--color-accent-green:  #3FB950   /* Primary accent — healthy/active */
--color-accent-amber:  #D29922   /* Warning / irrigation active */
--color-accent-blue:   #388BFD   /* Info / water metrics */
--color-accent-red:    #F85149   /* Alerts / errors */
--color-text-primary:  #E6EDF3   /* Main text */
--color-text-secondary:#8B949E   /* Labels, metadata */
--color-text-muted:    #484F58   /* Placeholders, disabled */
```

### Typography

```
Display / Headers:  "Space Grotesk" (Google Fonts) — technical, distinctive
Body / Labels:      "Inter" — neutral, readable at small sizes
Monospace / Data:   "JetBrains Mono" — sensor values, timestamps, codes
```

### Spacing Scale

Base unit: `4px`. All spacing in multiples: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64px`

### Border Radius

- Cards: `12px`
- Buttons: `8px`
- Badges/chips: `999px`
- KPI meters: `8px`

### Shadows

```css
--shadow-card: 0 1px 3px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.24);
--shadow-elevated: 0 4px 16px rgba(0, 0, 0, 0.5);
```

---

## 🗂️ Project Structure

```
pfe-dashboard/
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css                  ← Global styles + CSS variables
│   ├── assets/
│   │   └── logo.svg
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx        ← Navigation sidebar
│   │   │   ├── TopBar.jsx         ← Header bar with status
│   │   │   └── PageWrapper.jsx    ← Page content container
│   │   ├── ui/
│   │   │   ├── KpiCard.jsx        ← Sensor KPI cards
│   │   │   ├── StatusBadge.jsx    ← Online/offline/alert badges
│   │   │   ├── PumpToggle.jsx     ← Pump ON/OFF control
│   │   │   ├── ProgressRing.jsx   ← Circular progress indicator
│   │   │   ├── AlertBanner.jsx    ← Threshold alert bar
│   │   │   ├── Tooltip.jsx        ← Custom tooltip
│   │   │   └── LoadingSpinner.jsx
│   │   └── charts/
│   │       ├── WeightChart.jsx    ← Real-time weight line chart
│   │       ├── ECChart.jsx        ← EC time-series chart
│   │       ├── PHChart.jsx        ← pH gauge + history
│   │       ├── TempChart.jsx      ← Temperature chart
│   │       ├── MoistureGauge.jsx  ← Soil moisture radial gauge
│   │       └── WaterBalanceChart.jsx ← Stacked area chart
│   ├── pages/
│   │   ├── Overview.jsx           ← Page 1: Main dashboard
│   │   ├── LiveMonitoring.jsx     ← Page 2: Real-time charts
│   │   ├── IrrigationControl.jsx  ← Page 3: Pump control
│   │   ├── WaterBalance.jsx       ← Page 4: Balance analysis
│   │   ├── EventsLogs.jsx         ← Page 5: History & logs
│   │   └── Settings.jsx           ← Page 6: Config (optional)
│   ├── hooks/
│   │   ├── useSensorData.js       ← React Query hook for sensors
│   │   ├── usePumpControl.js      ← Pump mutation hook
│   │   ├── useWebSocket.js        ← WebSocket real-time hook
│   │   └── useThresholds.js       ← Alert threshold logic
│   ├── api/
│   │   ├── client.js              ← Axios instance + base URL
│   │   ├── sensors.js             ← Sensor API calls
│   │   ├── irrigation.js          ← Irrigation API calls
│   │   └── events.js              ← Events/logs API calls
│   ├── mock/
│   │   ├── mockData.js            ← Realistic mock sensor data
│   │   └── mockWebSocket.js       ← Simulated real-time stream
│   ├── store/
│   │   └── appStore.js            ← Zustand global state
│   └── utils/
│       ├── formatters.js          ← Number/date formatters
│       ├── thresholds.js          ← Alert threshold constants
│       └── colors.js              ← Chart color helpers
├── .env.example
├── vite.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

---

## 📦 Dependencies

### package.json — Required Packages

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.26.0",
    "@tanstack/react-query": "^5.40.0",
    "echarts": "^5.5.0",
    "echarts-for-react": "^3.0.2",
    "socket.io-client": "^4.7.5",
    "axios": "^1.7.2",
    "zustand": "^4.5.4",
    "dayjs": "^1.11.11",
    "clsx": "^2.1.1",
    "lucide-react": "^0.383.0"
  },
  "devDependencies": {
    "vite": "^5.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "tailwindcss": "^3.4.4",
    "postcss": "^8.4.39",
    "autoprefixer": "^10.4.19"
  }
}
```

---

## 🌐 Environment Configuration

### .env.example

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
VITE_MQTT_BROKER=mqtt://localhost:1883
VITE_USE_MOCK=true
```

---

## 🧩 Component Specifications

---

### LAYOUT: `Sidebar.jsx`

**Purpose:** Fixed left navigation with icon + label links.

**Structure:**

```
┌─────────────────┐
│  🌱 AgroSense   │  ← Logo + project name
│─────────────────│
│  ⬡ Overview     │  ← Active state: green left border + bg tint
│  📈 Monitoring  │
│  💧 Irrigation  │
│  ⚖️ Balance     │
│  🔔 Events      │
│  ⚙️ Settings    │
│─────────────────│
│  ● MQTT Live    │  ← Connection status dot
│  v1.0.0         │
└─────────────────┘
```

**Details:**

- Width: `240px` on desktop, collapsible to `64px` icon-only mode on mobile
- Active link: `border-l-2 border-accent-green bg-surface`
- MQTT status dot: pulses green if connected, gray if disconnected
- Logo: SVG leaf icon + "AgroSense" in Space Grotesk bold

---

### LAYOUT: `TopBar.jsx`

**Purpose:** Top header bar showing page title + system status.

**Structure:**

```
┌──────────────────────────────────────────────────────┐
│ Overview Dashboard    [● Online]  [⏱ 14:32:05]  [🔔] │
└──────────────────────────────────────────────────────┘
```

**Details:**

- Live clock (updates every second)
- System status badge (Online/Offline/Warning)
- Notification bell with unread count badge
- Breadcrumb on deeper pages

---

### UI: `KpiCard.jsx`

**Props:**

```js
{
  label: string,          // "Substrate Weight"
  value: number | string, // 3.42
  unit: string,           // "kg"
  icon: ReactNode,        // Lucide icon
  status: "normal" | "warning" | "critical",
  trend: number,          // % change from last hour
  min: number,            // for mini sparkline range
  max: number,
  history: number[]       // last 20 data points for sparkline
}
```

**Layout:**

```
┌────────────────────────────┐
│ ⚖️  Substrate Weight        │
│                            │
│   3.42 kg          ↑ 0.3%  │
│                            │
│  ▁▂▃▄▅▃▄▅▆▇  [sparkline]  │
│  Min: 3.1  Max: 4.0        │
└────────────────────────────┘
```

**Status colors:**

- `normal` → green border-top
- `warning` → amber border-top + amber value text
- `critical` → red border-top + pulsing red dot

---

### UI: `PumpToggle.jsx`

**Purpose:** The primary pump control toggle with safety confirmation.

**Layout:**

```
┌──────────────────────────────────────┐
│  💧 Irrigation Pump                  │
│                                      │
│  ┌─────────────────────────────────┐ │
│  │  Status: ██ INACTIVE            │ │
│  └─────────────────────────────────┘ │
│                                      │
│  [  OFF  ●────────  ] ← Toggle      │
│                                      │
│  Duration: [──10min──]  ← Slider    │
│  [▶ ACTIVATE PUMP]                  │
└──────────────────────────────────────┘
```

**Behavior:**

- Toggle switch animates ON/OFF with color transition (gray → green)
- When switching ON: shows confirmation modal ("Activate pump for X minutes?")
- Active state shows animated water-drop icon + elapsed timer
- Disabled state when safety lock is on

---

### UI: `ProgressRing.jsx`

**Props:** `value`, `max`, `unit`, `label`, `color`

SVG circular progress ring for irrigation timer display. Shows elapsed/remaining time.

---

### CHARTS: `WeightChart.jsx`

**Purpose:** Primary real-time chart — weight is the core metric for water balance.

**Type:** Apache ECharts line chart with gradient fill area

**Config:**

```js
{
  xAxis: { type: 'time', splitLine: { show: false } },
  yAxis: {
    type: 'value',
    name: 'Weight (kg)',
    min: 'dataMin - 0.2',
    max: 'dataMax + 0.2'
  },
  series: [{
    type: 'line',
    smooth: true,
    symbol: 'none',
    lineStyle: { width: 2, color: '#3FB950' },
    areaStyle: {
      color: { type: 'linear', ... gradient from green to transparent }
    }
  }],
  // Mark irrigation events as vertical lines
  markLine: { data: [{ xAxis: irrigationTimestamp }] }
}
```

**Features:**

- Time window selector: Last 1h · 6h · 24h · 7d
- Zoom brush on x-axis
- Irrigation events marked as vertical amber lines
- Tooltip showing exact value + timestamp

---

### CHARTS: `PHChart.jsx`

**Type:** Gauge chart (half-circle) + mini line chart below

**Gauge ranges:**

- 0–5.5: Red (acidic — alert)
- 5.5–6.5: Green (optimal)
- 6.5–7.5: Amber (alkaline warning)
- 7.5–14: Red (too alkaline)

**Config:** ECharts gauge with `splitNumber: 7`, custom color segments

---

### CHARTS: `WaterBalanceChart.jsx`

**Type:** Stacked area chart

**Series:**

1. Input water (irrigation)
2. Drainage
3. Plant uptake (calculated: Input − Drainage − ΔWeight)

**Visual:** Three colored areas stacked, legend at bottom, time on x-axis

---

## 📄 Page Specifications

---

### PAGE 1: `Overview.jsx` — Main Dashboard

**Layout (grid):**

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│  ⚖️ Weight   │  🧪 EC       │  🔬 pH       │  💧 Moisture │
│  3.42 kg     │  1.8 mS/cm   │  6.2         │  68%         │
└──────────────┴──────────────┴──────────────┴──────────────┘
┌──────────────────────────┬───────────────────────────────┐
│  Weight — Last 6h         │  Pump Status                  │
│  [ECharts line chart]     │  ██ INACTIVE                  │
│                           │  Last run: 2h ago · 8 min     │
│                           │  Today: 3 cycles · 24L used   │
└──────────────────────────┴───────────────────────────────┘
┌──────────────┬────────────────────────┬───────────────────┐
│  pH Gauge    │  EC Trend (24h)        │  Temperature      │
│  [half ring] │  [mini area chart]     │  24.3 °C  ↑ 1.2° │
└──────────────┴────────────────────────┴───────────────────┘
```

**Data sources:**

- `/api/sensors/latest` — latest reading for each sensor
- `/api/irrigation/status` — pump status + last event
- Real-time updates via WebSocket on `sensor.update` event

**Refresh:** WebSocket live + React Query polling every 5s as fallback

---

### PAGE 2: `LiveMonitoring.jsx` — Real-Time Charts

**Layout:** 2-column grid of charts, each full-width chart card

```
┌────────────────────────────────────┐
│  [Time Window: 1h · 6h · 24h · 7d]│
└────────────────────────────────────┘
┌──────────────────────┬─────────────────────┐
│  Weight (kg) — Live  │  EC (mS/cm) — Live  │
│  [Line chart]        │  [Line chart]       │
├──────────────────────┼─────────────────────┤
│  pH — Live           │  Temperature (°C)   │
│  [Line chart]        │  [Line chart]       │
└──────────────────────┴─────────────────────┘
┌──────────────────────────────────────────────┐
│  Soil Moisture (%) — Live                    │
│  [Wide area chart]                           │
└──────────────────────────────────────────────┘
```

**Features:**

- Global time window selector applies to all charts simultaneously
- "Live" indicator pulses green when WebSocket is connected
- Each chart has download button (PNG export via ECharts `saveAsImage`)
- Charts scroll into view with smooth animation on page load

---

### PAGE 3: `IrrigationControl.jsx` — Pump Control

**Layout:**

```
┌────────────────────────────┬──────────────────────────────┐
│  Pump Control              │  Active Tour Progress         │
│  [PumpToggle component]    │  [ProgressRing: 4:30 / 10:00]│
│                            │  Tour #7 — Today 14:20        │
├────────────────────────────┴──────────────────────────────┤
│  Schedule & History                                        │
│  ┌──────────┬────────┬─────────┬─────────┬──────────────┐ │
│  │ Tour #   │ Start  │ Duration│ Volume  │ Status       │ │
│  ├──────────┼────────┼─────────┼─────────┼──────────────┤ │
│  │ #7       │ 14:20  │ 10 min  │ 8.2 L   │ ● Active     │ │
│  │ #6       │ 10:05  │ 8 min   │ 6.8 L   │ ✓ Complete   │ │
│  │ #5       │ 07:30  │ 8 min   │ 6.9 L   │ ✓ Complete   │ │
│  └──────────┴────────┴─────────┴─────────┴──────────────┘ │
└────────────────────────────────────────────────────────────┘
```

**Pump Control panel details:**

- Large ON/OFF toggle (50×28px switch)
- Duration slider: 1–60 minutes, stepped by 1 min
- "Activate" button disabled when pump already ON
- Safety: Requires clicking "Confirm" in modal before activation
- Shows real-time elapsed time when pump is active (live countdown)

**API calls:**

- `POST /api/pump/activate` — `{ duration_minutes: number }`
- `POST /api/pump/stop` — emergency stop
- `GET /api/irrigation/tours` — list of recent irrigation tours

---

### PAGE 4: `WaterBalance.jsx` — Water Balance Analysis

**Layout:**

```
┌──────────────┬──────────────┬──────────────┐
│  Total Input │  Drainage    │  Plant Uptake│
│  48.3 L      │  12.1 L      │  36.2 L      │
│  Today       │  Today       │  Estimated   │
└──────────────┴──────────────┴──────────────┘
┌──────────────────────────────────────────────┐
│  Water Balance — Stacked Area Chart (7 days) │
│  [WaterBalanceChart component]               │
└──────────────────────────────────────────────┘
┌──────────────────────────┬───────────────────┐
│  Weight Evolution         │  Efficiency Score │
│  [Line: weight over time] │  Water Use        │
│  Irrigation events marked │  Efficiency: 74%  │
│  as vertical lines        │  [Progress bar]   │
└──────────────────────────┴───────────────────┘
```

**Computed metrics:**

```
Plant Uptake = Water_Input − Drainage − (Weight_end − Weight_start)
Efficiency % = Plant_Uptake / Water_Input × 100
```

---

### PAGE 5: `EventsLogs.jsx` — Events & History

**Layout:**

```
┌──────────────────────────────────────────────────────┐
│  [Filter: All · Irrigation · Alerts · System]        │
│  [Date range picker]          [Export CSV]           │
└──────────────────────────────────────────────────────┘
│  Timeline:                                           │
│  ● 14:20:04  Pump activated — Tour #7 (10 min)       │
│  ⚠ 13:45:11  pH threshold exceeded: 7.3 > 7.0       │
│  ✓ 10:13:52  Pump deactivated — Tour #6 complete     │
│  ℹ 10:05:00  Pump activated — Tour #6 (8 min)        │
│  ...                                                 │
└──────────────────────────────────────────────────────┘
```

**Features:**

- Infinite scroll / pagination (50 events per page)
- Color-coded event types: green (irrigation), amber (warning), red (alert), blue (system)
- Filter chips: All · Irrigation · Alerts · System
- Date range picker (dayjs)
- CSV export button

---

### PAGE 6: `Settings.jsx` — System Configuration

**Sections:**

1. **Alert Thresholds** — sliders for min/max per sensor
2. **Irrigation Schedule** — auto-mode on/off + frequency
3. **Sensor Calibration** — offset values input fields
4. **Connection Settings** — API URL, WebSocket URL

---

## 🔌 API Layer

### `src/api/client.js`

```js
import axios from "axios";
const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  timeout: 10000,
});
// Interceptor: handle errors globally
export default client;
```

### `src/api/sensors.js`

```js
// GET /api/sensors/latest → { weight, ec, ph, moisture, temperature, timestamp }
export const getLatestSensors = () => client.get("/sensors/latest");

// GET /api/sensors/history?sensor=weight&from=ISO&to=ISO&limit=500
export const getSensorHistory = (params) =>
  client.get("/sensors/history", { params });
```

### `src/api/irrigation.js`

```js
// GET  /api/pump/status → { active: bool, duration: int, elapsed: int }
export const getPumpStatus = () => client.get("/pump/status");

// POST /api/pump/activate { duration_minutes: int }
export const activatePump = (data) => client.post("/pump/activate", data);

// POST /api/pump/stop
export const stopPump = () => client.post("/pump/stop");

// GET  /api/irrigation/tours?limit=20
export const getIrrigationTours = (params) =>
  client.get("/irrigation/tours", { params });
```

---

## 🎭 Mock Data Layer

All mock data should simulate realistic IoT sensor behavior. Enable via `VITE_USE_MOCK=true`.

### `src/mock/mockData.js`

**Sensor ranges (realistic for agriculture):**

```js
export const SENSOR_RANGES = {
  weight: { min: 2.5, max: 5.0, unit: "kg", normal: [3.0, 4.5] },
  ec: { min: 0.5, max: 3.5, unit: "mS/cm", normal: [1.2, 2.5] },
  ph: { min: 4.0, max: 8.5, unit: "", normal: [5.5, 6.8] },
  moisture: { min: 20, max: 95, unit: "%", normal: [55, 80] },
  temperature: { min: 15, max: 35, unit: "°C", normal: [20, 28] },
};
```

**Generate realistic time-series:**

- Weight: starts high post-irrigation, gradually decreases (plant transpiration), spikes at each irrigation event
- EC: inverse relationship with watering (dilution effect)
- pH: slow drift with random noise ±0.1
- Moisture: drops between irrigations, spikes during irrigation

### `src/mock/mockWebSocket.js`

Simulates WebSocket by emitting new sensor readings every 2 seconds using `setInterval`.

---

## 🔄 Hooks

### `src/hooks/useSensorData.js`

```js
// React Query hook — fetches latest sensor data, polls every 5s
export const useSensorData = () =>
  useQuery({
    queryKey: ["sensors", "latest"],
    queryFn: getLatestSensors,
    refetchInterval: 5000,
    staleTime: 3000,
  });
```

### `src/hooks/useWebSocket.js`

```js
// Connects to WebSocket, stores latest sensor reading in state
// Falls back to polling if WS disconnected
export const useWebSocket = () => { ... }
```

### `src/hooks/usePumpControl.js`

```js
// React Query mutation for pump activation/stop
export const usePumpControl = () => {
  const activate = useMutation({ mutationFn: activatePump, ... });
  const stop = useMutation({ mutationFn: stopPump, ... });
  return { activate, stop };
};
```

---

## ⚡ Real-Time Architecture

```
Backend WebSocket → useWebSocket hook → Zustand store → Components re-render

store shape:
{
  latestReading: { weight, ec, ph, moisture, temperature, timestamp },
  pumpStatus: { active, duration, elapsed, tourId },
  alerts: [{ id, type, message, timestamp }],
  wsConnected: boolean,
  setLatestReading: fn,
  setPumpStatus: fn,
  addAlert: fn,
  setWsConnected: fn,
}
```

WebSocket event types:

- `sensor.update` — new sensor reading
- `pump.status` — pump state change
- `alert.trigger` — threshold exceeded
- `tour.complete` — irrigation tour finished

---

## 🚨 Alert System

### Threshold defaults (`src/utils/thresholds.js`):

```js
export const DEFAULT_THRESHOLDS = {
  weight: { low: 2.8, high: null }, // Alert if too dry
  ec: { low: 0.8, high: 3.0 },
  ph: { low: 5.5, high: 7.0 },
  moisture: { low: 40, high: 90 },
  temperature: { low: 15, high: 32 },
};
```

Alert banner appears at top of every page when any sensor is out of range. Dismissible per session.

---

## 📱 Responsive Behavior

| Breakpoint | Sidebar       | KPI Grid  | Charts    |
| ---------- | ------------- | --------- | --------- |
| `>1280px`  | Full `240px`  | 4 columns | 2 columns |
| `768–1280` | Full `240px`  | 2 columns | 1 column  |
| `<768px`   | Hidden/drawer | 2 columns | 1 column  |

---

## 🏗️ Build & Setup Instructions for Claude Code

### Step 1 — Scaffold the project

```bash
npm create vite@latest pfe-dashboard -- --template react
cd pfe-dashboard
npm install
```

### Step 2 — Install dependencies

```bash
npm install react-router-dom @tanstack/react-query echarts echarts-for-react socket.io-client axios zustand dayjs clsx lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Step 3 — Configure Tailwind

In `tailwind.config.js`, extend theme with custom colors from the design token system above. Configure `content` to include all `src/**/*.{js,jsx}` files.

### Step 4 — Set up CSS variables

In `src/index.css`, define all CSS variables under `:root`. Apply dark background globally to `body`.

### Step 5 — Set up routing

In `App.jsx`, set up `react-router-dom` with `<BrowserRouter>`. Define routes for all 6 pages inside the `<Sidebar>` + `<TopBar>` layout wrapper.

### Step 6 — Build in this order:

1. `index.css` (tokens + global styles)
2. `Sidebar.jsx` + `TopBar.jsx` + `PageWrapper.jsx`
3. `App.jsx` (routing + layout)
4. `mockData.js` + `mockWebSocket.js`
5. `appStore.js` (Zustand)
6. `api/client.js` + all API files
7. All hooks
8. UI components: `KpiCard`, `StatusBadge`, `PumpToggle`, `ProgressRing`, `AlertBanner`
9. Chart components (ECharts)
10. Pages in order: Overview → LiveMonitoring → IrrigationControl → WaterBalance → EventsLogs → Settings

---

## ✅ Acceptance Criteria

- [ ] All 6 pages render without errors
- [ ] Mock data flows through all charts and KPI cards
- [ ] WebSocket simulation updates data every 2 seconds
- [ ] Pump toggle shows confirmation modal, updates status
- [ ] Alert banner appears when a simulated threshold is exceeded
- [ ] All charts support time window selection
- [ ] Responsive layout works on 768px+ screens
- [ ] No broken imports, no console errors
- [ ] `VITE_USE_MOCK=true` uses mock data, `false` uses real API

---

## 🔮 Future Extensions (Post-PFE)

- [ ] PostgreSQL + user auth (JWT login)
- [ ] Automatic irrigation rules engine (trigger by weight threshold)
- [ ] Mobile app (React Native with same API)
- [ ] Predictive model: estimate next irrigation time from weight trend
- [ ] Multi-plant / multi-zone support

---

_Generated for PFE project — IoT Precision Agriculture Dashboard_
_Stack: React 18 · Vite · Tailwind · Apache ECharts · React Query · Zustand · Socket.io_
