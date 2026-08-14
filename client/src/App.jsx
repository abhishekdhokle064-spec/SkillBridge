import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ResourceDetail } from './pages/ResourceDetail';
import { InternshipPortal } from './pages/InternshipPortal';
import { Resources } from './pages/Resources';
import { Trainers } from './pages/Trainers';
import { Certifications } from './pages/Certifications';
import { Placements } from './pages/Placements';
import { MyBookings } from './pages/MyBookings';
import { MyTrainings } from './pages/MyTrainings';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { MessagesPage } from './pages/MessagesPage';
import { HackathonDemoBar } from './components/HackathonDemoBar';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const { activeTab, toast, loading, isLandingView, currentUser, sidebarCollapsed } = useApp();

  // If user toggled public landing view
  if (isLandingView) {
    return (
      <div>
        {toast && (
          <div 
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              zIndex: 9999,
              backgroundColor: toast.type === 'error' ? '#EF4444' : '#10B981',
              color: '#FFFFFF',
              padding: '0.75rem 1.25rem',
              borderRadius: '8px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 600
            }}
          >
            {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            <span>{toast.message}</span>
          </div>
        )}
        <LandingPage />
      </div>
    );
  }

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return currentUser?.role === 'institution' ? <AdminDashboard /> : <Dashboard />;
      case 'admin_dashboard':
        return <AdminDashboard />;
      case 'resources':
        return <Resources />;
      case 'resource_detail':
        return <ResourceDetail />;
      case 'bookings':
        return <MyBookings />;
      case 'trainings':
        return <MyTrainings />;
      case 'internships':
        return <InternshipPortal />;
      case 'placements':
        return <Placements />;
      case 'certificates':
        return <Certifications />;
      case 'messages':
        return <MessagesPage />;
      case 'notifications':
        return <Dashboard />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC', color: '#0F172A' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            border: '3px solid #E2E8F0',
            borderTopColor: '#2563EB',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }} />
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#64748B' }}>Connecting to SkillBridge...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="cluster-app">
      {/* Toast Notification Container */}
      {toast && (
        <div 
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            backgroundColor: toast.type === 'error' ? '#EF4444' : '#10B981',
            color: '#FFFFFF',
            padding: '0.75rem 1.25rem',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 600
          }}
        >
          {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className={`cluster-main ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <Navbar />

        <div className="cluster-content-body">
          {renderActivePage()}
        </div>

        {/* Hackathon Demo Pitch Mode Toolbar */}
        <HackathonDemoBar />

        {/* Footer */}
        <footer style={{ marginTop: 'auto', padding: '1.75rem 2rem', borderTop: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', textAlign: 'center', fontSize: '0.78rem', color: '#94A3B8' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <p>
              <strong>SkillBridge Platform</strong> • Bridging Skills. Connecting Institutions. Empowering Futures.
            </p>
            <p>
              Unified inter-institutional resource sharing, expert trainers, internships, and placement management.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
