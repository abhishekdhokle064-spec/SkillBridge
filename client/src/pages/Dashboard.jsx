import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { 
  Building2, 
  FlaskConical, 
  Users, 
  Briefcase, 
  Trophy, 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Search, 
  BookOpen, 
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Star,
  MessageSquare
} from 'lucide-react';

export const Dashboard = () => {
  const { currentUser, setActiveTab, setSelectedResourceId } = useApp();
  const [resources, setResources] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resData, bookData, revData] = await Promise.all([
          api.getResources(),
          api.getBookings(),
          api.getReviews({ userId: currentUser?.id || 'user_student_1' })
        ]);
        setResources(resData.data?.slice(0, 3) || []);
        setBookings(bookData.data || []);
        setUserReviews(revData.data || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpenDetail = (id) => {
    setSelectedResourceId(id);
    setActiveTab('resource_detail');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* 1. Hero Banner matching Image 1 */}
      <div className="dashboard-hero-banner">
        <div className="hero-left-content">
          <h1 className="hero-title-main">
            Empowering Institutions.<br />
            <span className="hero-title-highlight">Enriching Futures.</span>
          </h1>
          <p className="hero-subtitle">
            A unified platform to share resources, build skills, and create opportunities across the cluster.
          </p>
          <div className="hero-btn-group">
            <button 
              onClick={() => setActiveTab('resources')}
              className="btn-hero-primary"
            >
              Explore Resources
            </button>
            <button 
              onClick={() => setActiveTab('bookings')}
              className="btn-hero-outline"
            >
              View My Bookings
            </button>
          </div>
        </div>

        {/* Hero Vector Illustration on Right */}
        <div style={{ position: 'relative', width: '300px', height: '170px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Stylized Node Network Illustration */}
          <svg viewBox="0 0 320 180" style={{ width: '100%', height: '100%' }}>
            <defs>
              <linearGradient id="gradNode" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#34D399" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Connecting lines */}
            <path d="M 50 90 L 160 50 L 270 90 L 160 140 Z" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="4 4" fill="none" opacity="0.6" />
            <line x1="160" y1="50" x2="160" y2="140" stroke="#34D399" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />

            {/* Central Computer / Monitor */}
            <rect x="115" y="45" width="90" height="60" rx="6" fill="#1E293B" stroke="#60A5FA" strokeWidth="2" />
            <polygon points="160,60 145,70 175,70" fill="#38BDF8" />
            <rect x="157" y="70" width="6" height="12" fill="#FBBF24" />
            <rect x="150" y="105" width="20" height="12" fill="#334155" />
            <rect x="140" y="117" width="40" height="4" rx="2" fill="#64748B" />

            {/* Node 1 - College A */}
            <circle cx="50" cy="90" r="22" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
            <text x="50" y="95" fill="#FFFFFF" fontSize="16" textAnchor="middle">🏛️</text>

            {/* Node 2 - Lab */}
            <circle cx="160" cy="30" r="18" fill="#0F172A" stroke="#34D399" strokeWidth="2" />
            <text x="160" y="35" fill="#FFFFFF" fontSize="14" textAnchor="middle">🧪</text>

            {/* Node 3 - Industry */}
            <circle cx="270" cy="90" r="22" fill="#0F172A" stroke="#F59E0B" strokeWidth="2" />
            <text x="270" y="95" fill="#FFFFFF" fontSize="16" textAnchor="middle">🏢</text>

            {/* Floating particles */}
            <circle cx="90" cy="65" r="4" fill="#34D399" />
            <circle cx="230" cy="65" r="4" fill="#38BDF8" />
            <circle cx="210" cy="120" r="3" fill="#FBBF24" />
          </svg>
        </div>
      </div>

      {/* 2. KPI Stat Cards Row (5 Cards) */}
      <div className="kpi-stat-grid">
        {/* Institutions */}
        <div className="kpi-card-white">
          <div className="kpi-icon-box" style={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}>
            <Building2 size={24} />
          </div>
          <div className="kpi-details">
            <div className="kpi-title">Institutions</div>
            <div className="kpi-number">24</div>
            <div className="kpi-subtitle">Connected</div>
          </div>
        </div>

        {/* Labs Available */}
        <div className="kpi-card-white">
          <div className="kpi-icon-box" style={{ backgroundColor: '#ECFDF5', color: '#10B981' }}>
            <FlaskConical size={24} />
          </div>
          <div className="kpi-details">
            <div className="kpi-title">Labs Available</div>
            <div className="kpi-number">56</div>
            <div className="kpi-subtitle">Across Cluster</div>
          </div>
        </div>

        {/* Active Students */}
        <div className="kpi-card-white">
          <div className="kpi-icon-box" style={{ backgroundColor: '#FFFBEB', color: '#F59E0B' }}>
            <Users size={24} />
          </div>
          <div className="kpi-details">
            <div className="kpi-title">Active Students</div>
            <div className="kpi-number">0</div>
            <div className="kpi-subtitle">Enrolled</div>
          </div>
        </div>

        {/* Internships */}
        <div className="kpi-card-white">
          <div className="kpi-icon-box" style={{ backgroundColor: '#EFF6FF', color: '#0284C7' }}>
            <Briefcase size={24} />
          </div>
          <div className="kpi-details">
            <div className="kpi-title">Internships</div>
            <div className="kpi-number">189</div>
            <div className="kpi-subtitle">Active</div>
          </div>
        </div>

        {/* Placements */}
        <div className="kpi-card-white">
          <div className="kpi-icon-box" style={{ backgroundColor: '#F5F3FF', color: '#8B5CF6' }}>
            <Trophy size={24} />
          </div>
          <div className="kpi-details">
            <div className="kpi-title">Placements</div>
            <div className="kpi-number">0</div>
            <div className="kpi-subtitle">0 Placements</div>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Available Resources (2/3) + Upcoming Bookings (1/3) */}
      <div className="dashboard-middle-grid">
        {/* Left 2/3: Available Resources */}
        <div className="content-section-card">
          <div className="section-header-flex">
            <h2 className="section-title">Available Resources</h2>
            <span 
              onClick={() => setActiveTab('resources')} 
              className="view-all-link"
            >
              View All
            </span>
          </div>

          <div className="resources-tri-grid">
            {resources.map((res) => (
              <div key={res.id} className="resource-item-card">
                <div className="resource-image-wrap">
                  <img src={res.imageUrl} alt={res.title} />
                  <span className="badge-tag-status">Available</span>
                </div>
                <div className="resource-info-body">
                  <h3 className="resource-item-title">{res.title}</h3>
                  <p className="resource-institution-sub">{res.institutionName}</p>

                  <div className="resource-meta-row">
                    <Users size={13} />
                    <span>{res.seatsAvailable || 20} Seats Available</span>
                  </div>

                  <div className="resource-meta-row">
                    <Clock size={13} />
                    <span>{res.availableDates?.split('-')[0] || '10 Aug 2025'}, 10:00 AM</span>
                  </div>

                  <button 
                    onClick={() => handleOpenDetail(res.id)}
                    className="btn-card-action"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1/3: Upcoming Bookings & My Reviews */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Upcoming Bookings */}
          <div className="content-section-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div className="section-header-flex">
                <h2 className="section-title">Upcoming Bookings</h2>
                <span 
                  onClick={() => setActiveTab('bookings')} 
                  className="view-all-link"
                >
                  View All
                </span>
              </div>

              <div className="upcoming-bookings-list">
                {bookings.slice(0, 2).map((bk) => (
                  <div key={bk.id} className="booking-item-row">
                    <div className="booking-item-left">
                      <div className="booking-icon-avatar">
                        {bk.resourceTitle?.includes('Robotics') ? '🤖' : (bk.resourceTitle?.includes('Python') ? '🐍' : '🌐')}
                      </div>
                      <div>
                        <div className="booking-name-title">{bk.resourceTitle}</div>
                        <div className="booking-college-date">
                          {bk.institutionName} • {bk.date}, {bk.timeSlot}
                        </div>
                      </div>
                    </div>
                    <span className={bk.status === 'Confirmed' ? 'status-pill-green' : 'status-pill-orange'}>
                      {bk.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setActiveTab('bookings')}
              className="btn-outline-full"
              style={{ marginTop: '0.75rem' }}
            >
              View All Bookings
            </button>
          </div>

          {/* My Reviews Card */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Star size={16} color="#F59E0B" fill="#F59E0B" />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>My Reviews</h3>
              </div>
              <span 
                onClick={() => setActiveTab('reviews')} 
                style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 600, cursor: 'pointer' }}
              >
                View My Reviews
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F8FAFC', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #F1F5F9', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>⭐ 4.9</div>
                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Average Rating</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#2563EB' }}>{userReviews.length || 3}</div>
                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Reviews Given</div>
              </div>
            </div>

            {userReviews.length > 0 && (
              <div style={{ fontSize: '0.75rem', color: '#475569', backgroundColor: '#FFFBEB', border: '1px solid #FEF3C7', padding: '0.5rem 0.75rem', borderRadius: '6px', marginBottom: '0.75rem' }}>
                <strong>Recent:</strong> "{userReviews[0].reviewText?.slice(0, 60)}..."
              </div>
            )}

            <button 
              onClick={() => setActiveTab('reviews')}
              style={{ width: '100%', padding: '0.5rem', backgroundColor: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Manage My Reviews
            </button>
          </div>
        </div>
      </div>

      {/* 4. Bottom Section: How It Works Diagram */}
      <div className="how-it-works-panel">
        <h2 className="how-it-works-title">How It Works</h2>
        <div className="how-steps-row">
          {/* Step 1: Search */}
          <div className="how-step-box">
            <div className="step-circle-icon">
              <Search size={20} />
            </div>
            <div className="step-info-text">
              <div className="step-number-title">1. Search</div>
              <div className="step-desc">Search for labs, trainers, courses and other resources</div>
            </div>
          </div>

          <div className="step-arrow-divider">→</div>

          {/* Step 2: Book */}
          <div className="how-step-box">
            <div className="step-circle-icon">
              <Calendar size={20} />
            </div>
            <div className="step-info-text">
              <div className="step-number-title">2. Book</div>
              <div className="step-desc">Book the resource for your preferred time</div>
            </div>
          </div>

          <div className="step-arrow-divider">→</div>

          {/* Step 3: Learn & Use */}
          <div className="how-step-box">
            <div className="step-circle-icon">
              <BookOpen size={20} />
            </div>
            <div className="step-info-text">
              <div className="step-number-title">3. Learn & Use</div>
              <div className="step-desc">Utilize the resource and enhance your skills</div>
            </div>
          </div>

          <div className="step-arrow-divider">→</div>

          {/* Step 4: Grow Together */}
          <div className="how-step-box">
            <div className="step-circle-icon">
              <Users size={20} />
            </div>
            <div className="step-info-text">
              <div className="step-number-title">4. Grow Together</div>
              <div className="step-desc">Build connections and grow together</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
