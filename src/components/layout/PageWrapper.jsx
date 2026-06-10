import { useAppStore } from '../../store/appStore';
import clsx from 'clsx';

export default function PageWrapper({ children }) {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);

  return (
    <main
      className={clsx(
        'transition-all duration-200 min-h-screen pt-14',
        sidebarOpen ? 'ml-60' : 'ml-16'
      )}
    >
      <div className="p-6">{children}</div>
    </main>
  );
}
