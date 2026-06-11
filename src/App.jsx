import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import PageWrapper from './components/layout/PageWrapper';
import { useSensorData } from './hooks/useSensorData';
import { useAppStore } from './store/appStore';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import AdminRoute from './components/auth/AdminRoute';
import Overview from './pages/Overview';
import LiveMonitoring from './pages/LiveMonitoring';
import IrrigationControl from './pages/IrrigationControl';
import WaterBalance from './pages/WaterBalance';
import EventsLogs from './pages/EventsLogs';
import Settings from './pages/Settings';
import UserManagement from './pages/UserManagement';
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';
import AiAssistant from './components/ui/AiAssistant';

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
        <TopBar title="Azura" />
        <PageWrapper>
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/monitoring" element={<LiveMonitoring />} />
            <Route path="/irrigation" element={<IrrigationControl />} />
            <Route path="/balance" element={<WaterBalance />} />
            <Route path="/events" element={<EventsLogs />} />
            <Route
              path="/users"
              element={
                <AdminRoute>
                  <UserManagement />
                </AdminRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <AdminRoute>
                  <Settings />
                </AdminRoute>
              }
            />
          </Routes>
        </PageWrapper>
      </div>
      <AiAssistant />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <AppLayout />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
