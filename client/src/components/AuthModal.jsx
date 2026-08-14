import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Modal } from './Modal';
import { SkillBridgeLogo } from './SkillBridgeLogo';
import { 
  User, 
  Mail, 
  Lock, 
  Building2, 
  Briefcase, 
  GraduationCap, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  ShieldCheck,
  Zap,
  X
} from 'lucide-react';

export const AuthModal = ({ isOpen, onClose, initialMode = 'login', initialRole = 'student' }) => {
  const { institutions, switchUser, loginUser, showToast, triggerConfetti, setIsLandingView, setActiveTab, refreshData } = useApp();
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [selectedRole, setSelectedRole] = useState(initialRole);
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Sign up state
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('password123');
  const [institutionId, setInstitutionId] = useState(institutions[0]?.id || 'inst_1');
  const [department, setDepartment] = useState('Mechanical & Robotics');
  const [companyName, setCompanyName] = useState('Tata Consultancy Services');
  const [loading, setLoading] = useState(false);

  const demoAccounts = [
    { role: 'student', label: 'Student: Rahul Sharma (GEC Nashik)', email: 'rahul.sharma@gecnashik.ac.in', id: 'user_student_1', icon: '👨‍🎓' },
    { role: 'institution', label: 'Admin: Dr. Mehra (Principal @ GEC Nashik)', email: 'principal@gecnashik.ac.in', id: 'user_admin_1', icon: '👨‍🏫' },
    { role: 'trainer', label: 'Trainer: Prof. Ananya Sen (VIT Pune)', email: 'ananya.sen@vit.edu', id: 'user_trainer_1', icon: '👩‍🔬' },
    { role: 'industry', label: 'Recruiter: Pooja Verma (TCS Digital)', email: 'pooja.v@tcs.com', id: 'user_recruiter_1', icon: '💼' }
  ];

  const handleQuickLogin = (demoAcc) => {
    switchUser(demoAcc.id);
    setIsLandingView(false);
    if (demoAcc.role === 'institution') {
      setActiveTab('admin_dashboard');
    } else if (demoAcc.role === 'trainer') {
      setActiveTab('trainings');
    } else if (demoAcc.role === 'industry') {
      setActiveTab('placements');
    } else {
      setActiveTab('dashboard');
    }
    showToast(`Logged in successfully as ${demoAcc.label.split(':')[1]}`);
    triggerConfetti();
    onClose();
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.login({
        email: loginEmail,
        password: loginPassword,
        role: selectedRole
      });

      if (res.user) {
        loginUser(res.user);
        setIsLandingView(false);
        if (res.user.role === 'institution') {
          setActiveTab('admin_dashboard');
        } else if (res.user.role === 'trainer') {
          setActiveTab('trainings');
        } else if (res.user.role === 'industry') {
          setActiveTab('placements');
        } else {
          setActiveTab('dashboard');
        }
        showToast(res.message || `Welcome back, ${res.user.name}!`);
        triggerConfetti();
        onClose();
      }
    } catch (err) {
      showToast(err.message || 'Login failed. Please verify credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.register({
        name: fullName,
        email: signupEmail,
        password: signupPassword,
        role: selectedRole,
        institutionId: selectedRole === 'industry' ? null : institutionId,
        department: selectedRole === 'industry' ? 'University Talent Acquisition' : department,
        company: selectedRole === 'industry' ? companyName : null,
        title: selectedRole === 'student' ? 'Student Scholar' : `${selectedRole.toUpperCase()} Partner`
      });

      if (res.user) {
        loginUser(res.user);
        setIsLandingView(false);
        if (res.user.role === 'institution') {
          setActiveTab('admin_dashboard');
        } else {
          setActiveTab('dashboard');
        }
        showToast(`🎉 Account registered successfully! Welcome to SkillBridge, ${res.user.name}.`);
        triggerConfetti();
        onClose();
      }
    } catch (err) {
      showToast(err.message || 'Failed to create account', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      maxWidth="540px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Header with SkillBridge Logo */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '1rem' }}>
          <SkillBridgeLogo size={42} textColor="#0F172A" subtitleColor="#64748B" />
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginTop: '0.4rem' }}>
            {mode === 'login' ? 'Welcome Back to SkillBridge' : 'Create Your SkillBridge Account'}
          </h2>
          <p style={{ fontSize: '0.8125rem', color: '#64748B' }}>
            {mode === 'login' 
              ? 'Access shared laboratories, masterclasses, and career opportunities.' 
              : 'Join the inter-institutional collaborative skill network.'}
          </p>
        </div>

        {/* 1-Click Quick Demo Sign-in for Hackathon Judges */}
        <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '0.85rem' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Zap size={14} fill="#2563EB" />
            <span>1-Click Hackathon Evaluator Sign-in:</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
            {demoAccounts.map(d => (
              <button
                key={d.id}
                type="button"
                onClick={() => handleQuickLogin(d)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.6rem',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#1E293B',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.backgroundColor = '#F8FAFC'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
              >
                <span>{d.icon}</span>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.label.split(':')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mode Switcher Tabs (Login vs Register) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', backgroundColor: '#F1F5F9', borderRadius: '8px', padding: '0.25rem' }}>
          <button
            type="button"
            onClick={() => setMode('login')}
            style={{
              padding: '0.5rem',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: mode === 'login' ? '#FFFFFF' : 'transparent',
              color: mode === 'login' ? '#2563EB' : '#64748B',
              boxShadow: mode === 'login' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            style={{
              padding: '0.5rem',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: mode === 'signup' ? '#FFFFFF' : 'transparent',
              color: mode === 'signup' ? '#2563EB' : '#64748B',
              boxShadow: mode === 'signup' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Role Selector Pills */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
            Select Active Role
          </label>
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {[
              { id: 'student', label: '🎓 Student' },
              { id: 'institution', label: '🏛️ Institution' },
              { id: 'trainer', label: '👨‍🏫 Trainer' },
              { id: 'industry', label: '💼 Industry' }
            ].map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRole(r.id)}
                style={{
                  padding: '0.3rem 0.65rem',
                  borderRadius: '9999px',
                  border: selectedRole === r.id ? '1px solid #2563EB' : '1px solid #E2E8F0',
                  backgroundColor: selectedRole === r.id ? '#EFF6FF' : '#FFFFFF',
                  color: selectedRole === r.id ? '#1D4ED8' : '#64748B',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* FORM: LOGIN MODE */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                Academic Email or Username
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input 
                  type="email"
                  required
                  placeholder="e.g. rahul.sharma@gecnashik.ac.in"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.4rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569' }}>
                  Password
                </label>
                <span 
                  onClick={() => showToast('Demo password is: password123')}
                  style={{ fontSize: '0.75rem', color: '#2563EB', cursor: 'pointer', fontWeight: 600 }}
                >
                  Forgot password?
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input 
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.4rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem',
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                marginTop: '0.5rem'
              }}
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to SkillBridge'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* FORM: SIGN UP / REGISTER MODE */}
        {mode === 'signup' && (
          <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                Full Name *
              </label>
              <input 
                type="text"
                required
                placeholder="e.g. Anjali Patil"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                  Email Address *
                </label>
                <input 
                  type="email"
                  required
                  placeholder="name@college.ac.in"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                  Password *
                </label>
                <input 
                  type="password"
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                />
              </div>
            </div>

            {/* Dynamic Role-Based Fields */}
            {selectedRole !== 'industry' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                    Affiliated Institution *
                  </label>
                  <select
                    value={institutionId}
                    onChange={(e) => setInstitutionId(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.8125rem', backgroundColor: '#FFFFFF' }}
                  >
                    {institutions.map(i => (
                      <option key={i.id} value={i.id}>{i.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                    Department / Discipline *
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Computer Engineering"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                  />
                </div>
              </div>
            ) : (
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                  Hiring Enterprise / Company *
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Robert Bosch / Persistent Systems"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem',
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                marginTop: '0.5rem'
              }}
            >
              <span>{loading ? 'Creating Account...' : 'Complete Registration & Enter'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
};
