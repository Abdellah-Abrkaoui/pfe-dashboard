import { useState, useEffect } from 'react';
import { Bell, Menu, Sun, Moon, LogOut, UserCircle } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

export default function TopBar({ title }) {
  const [time, setTime] = useState(new Date());
  const { user, profile, signOut, isAdmin, role } = useAuth();
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
  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0];

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

        <div className="flex items-center gap-2.5 pl-3 border-l border-border">
          <div className="w-7 h-7 rounded-full bg-bg-elevated flex items-center justify-center">
            <UserCircle className="w-5 h-5 text-text-secondary" />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-xs text-text-primary font-medium leading-tight">
              {displayName}
            </span>
            <span className="text-[10px] text-text-muted leading-tight">
              {user?.email}
            </span>
          </div>
          <span
            className={clsx(
              'text-[10px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wider',
              isAdmin
                ? 'bg-red-500/15 text-red-400'
                : 'bg-blue-500/15 text-blue-400'
            )}
          >
            {role}
          </span>
          <button
            onClick={signOut}
            className="text-text-secondary hover:text-accent-red transition-colors ml-1"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
