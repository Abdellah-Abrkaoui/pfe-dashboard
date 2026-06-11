import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { UserCircle, Check, AlertCircle } from 'lucide-react';

export default function Settings() {
  const { user, profile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const { error: err } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', user.id);

    if (err) {
      setError('Failed to update profile: ' + err.message);
    } else {
      setSuccess('Profile updated successfully');
    }
    setSaving(false);
    setTimeout(() => { setSuccess(''); setError(''); }, 3000);
  };

  return (
    <div className="max-w-3xl">
      <section className="card mb-6">
        <h3 className="font-display font-semibold mb-4">User Profile</h3>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <AlertCircle className="w-4 h-4 text-accent-red" />
            <span className="text-sm text-accent-red">{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <Check className="w-4 h-4 text-accent-green" />
            <span className="text-sm text-accent-green">{success}</span>
          </div>
        )}

        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-border">
          <div className="w-14 h-14 rounded-full bg-bg-elevated flex items-center justify-center">
            <UserCircle className="w-9 h-9 text-text-secondary" />
          </div>
          <div>
            <p className="text-text-primary font-medium">{profile?.full_name || 'Unnamed'}</p>
            <p className="text-sm text-text-secondary">{user?.email}</p>
            <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-blue-500/15 text-blue-400">
              {profile?.role || 'operator'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="text-xs text-text-muted">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-bg-elevated border border-border rounded-btn text-sm text-text-primary focus:outline-none focus:border-accent-green"
            />
          </div>
          <div>
            <label className="text-xs text-text-muted">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              readOnly
              className="w-full mt-1 px-3 py-2 bg-bg-elevated border border-border rounded-btn text-sm text-text-secondary cursor-not-allowed"
            />
          </div>
          <div>
            <label className="text-xs text-text-muted">Role</label>
            <input
              type="text"
              value={profile?.role || 'operator'}
              readOnly
              className="w-full mt-1 px-3 py-2 bg-bg-elevated border border-border rounded-btn text-sm text-text-secondary cursor-not-allowed capitalize"
            />
          </div>
          <div>
            <label className="text-xs text-text-muted">Member Since</label>
            <input
              type="text"
              value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '—'}
              readOnly
              className="w-full mt-1 px-3 py-2 bg-bg-elevated border border-border rounded-btn text-sm text-text-secondary cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-accent-green hover:bg-accent-green/90 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </section>

      <section className="card mb-6">
        <h3 className="font-display font-semibold mb-4">Connection Settings</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-text-muted">Node-RED API Base URL</label>
            <input
              type="text"
              defaultValue={import.meta.env.VITE_API_BASE_URL || 'http://localhost:1880'}
              readOnly
              className="w-full mt-1 px-3 py-1.5 bg-bg-elevated border border-border rounded-btn text-sm font-mono text-text-secondary"
            />
          </div>
        </div>
      </section>

      <section className="card">
        <h3 className="font-display font-semibold mb-4">About</h3>
        <div className="text-sm text-text-secondary space-y-1">
          <p>Azura v1.0.0</p>
          <p>IoT Precision Agriculture Dashboard</p>
          <p>Backend: Node-RED + InfluxDB</p>
        </div>
      </section>
    </div>
  );
}
