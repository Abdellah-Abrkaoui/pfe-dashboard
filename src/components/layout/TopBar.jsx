import { useState, useEffect } from 'react';
import { Bell, Menu, Sun, Moon } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import clsx from 'clsx';

export default function TopBar({ title }) {
  const [time, setTime] = useState(new Date());
  const apiConnected = useAppStore((s) => !!s.latestReading.timestamp);
  const alerts = useAppStore((s) => s.alerts);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadCount = alerts.length;

  return (
    <header className="h-14 bg-bg-surface border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="text-text-secondary hover:text-text-primary lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="font-display font-semibold text-lg text-text-primary">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span
            className={clsx(
              'w-2 h-2 rounded-full',
              apiConnected ? 'bg-accent-green' : 'bg-accent-red'
            )}
          />
          <span className="text-xs text-text-secondary">
            {apiConnected ? 'Online' : 'Offline'}
          </span>
        </div>

        <span className="text-sm font-mono text-text-secondary">
          {time.toLocaleTimeString()}
        </span>

        <button
          onClick={toggleTheme}
          className="text-text-secondary hover:text-text-primary transition-colors"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button className="relative text-text-secondary hover:text-text-primary">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-red rounded-full text-[10px] flex items-center justify-center text-white font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
