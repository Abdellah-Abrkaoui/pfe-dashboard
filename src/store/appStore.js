import { create } from 'zustand';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'dark';
  const stored = localStorage.getItem('theme');
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const useAppStore = create((set) => ({
  latestReading: {
    weight_g: 0,
    ec_mscm: 0,
    ph: 0,
    soil_pct: 0,
    temp: 0,
    input_mL: 0,
    drainage_mL: 0,
    pct_drainage: 0,
    water_used_mL: 0,
    pump: 0,
    drain_pump: 0,
    timestamp: null,
  },
  sensorHistory: [],
  alerts: [],
  sidebarOpen: true,
  theme: getInitialTheme(),

  setLatestReading: (reading) => set({ latestReading: reading }),
  setSensorHistory: (history) => set({ sensorHistory: history }),
  addAlert: (alert) =>
    set((state) => ({ alerts: [alert, ...state.alerts].slice(0, 50) })),
  dismissAlert: (id) =>
    set((state) => ({ alerts: state.alerts.filter((a) => a.id !== id) })),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      document.documentElement.classList.toggle('dark', next === 'dark');
      return { theme: next };
    }),
}));
