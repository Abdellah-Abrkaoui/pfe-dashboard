import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../lib/permissions';
import {
  Users,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  AlertCircle,
  UserCircle,
} from 'lucide-react';
import clsx from 'clsx';

export default function UserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      setError('Failed to load users');
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleDeleteUser = async (userId) => {
    if (userId === currentUser.id) {
      setError('You cannot delete your own account');
      return;
    }
    if (!confirm('Are you sure you want to delete this user?')) return;

    const { error } = await supabase.from('profiles').delete().eq('id', userId);
    if (error) {
      setError('Failed to delete user: ' + error.message);
    } else {
      setSuccess('User deleted successfully');
      fetchUsers();
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    if (userId === currentUser.id) {
      setError('You cannot change your own role');
      return;
    }
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);
    if (error) {
      setError('Failed to update role: ' + error.message);
    } else {
      setSuccess('Role updated successfully');
      fetchUsers();
    }
  };

  const handleUpdateName = async (userId, newName) => {
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: newName })
      .eq('id', userId);
    if (error) {
      setError('Failed to update name: ' + error.message);
    } else {
      setSuccess('Name updated successfully');
      setEditingUser(null);
      fetchUsers();
    }
  };

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-accent-green" />
          <h1 className="text-xl font-display font-bold text-text-primary">
            User Management
          </h1>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent-green hover:bg-accent-green/90 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create User
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <AlertCircle className="w-4 h-4 text-accent-red" />
          <span className="text-sm text-accent-red">{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
          <Check className="w-4 h-4 text-accent-green" />
          <span className="text-sm text-accent-green">{success}</span>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 bg-bg-base border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-green text-sm"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 bg-bg-base border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-accent-green"
        >
          <option value="all">All Roles</option>
          <option value={ROLES.ADMIN}>Admin</option>
          <option value={ROLES.OPERATOR}>Operator</option>
        </select>
      </div>

      <div className="bg-bg-surface rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                  User
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Role
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Created
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-text-secondary">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-text-secondary">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <UserRow
                    key={u.id}
                    profile={u}
                    isCurrentUser={u.id === currentUser.id}
                    isEditing={editingUser === u.id}
                    onEdit={() => setEditingUser(u.id)}
                    onCancelEdit={() => setEditingUser(null)}
                    onUpdateName={(name) => handleUpdateName(u.id, name)}
                    onUpdateRole={(role) => handleUpdateRole(u.id, role)}
                    onDelete={() => handleDeleteUser(u.id)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            setSuccess('User created successfully');
            fetchUsers();
          }}
          onError={(msg) => setError(msg)}
        />
      )}
    </div>
  );
}

function UserRow({
  profile,
  isCurrentUser,
  isEditing,
  onEdit,
  onCancelEdit,
  onUpdateName,
  onUpdateRole,
  onDelete,
}) {
  const [editName, setEditName] = useState(profile.full_name || '');

  return (
    <tr className="hover:bg-bg-elevated/50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center">
            <UserCircle className="w-5 h-5 text-text-secondary" />
          </div>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="px-2 py-1 bg-bg-base border border-border rounded text-sm text-text-primary focus:outline-none focus:border-accent-green"
                autoFocus
              />
              <button
                onClick={() => onUpdateName(editName)}
                className="text-accent-green hover:text-accent-green/80"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={onCancelEdit}
                className="text-text-secondary hover:text-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <span className="text-sm text-text-primary font-medium">
              {profile.full_name || 'Unnamed'}
              {isCurrentUser && (
                <span className="ml-2 text-xs text-text-muted">(you)</span>
              )}
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-text-secondary">{profile.email}</td>
      <td className="px-4 py-3">
        <RoleBadge role={profile.role} />
      </td>
      <td className="px-4 py-3 text-sm text-text-secondary">
        {new Date(profile.created_at).toLocaleDateString()}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          {!isCurrentUser && (
            <>
              <select
                value={profile.role}
                onChange={(e) => onUpdateRole(e.target.value)}
                className="px-2 py-1 bg-bg-base border border-border rounded text-xs text-text-primary focus:outline-none focus:border-accent-green"
              >
                <option value={ROLES.ADMIN}>Admin</option>
                <option value={ROLES.OPERATOR}>Operator</option>
              </select>
              <button
                onClick={onEdit}
                className="p-1.5 text-text-secondary hover:text-accent-blue transition-colors"
                title="Edit name"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onDelete}
                className="p-1.5 text-text-secondary hover:text-accent-red transition-colors"
                title="Delete user"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

function RoleBadge({ role }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
        role === ROLES.ADMIN
          ? 'bg-red-500/10 text-red-400'
          : 'bg-blue-500/10 text-blue-400'
      )}
    >
      <span
        className={clsx(
          'w-1.5 h-1.5 rounded-full',
          role === ROLES.ADMIN ? 'bg-red-400' : 'bg-blue-400'
        )}
      />
      {role === ROLES.ADMIN ? 'Admin' : 'Operator'}
    </span>
  );
}

function CreateUserModal({ onClose, onCreated, onError }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState(ROLES.OPERATOR);
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const secondaryClient = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY,
        { auth: { persistSession: false, autoRefreshToken: false } }
      );

      const { data, error } = await secondaryClient.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, role },
        },
      });

      if (error) throw error;
      if (!data.user) throw new Error('User creation failed');

      onCreated();
    } catch (err) {
      onError(err.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-bg-surface rounded-xl border border-border p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-display font-semibold text-text-primary">
            Create New User
          </h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 bg-bg-base border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-green text-sm"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-bg-base border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-green text-sm"
              placeholder="user@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-bg-base border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-green text-sm"
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 bg-bg-base border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent-green text-sm"
            >
              <option value={ROLES.OPERATOR}>Operator</option>
              <option value={ROLES.ADMIN}>Admin</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-accent-green hover:bg-accent-green/90 text-white font-medium rounded-lg transition-colors disabled:opacity-50 text-sm"
          >
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </div>
    </div>
  );
}
