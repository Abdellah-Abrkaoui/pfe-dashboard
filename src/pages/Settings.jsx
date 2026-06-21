import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { UserCircle, Check, AlertCircle, Cpu, Wifi, Database, Leaf, Server, Shield } from 'lucide-react';

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

      <section className="card overflow-hidden">
        <div className="relative px-6 py-5 -mx-4 -mt-4 mb-5 bg-gradient-to-br from-accent-green/10 via-bg-elevated to-accent-blue/5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-accent-green/15 flex items-center justify-center">
              <Leaf className="w-6 h-6 text-accent-green" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-text-primary">Azura</h3>
              <p className="text-xs text-text-secondary">IoT Precision Agriculture Platform</p>
            </div>
            <span className="ml-auto text-[10px] px-2.5 py-1 rounded-full bg-accent-green/10 text-accent-green font-semibold tracking-wider uppercase">
              v1.0.0
            </span>
          </div>
        </div>

        <div className="px-2">
          <p className="text-sm text-text-secondary leading-relaxed mb-5">
            Azura is a real-time IoT precision agriculture monitoring and irrigation control system.
            It provides intelligent water management through sensor-driven automation, helping optimize
            crop yield while minimizing water waste.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-bg-elevated/50 border border-border/50">
              <Cpu className="w-4 h-4 text-accent-green mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-text-primary">ESP32 Microcontroller</p>
                <p className="text-[11px] text-text-muted">Sensor acquisition & MQTT publishing</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-bg-elevated/50 border border-border/50">
              <Wifi className="w-4 h-4 text-accent-blue mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-text-primary">MQTT Protocol</p>
                <p className="text-[11px] text-text-muted">Lightweight real-time messaging</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-bg-elevated/50 border border-border/50">
              <Server className="w-4 h-4 text-accent-amber mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-text-primary">Node-RED Backend</p>
                <p className="text-[11px] text-text-muted">Flow-based processing & REST API</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-bg-elevated/50 border border-border/50">
              <Database className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-text-primary">InfluxDB</p>
                <p className="text-[11px] text-text-muted">Time-series data storage</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-bg-elevated/50 border border-border/50">
              <Shield className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-text-primary">Supabase Auth</p>
                <p className="text-[11px] text-text-muted">Role-based access control (RBAC)</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-bg-elevated/50 border border-border/50">
              <Leaf className="w-4 h-4 text-accent-green mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-text-primary">React + Vite</p>
                <p className="text-[11px] text-text-muted">Modern dashboard with Tailwind CSS</p>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Monitored Parameters</h4>
            <div className="flex flex-wrap gap-2">
              {['Substrate Weight', 'EC', 'pH', 'Soil Moisture', 'Temperature', 'Water Input', 'Drainage', 'Plant Uptake'].map((param) => (
                <span key={param} className="text-[11px] px-2.5 py-1 rounded-full bg-bg-elevated border border-border/50 text-text-secondary">
                  {param}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-border mt-4 pt-4">
            <div className="flex items-center justify-between text-[11px] text-text-muted">
              <span>PFE Project — Master S10</span>
              <span>Hosted on OVH VPS</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
