import React from 'react';
import { useApp } from '../context/AppContext';
import { SkillBridgeLogo } from './SkillBridgeLogo';
import { 
  Home, 
  Search, 
  Calendar, 
  BookOpen, 
  Briefcase, 
  Building2, 
  Award, 
  Star,
  MessageSquare, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  X
} from 'lucide-react';

export const Sidebar = () => {
  const { 
    activeTab, 
    setActiveTab, 
    isLandingView, 
    setIsLandingView, 
    mobileMenuOpen, 
    setMobileMenuOpen,
    sidebarCollapsed
  } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, badge: null },
    { id: 'resources', label: 'Explore Resources', icon: Search, badge: null },
    { id: 'bookings', label: 'My Bookings', icon: Calendar, badge: null },
    { id: 'trainings', label: 'My Trainings', icon: BookOpen, badge: null },
    { id: 'internships', label: 'Internships', icon: Briefcase, badge: null },
    { id: 'placements', label: 'Placement', icon: Building2, badge: null },
    { id: 'certificates', label: 'Certificates', icon: Award, badge: null },
    { id: 'reviews', label: 'Reviews & Ratings', icon: Star, badge: null },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: 3 },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: 5 },
    { id: 'profile', label: 'Profile', icon: User, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  const handleNavClick = (id) => {
    setIsLandingView(false);
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      <div 
        className={`sidebar-overlay ${mobileMenuOpen ? 'mobile-open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <aside className={`cluster-sidebar ${mobileMenuOpen ? 'mobile-open' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand" style={{ justifyContent: sidebarCollapsed ? 'center' : 'space-between', padding: sidebarCollapsed ? '1.25rem 0.5rem' : '1.35rem 1.25rem' }}>
          {sidebarCollapsed ? (
            <div title="SkillBridge Hub" style={{ cursor: 'pointer' }} onClick={() => setIsLandingView(true)}>
              <SkillBridgeLogo size={32} showText={false} />
            </div>
          ) : (
            <SkillBridgeLogo size={36} textColor="#FFFFFF" subtitleColor="#94A3B8" />
          )}

          {/* Close button on mobile */}
          {mobileMenuOpen && (
            <button 
              onClick={() => setMobileMenuOpen(false)}
              style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0.25rem' }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = !isLandingView && activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`nav-item-btn ${isActive ? 'active' : ''}`}
                title={sidebarCollapsed ? item.label : undefined}
                style={{
                  justifyContent: sidebarCollapsed ? 'center' : 'space-between',
                  padding: sidebarCollapsed ? '0.75rem 0.5rem' : '0.65rem 0.85rem'
                }}
              >
                <div className="nav-item-left" style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start', width: sidebarCollapsed ? '100%' : 'auto' }}>
                  <Icon size={18} />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </div>
                {!sidebarCollapsed && item.badge && (
                  <span className="badge-counter">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Logout */}
        <div className="sidebar-footer" style={{ padding: sidebarCollapsed ? '1rem 0.5rem' : '1rem 1.25rem' }}>
          <button 
            onClick={() => {
              setIsLandingView(true);
              setMobileMenuOpen(false);
            }}
            className="logout-btn"
            title={sidebarCollapsed ? 'Landing Page / Logout' : undefined}
            style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
          >
            <LogOut size={18} />
            {!sidebarCollapsed && <span>Landing Page / Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
