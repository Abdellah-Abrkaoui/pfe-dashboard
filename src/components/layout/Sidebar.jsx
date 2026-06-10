import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, Droplets, Scale, Bell, Settings, Leaf } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import clsx from 'clsx';

const navItems = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/monitoring', label: 'Monitoring', icon: Activity },
  { to: '/irrigation', label: 'Irrigation', icon: Droplets },
  { to: '/balance', label: 'Balance', icon: Scale },
  { to: '/events', label: 'Events', icon: Bell },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const lastTimestamp = useAppStore((s) => s.latestReading.timestamp);
  const apiConnected = !!lastTimestamp;

  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 h-screen bg-bg-surface border-r border-border flex flex-col z-40 transition-all duration-200',
        sidebarOpen ? 'w-60' : 'w-16'
      )}
    >
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border">
        <Leaf className="w-7 h-7 text-accent-green flex-shrink-0" />
        {sidebarOpen && (
          <span className="font-display font-bold text-lg text-text-primary">AgroSense</span>
        )}
      </div>

      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map(({ to, label, icon: Icon }) => (
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
