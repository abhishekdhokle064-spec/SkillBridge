import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Database, 
  Save, 
  RefreshCw, 
  Key, 
  CheckCircle2, 
  Sparkles,
  Building2
} from 'lucide-react';

export const SettingsPage = () => {
  const { currentUser, institutions, showToast, refreshData, activeCluster } = useApp();
  const [activeTab, setActiveTab] = useState('account');
  const [name, setName] = useState(currentUser?.name || 'Rahul Sharma');
  const [email, setEmail] = useState(currentUser?.email || 'rahul.sharma@gecnashik.ac.in');
  const [department, setDepartment] = useState(currentUser?.department || 'Mechanical & Robotics');
  const [institutionId, setInstitutionId] = useState(currentUser?.institutionId || 'inst_1');
  const [notifyBookings, setNotifyBookings] = useState(true);
  const [notifyInternships, setNotifyInternships] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.updateProfile({
        name,
        email,
        department,
        institutionId
      });
      showToast('Settings saved successfully!');
      await refreshData();
    } catch (err) {
      showToast('Failed to update settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleResetData = async () => {
    try {
      setResetting(true);
      await api.resetSeed();
      await refreshData();
      showToast('ClusterConnect database re-seeded to default demo state!');
    } catch (err) {
      showToast('Failed to reset demo data', 'error');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>Platform & Account Settings</h1>
        <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
          Configure institutional permissions, cluster preferences, security keys, and account credentials.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
        {[
          { id: 'account', label: 'Account & Profile', icon: User },
          { id: 'notifications', label: 'Notifications & Alerts', icon: Bell },
          { id: 'security', label: 'Security & Lab Keys', icon: Shield },
          { id: 'system', label: 'System & Demo Tools', icon: Database }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: activeTab === tab.id ? '1px solid #2563EB' : '1px solid transparent',
                backgroundColor: activeTab === tab.id ? '#EFF6FF' : 'transparent',
                color: activeTab === tab.id ? '#1D4ED8' : '#64748B',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Account & Profile */}
      {activeTab === 'account' && (
        <form onSubmit={handleSaveProfile} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>Profile Information</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                Full Name
              </label>
              <input 
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                Academic Email
              </label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                Department
              </label>
              <input 
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                Home Institution
              </label>
              <select 
                value={institutionId}
                onChange={(e) => setInstitutionId(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', backgroundColor: '#FFFFFF' }}
              >
                {institutions.map(i => (
                  <option key={i.id} value={i.id}>{i.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
            <button 
              type="submit"
              disabled={saving}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.5rem', backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)' }}
            >
              <Save size={15} />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Notifications */}
      {activeTab === 'notifications' && (
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>Notification Preferences</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0F172A' }}>Lab Booking Approvals & Reminders</div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Receive instant notifications when lab slots are confirmed.</div>
              </div>
              <input 
                type="checkbox"
                checked={notifyBookings}
                onChange={(e) => setNotifyBookings(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#2563EB' }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0F172A' }}>New Internship & Placement Alerts</div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Get notified when corporate partners post cluster-wide openings.</div>
              </div>
              <input 
                type="checkbox"
                checked={notifyInternships}
                onChange={(e) => setNotifyInternships(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#2563EB' }}
              />
            </label>
          </div>
        </div>
      )}

      {/* Tab 3: Security */}
      {activeTab === 'security' && (
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>Security & Lab Access Keys</h2>

          <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.8125rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10B981', fontWeight: 700, marginBottom: '0.35rem' }}>
              <CheckCircle2 size={16} />
              <span>Active Cluster API Token: CC-TOKEN-MAHA-9941</span>
            </div>
            <div style={{ color: '#64748B' }}>Used for hardware terminal SSH access to high-end Nvidia GPU rigs and 5-axis CNC machines.</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <button 
              onClick={() => showToast('New laboratory access key generated!')}
              style={{ padding: '0.55rem 1.1rem', backgroundColor: '#F1F5F9', color: '#1E293B', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Regenerate API Token
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: System & Demo Tools */}
      {activeTab === 'system' && (
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>Demo Data & System Tools</h2>

          <div style={{ padding: '1rem', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', fontSize: '0.8125rem' }}>
            <div style={{ fontWeight: 700, color: '#DC2626', marginBottom: '0.25rem' }}>Reset Demo Database</div>
            <div style={{ color: '#7F1D1D', marginBottom: '0.75rem' }}>
              Reset all laboratory bookings, candidate rounds, and trainer registrations to default cluster specifications.
            </div>
            <button 
              onClick={handleResetData}
              disabled={resetting}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1.1rem', backgroundColor: '#DC2626', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
            >
              <RefreshCw size={14} className={resetting ? 'animate-spin' : ''} />
              <span>{resetting ? 'Resetting...' : 'Reset Database Now'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
