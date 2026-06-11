import { ShieldX } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-base)] px-4">
      <div className="text-center max-w-md">
        <ShieldX className="w-16 h-16 text-[var(--color-accent-red)] mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] font-display mb-2">
          Access Denied
        </h1>
        <p className="text-[var(--color-text-secondary)] mb-6">
          You do not have permission to access this page. Contact your administrator if you believe this is an error.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-2.5 bg-[var(--color-accent-green)] hover:bg-[var(--color-accent-green)]/90 text-white font-medium rounded-lg transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
