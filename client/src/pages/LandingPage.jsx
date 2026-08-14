import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { SkillBridgeLogo } from '../components/SkillBridgeLogo';
import { AuthModal } from '../components/AuthModal';
import { 
  Search, 
  MapPin, 
  Building2, 
  ArrowRight, 
  Play, 
  GraduationCap, 
  Users, 
  Briefcase, 
  Landmark, 
  CheckCircle, 
  Cpu, 
  Sparkles,
  Calendar,
  Layers
} from 'lucide-react';

export const LandingPage = () => {
  const { setActiveTab, setIsLandingView, setSelectedResourceId, switchRole } = useApp();
  const [resources, setResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState('Robotics Lab');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Auth modal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authRole, setAuthRole] = useState('student');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await api.getResources();
        setResources(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchResources();
  }, []);

  const handleSelectResource = (id) => {
    setSelectedResourceId(id);
    setIsLandingView(false);
    setActiveTab('resource_detail');
  };

  const handleOpenAuth = (mode = 'login', role = 'student') => {
    setAuthMode(mode);
    setAuthRole(role);
    setShowAuthModal(true);
  };

  const handleRoleCardClick = (roleName) => {
    handleOpenAuth('signup', roleName);
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#0F172A', minHeight: '100vh', fontFamily: 'var(--font-main)' }}>
      {/* Top Header */}
      <header style={{ borderBottom: '1px solid #E2E8F0', padding: '1rem 3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)', zIndex: 100 }}>
        <SkillBridgeLogo size={36} textColor="#0F172A" subtitleColor="#64748B" />

        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', fontSize: '0.875rem', fontWeight: 500, color: '#475569' }}>
          <span style={{ color: '#2563EB', fontWeight: 700, cursor: 'pointer' }}>Home</span>
          <span onClick={() => { setIsLandingView(false); setActiveTab('resources'); }} style={{ cursor: 'pointer' }}>Resources</span>
          <span onClick={() => { setIsLandingView(false); setActiveTab('internships'); }} style={{ cursor: 'pointer' }}>Internships</span>
          <span onClick={() => { setIsLandingView(false); setActiveTab('trainings'); }} style={{ cursor: 'pointer' }}>Trainers</span>
          <span onClick={() => { setIsLandingView(false); setActiveTab('dashboard'); }} style={{ cursor: 'pointer' }}>Institutions</span>
          <span onClick={() => handleOpenAuth('login')} style={{ cursor: 'pointer' }}>About</span>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={() => handleOpenAuth('login')}
            style={{ padding: '0.5rem 1.25rem', background: 'transparent', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600, color: '#0F172A', cursor: 'pointer' }}
          >
            Login
          </button>
          <button 
            onClick={() => handleOpenAuth('signup')}
            style={{ padding: '0.5rem 1.25rem', background: '#2563EB', border: 'none', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600, color: '#FFFFFF', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)' }}
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ maxWidth: '1380px', margin: '0 auto', padding: '3.5rem 2rem 2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '3rem', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2.75rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.2', letterSpacing: '-0.02em', marginBottom: '0.85rem' }}>
              SkillBridge: Cluster-Based<br />Skill Development Platform
            </h1>
            <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2563EB', marginBottom: '0.85rem' }}>
              Connecting Institutions. Sharing Resources. Building Skilled India.
            </p>
            <p style={{ fontSize: '0.95rem', color: '#64748B', lineHeight: '1.6', marginBottom: '2rem', maxWidth: '520px' }}>
              A unified platform to share labs, trainers, classrooms and industry opportunities across a cluster of educational institutions for better learning, placements and growth.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button 
                onClick={() => { setIsLandingView(false); setActiveTab('resources'); }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem', background: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)' }}
              >
                <span>Explore Resources</span>
                <ArrowRight size={16} />
              </button>

              <button 
                onClick={() => handleOpenAuth('login')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem', background: '#FFFFFF', color: '#1E293B', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer' }}
              >
                <Play size={15} color="#2563EB" fill="#2563EB" />
                <span>Watch Demo / Sign In</span>
              </button>
            </div>
          </div>

          {/* Hero Image with Floating Pills */}
          <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.2)' }}>
            <img 
              src="https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80" 
              alt="SkillBridge Cluster Campus" 
              style={{ width: '100%', height: '360px', objectFit: 'cover' }}
            />
            {/* Floating Tags */}
            <div style={{ position: 'absolute', top: '24px', left: '30px', background: 'rgba(255, 255, 255, 0.95)', padding: '0.4rem 0.9rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '0.8rem', fontWeight: 700, color: '#1D4ED8' }}>
              <span>🔬</span> Shared Labs
            </div>
            <div style={{ position: 'absolute', top: '90px', left: '15px', background: 'rgba(255, 255, 255, 0.95)', padding: '0.4rem 0.9rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '0.8rem', fontWeight: 700, color: '#7C3AED' }}>
              <span>👨‍🏫</span> Expert Trainers
            </div>
            <div style={{ position: 'absolute', bottom: '80px', left: '30px', background: 'rgba(255, 255, 255, 0.95)', padding: '0.4rem 0.9rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '0.8rem', fontWeight: 700, color: '#0284C7' }}>
              <span>💼</span> Internships
            </div>
            <div style={{ position: 'absolute', bottom: '25px', left: '100px', background: 'rgba(255, 255, 255, 0.95)', padding: '0.4rem 0.9rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '0.8rem', fontWeight: 700, color: '#059669' }}>
              <span>🏆</span> Placements
            </div>
          </div>
        </div>

        {/* 5 Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginTop: '3.5rem', padding: '1.75rem', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1E3A8A' }}>12+</div>
            <div style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>Institutions</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1E3A8A' }}>120+</div>
            <div style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>Labs & Resources</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1E3A8A' }}>0</div>
            <div style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>Students</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1E3A8A' }}>200+</div>
            <div style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>Industry Partners</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1E3A8A' }}>0%</div>
            <div style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>Placement Assistance</div>
          </div>
        </div>
      </section>

      {/* Join As Section */}
      <section style={{ maxWidth: '1380px', margin: '0 auto', padding: '2rem 2rem 4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>Join as</h2>
          <p style={{ fontSize: '0.875rem', color: '#64748B' }}>Together we build a smarter, skill-ready future</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.25rem' }}>
          {/* Student */}
          <div 
            onClick={() => handleRoleCardClick('student')}
            style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.5rem 1rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = '#93C5FD'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', fontSize: '1.4rem' }}>
              🎓
            </div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A' }}>Student</div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.25rem 0 0.75rem' }}>Learn • Build • Grow</div>
            <ArrowRight size={14} color="#2563EB" style={{ margin: '0 auto' }} />
          </div>

          {/* Institution */}
          <div 
            onClick={() => handleRoleCardClick('institution')}
            style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.5rem 1rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = '#93C5FD'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', fontSize: '1.4rem' }}>
              🏛️
            </div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A' }}>Institution</div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.25rem 0 0.75rem' }}>Share Resources</div>
            <ArrowRight size={14} color="#10B981" style={{ margin: '0 auto' }} />
          </div>

          {/* Trainer */}
          <div 
            onClick={() => handleRoleCardClick('trainer')}
            style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.5rem 1rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = '#93C5FD'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#F5F3FF', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', fontSize: '1.4rem' }}>
              👨‍🏫
            </div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A' }}>Trainer</div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.25rem 0 0.75rem' }}>Teach Beyond Borders</div>
            <ArrowRight size={14} color="#8B5CF6" style={{ margin: '0 auto' }} />
          </div>

          {/* Industry */}
          <div 
            onClick={() => handleRoleCardClick('industry')}
            style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.5rem 1rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = '#93C5FD'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FFFBEB', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', fontSize: '1.4rem' }}>
              💼
            </div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A' }}>Industry</div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.25rem 0 0.75rem' }}>Hire Skilled Talent</div>
            <ArrowRight size={14} color="#F59E0B" style={{ margin: '0 auto' }} />
          </div>

          {/* Government */}
          <div 
            onClick={() => handleRoleCardClick('government')}
            style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.5rem 1rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = '#93C5FD'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#ECFEFF', color: '#06B6D4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', fontSize: '1.4rem' }}>
              🏛️
            </div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A' }}>Government</div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.25rem 0 0.75rem' }}>Monitor & Empower</div>
            <ArrowRight size={14} color="#06B6D4" style={{ margin: '0 auto' }} />
          </div>
        </div>
      </section>

      {/* Discover & Book Shared Resources Section */}
      <section style={{ backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>Discover & Book Shared Resources</h2>
            <p style={{ fontSize: '0.875rem', color: '#64748B' }}>Find and access labs, trainers and facilities across institutions</p>
          </div>

          {/* Search Bar Widget with Dropdowns */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input 
                type="text"
                placeholder="Robotics Lab"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.5rem', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '0.875rem', outline: 'none' }}
              />
            </div>

            <select style={{ padding: '0.65rem 1rem', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '0.875rem', color: '#475569', outline: 'none', backgroundColor: '#FFFFFF' }}>
              <option>Any Location</option>
              <option>Nashik, Maharashtra</option>
              <option>Pune, Maharashtra</option>
              <option>Mumbai, Maharashtra</option>
            </select>

            <select style={{ padding: '0.65rem 1rem', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '0.875rem', color: '#475569', outline: 'none', backgroundColor: '#FFFFFF' }}>
              <option>Any Institution</option>
              <option>Government Engineering College, Nashik</option>
              <option>College of Engineering, Pune</option>
              <option>Vishwakarma Institute of Technology</option>
            </select>

            <button 
              onClick={() => { setIsLandingView(false); setActiveTab('resources'); }}
              style={{ padding: '0.65rem 1.75rem', backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Search
            </button>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
            {['All', 'Laboratories', 'Classrooms', 'Equipment', 'Trainers'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: '9999px',
                  border: selectedCategory === cat ? '1px solid #2563EB' : '1px solid #E2E8F0',
                  backgroundColor: selectedCategory === cat ? '#EFF6FF' : '#FFFFFF',
                  color: selectedCategory === cat ? '#1D4ED8' : '#64748B',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Showing Results Grid matching Image 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {resources.map((res) => (
              <div 
                key={res.id}
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <div style={{ height: '170px', position: 'relative' }}>
                    <img src={res.imageUrl} alt={res.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: '#10B981', color: '#FFFFFF', fontSize: '0.7rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '4px' }}>
                      {res.status}
                    </span>
                  </div>

                  <div style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>{res.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#2563EB', fontWeight: 600, marginBottom: '0.75rem' }}>
                      <MapPin size={13} />
                      <span>{res.institutionName} • {res.location}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: '#64748B', marginBottom: '0.5rem' }}>
                      <span>👥 {res.capacity} Seats</span>
                      <span>⚙️ {res.specs?.slice(0, 30)}...</span>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      📅 <strong>Available:</strong> {res.availableDates}
                    </div>
                  </div>
                </div>

                <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #F1F5F9', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <button 
                    onClick={() => handleSelectResource(res.id)}
                    style={{ padding: '0.5rem', backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => handleSelectResource(res.id)}
                    style={{ padding: '0.5rem', backgroundColor: '#2563EB', border: 'none', borderRadius: '6px', fontSize: '0.8125rem', fontWeight: 600, color: '#FFFFFF', cursor: 'pointer' }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fully Functional Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
        initialRole={authRole}
      />
    </div>
  );
};
