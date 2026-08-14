import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal } from './Modal';
import { 
  Menu, 
  Search, 
  Bell, 
  ChevronDown, 
  Check, 
  Globe, 
  MessageSquare,
  CheckCircle2,
  Calendar,
  Award,
  Building2,
  X
} from 'lucide-react';

export const Navbar = () => {
  const { 
    currentUser, 
    users, 
    switchUser, 
    isLandingView, 
    setIsLandingView, 
    setActiveTab,
    toggleMenu,
    globalSearchQuery,
    setGlobalSearchQuery
  } = useApp();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: "Booking Approved", desc: "Your slot for Robotics Lab at GEC Nashik on 08 Jun has been approved.", time: "10 mins ago", icon: "🤖" },
    { id: 2, title: "New Internship Posted", desc: "TCS Digital Labs posted 15 new Software Development Intern positions.", time: "1 hour ago", icon: "💼" },
    { id: 3, title: "Masterclass Reminder", desc: "ROS2 Autonomous Navigation starts on 25 Aug at 2:00 PM.", time: "3 hours ago", icon: "👨‍🏫" },
    { id: 4, title: "Credential Minted", desc: "Your Certificate 'Robotics & Automation Specialist' was issued.", time: "1 day ago", icon: "🏆" }
  ];

  return (
    <header className="cluster-topbar">
      {/* Left: Menu toggle and Search Bar */}
      <div className="topbar-left">
        <button 
          className="menu-toggle" 
          onClick={toggleMenu}
          aria-label="Toggle Navigation Menu"
          title="Toggle Navigation Menu"
        >
          <Menu size={22} />
        </button>
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon-pos" />
          <input 
            type="text" 
            placeholder="Search for labs, trainers, courses..." 
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Right: Landing toggle, Bell, Profile Widget */}
      <div className="topbar-right">
        {/* Toggle Landing / Portal View Button */}
        <button
          onClick={() => setIsLandingView(!isLandingView)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 0.8rem',
            background: isLandingView ? '#EFF6FF' : '#F1F5F9',
            border: isLandingView ? '1px solid #93C5FD' : '1px solid #E2E8F0',
            borderRadius: '9999px',
            color: isLandingView ? '#1D4ED8' : '#475569',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <Globe size={14} />
          <span>{isLandingView ? 'App Dashboard' : 'Public Landing'}</span>
        </button>

        {/* Notification Bell with Badge */}
        <button 
          className="notification-bell-btn"
          onClick={() => setShowNotifications(true)}
          title="Cluster Notifications"
        >
          <Bell size={19} />
          <span className="bell-badge-dot" />
        </button>

        {/* User Profile & Role Switcher */}
        <div style={{ position: 'relative' }}>
          <div 
            className="user-profile-widget"
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
          >
            <div className="user-avatar-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #2563EB, #0284C7)', color: '#FFFFFF', fontWeight: 700, fontSize: '0.8rem', borderRadius: '50%' }}>
              {currentUser?.name 
                ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() 
                : 'U'}
            </div>
            <div className="user-info-text">
              <div className="name">{currentUser?.name || 'Guest Scholar'}</div>
              <div className="role" style={{ textTransform: 'capitalize' }}>
                {currentUser?.role === 'institution' ? 'Institution Admin' : (currentUser?.role || 'Student')}
              </div>
            </div>
            <ChevronDown size={14} color="#64748B" />
          </div>

          {/* Role switcher dropdown */}
          {showRoleDropdown && (
            <div 
              style={{
                position: 'absolute',
                right: 0,
                top: '115%',
                width: '290px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
                padding: '0.75rem',
                zIndex: 100
              }}
            >
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', padding: '0.25rem 0.5rem', marginBottom: '0.25rem' }}>
                Switch Interactive Role
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {users.map((u) => {
                  const isSelected = currentUser?.id === u.id;
                  return (
                    <div
                      key={u.id}
                      onClick={() => {
                        switchUser(u.id);
                        setShowRoleDropdown(false);
                        setIsLandingView(false);
                        if (u.role === 'institution') {
                          setActiveTab('admin_dashboard');
                        } else {
                          setActiveTab('dashboard');
                        }
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0.6rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        backgroundColor: isSelected ? '#EFF6FF' : 'transparent',
                        border: isSelected ? '1px solid #BFDBFE' : '1px solid transparent'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {u.avatarImg ? <img src={u.avatarImg} alt={u.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : u.avatar}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A' }}>{u.name}</div>
                          <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{u.title || u.role}</div>
                        </div>
                      </div>
                      {isSelected && <Check size={14} color="#2563EB" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notifications Modal */}
      <Modal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        title="Cluster Notifications & Alerts"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notifications.map(n => (
            <div 
              key={n.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                padding: '0.85rem',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC'
              }}
            >
              <span style={{ fontSize: '1.4rem' }}>{n.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0F172A' }}>{n.title}</div>
                <div style={{ fontSize: '0.8125rem', color: '#475569', marginTop: '2px', lineHeight: '1.4' }}>{n.desc}</div>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '4px' }}>{n.time}</div>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </header>
  );
};
