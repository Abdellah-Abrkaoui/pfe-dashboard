import { useState, useEffect, useRef } from 'react';
import { Bell, Menu, Sun, Moon, LogOut, UserCircle } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { useAuth } from '../../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { getEvents } from '../../api/events';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

const ACTION_META = {
  DAY_STARTED: { icon: '🌅', label: 'Day Started' },
  START_IRRIGATION: { icon: '💧', label: 'Irrigation Started' },
  STOP_IRRIGATION: { icon: '✓', label: 'Irrigation Stopped' },
  STOP_DAY: { icon: '🌙', label: 'Day Stopped' },
  IRRIGATION_START: { icon: '💧', label: 'Irrigation Start' },
  IRRIGATION_END: { icon: '✓', label: 'Irrigation End' },
  IRRIGATION_DONE: { icon: '✅', label: 'Irrigation Done' },
  DRAIN_START: { icon: '🔽', label: 'Drain Start' },
  DRAIN_END: { icon: '✓', label: 'Drain End' },
  REPOS_START: { icon: '⏸️', label: 'Repos Start' },
  REPOS_DONE: { icon: '▶️', label: 'Repos Done' },
  ALERT: { icon: '⚠️', label: 'Alert' },
};

export default function TopBar({ title }) {
  const [time, setTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);
  const { user, profile, signOut, isAdmin, role } = useAuth();
  const apiConnected = useAppStore((s) => !!s.latestReading.timestamp);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const navigate = useNavigate();

  const { data: events = [] } = useQuery({
    queryKey: ['events-notif'],
    queryFn: getEvents,
    refetchInterval: 10000,
  });

  const latestEvents = [...events]
    .sort((a, b) => new Date(b._time) - new Date(a._time))
    .slice(0, 5);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0];

  function formatEventDate(timestamp) {
    if (!timestamp) return '';
    const d = new Date(timestamp);
    return d.toLocaleString('sv-SE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).replace('T', ' ');
  }

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

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative text-text-secondary hover:text-text-primary"
          >
            <Bell className="w-5 h-5" />
            {latestEvents.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-red rounded-full text-[10px] flex items-center justify-center text-white font-bold">
                {latestEvents.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-10 w-80 bg-bg-surface border border-border rounded-xl shadow-[var(--shadow-elevated)] z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h4 className="text-sm font-semibold text-text-primary">Recent Events</h4>
                <span className="text-[10px] text-text-muted">{latestEvents.length} latest</span>
              </div>
              <div className="max-h-[400px] overflow-y-auto divide-y divide-border/50">
                {latestEvents.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-text-muted">
                    No recent events
                  </div>
                ) : (
                  latestEvents.map((event, i) => {
                    const meta = ACTION_META[event.action] || { icon: '●', label: event.action };
                    return (
                      <div
                        key={event._time || i}
                        className="px-4 py-3 hover:bg-bg-elevated/50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-lg mt-0.5">{meta.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text-primary">
                              {meta.label}
                            </p>
                            <p className="text-[10px] text-text-muted mt-1 font-mono">
                              {formatEventDate(event._time)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="px-4 py-2.5 border-t border-border">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/events');
                  }}
                  className="w-full text-center text-xs text-accent-green hover:text-accent-green/80 font-medium transition-colors"
                >
                  View all events
                </button>
              </div>
            </div>
          )}
        </div>

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
