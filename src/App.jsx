import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import PageWrapper from './components/layout/PageWrapper';
import { useSensorData } from './hooks/useSensorData';
import { useAppStore } from './store/appStore';
import Overview from './pages/Overview';
import LiveMonitoring from './pages/LiveMonitoring';
import IrrigationControl from './pages/IrrigationControl';
import WaterBalance from './pages/WaterBalance';
import EventsLogs from './pages/EventsLogs';
import Settings from './pages/Settings';

const routes = [
  { path: '/', element: <Overview />, title: 'Overview Dashboard' },
  { path: '/monitoring', element: <LiveMonitoring />, title: 'Live Monitoring' },
  { path: '/irrigation', element: <IrrigationControl />, title: 'Irrigation Control' },
  { path: '/balance', element: <WaterBalance />, title: 'Water Balance' },
  { path: '/events', element: <EventsLogs />, title: 'Events & Logs' },
  { path: '/settings', element: <Settings />, title: 'Settings' },
];

function AppLayout() {
  useSensorData();
  const theme = useAppStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <TopBar title="AgroSense" />
        <PageWrapper>
          <Routes>
            {routes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Routes>
        </PageWrapper>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
