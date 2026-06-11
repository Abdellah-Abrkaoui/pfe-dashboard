import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  Droplets,
  Scale,
  Bell,
  Settings,
  Users,
} from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, adminOnly: false },
  { to: '/monitoring', label: 'Live Sensors', icon: Activity, adminOnly: false },
  { to: '/irrigation', label: 'Irrigation', icon: Droplets, adminOnly: false },
  { to: '/balance', label: 'Water Balance', icon: Scale, adminOnly: false },
  { to: '/events', label: 'Events', icon: Bell, adminOnly: false },
  { to: '/users', label: 'User Management', icon: Users, adminOnly: true },
  { to: '/settings', label: 'Settings', icon: Settings, adminOnly: true },
];

export default function Sidebar() {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const lastTimestamp = useAppStore((s) => s.latestReading.timestamp);
  const apiConnected = !!lastTimestamp;
  const { isAdmin } = useAuth();

  const visibleItems = navItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 h-screen bg-bg-surface border-r border-border flex flex-col z-40 transition-all duration-200',
        sidebarOpen ? 'w-60' : 'w-16'
      )}
    >
      <div className="flex items-center justify-center px-3 h-16 border-b border-border">
        <img src="/logo.png" alt="Azura" className="w-full max-h-12 object-contain" />
      </div>

      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {visibleItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent-green/10 text-accent-green border-l-2 border-accent-green'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
              )
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-3 border-t border-border">
        <div className="flex items-center gap-2">
          <span
            className={clsx(
              'w-2 h-2 rounded-full',
              apiConnected ? 'bg-accent-green animate-pulse' : 'bg-text-muted'
            )}
          />
          {sidebarOpen && (
            <span className="text-xs text-text-secondary">
              {apiConnected ? 'API Connected' : 'No data'}
            </span>
          )}
        </div>
        {sidebarOpen && <p className="text-xs text-text-muted mt-1">v1.0.0</p>}
      </div>
    </aside>
  );
}
