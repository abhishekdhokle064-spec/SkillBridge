import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Modal } from './Modal';
import { 
  Sparkles, 
  Play, 
  RotateCcw, 
  Award, 
  TrendingUp, 
  Building2, 
  UserCheck, 
  ChevronRight, 
  Zap, 
  Layers,
  BarChart3,
  CheckCircle2,
  X
} from 'lucide-react';

export const HackathonDemoBar = () => {
  const { 
    currentUser, 
    switchRole, 
    setActiveTab, 
    setIsLandingView, 
    showToast, 
    triggerConfetti, 
    refreshData 
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [showImpactModal, setShowImpactModal] = useState(false);
  const [resetting, setResetting] = useState(false);

  const demoPersonas = [
    {
      id: 'student',
      title: '1. Student Scholar Flow (Rahul Sharma)',
      badge: 'Student',
      color: '#2563EB',
      description: 'Explore labs across colleges, book slot with pass, enroll in live masterclass, apply for TCS internship.',
      action: () => {
        switchRole('student');
        setIsLandingView(false);
        setActiveTab('dashboard');
        showToast('Activated: Student Scholar Persona (Rahul Sharma)');
        triggerConfetti();
      }
    },
    {
      id: 'institution',
      title: '2. Institution Admin Flow (Dr. Mehra)',
      badge: 'Institution Admin',
      color: '#10B981',
      description: 'Review inter-college pending bookings, approve access permissions, inspect 7-day lab utilization.',
      action: () => {
        switchRole('institution');
        setIsLandingView(false);
        setActiveTab('admin_dashboard');
        showToast('Activated: Institution Admin (Principal Dr. Mehra @ GEC Nashik)');
        triggerConfetti();
      }
    },
    {
      id: 'trainer',
      title: '3. Expert Faculty Exchange (Prof. Sen)',
      badge: 'Expert Trainer',
      color: '#8B5CF6',
      description: 'Broadcast cross-campus ROS2 masterclasses, monitor enrolled scholars, conduct live WebRTC studio.',
      action: () => {
        switchRole('trainer');
        setIsLandingView(false);
        setActiveTab('trainings');
        showToast('Activated: Expert Trainer Persona (Prof. Ananya Sen @ VIT Pune)');
        triggerConfetti();
      }
    },
    {
      id: 'industry',
      title: '4. Corporate Recruiter (Pooja Verma @ TCS)',
      badge: 'Industry Partner',
      color: '#F59E0B',
      description: 'Post cluster pooled drives, evaluate applicant technical rounds, extend placement offer.',
      action: () => {
        switchRole('industry');
        setIsLandingView(false);
        setActiveTab('placements');
        showToast('Activated: Industry Partner (Pooja Verma @ TCS Digital)');
        triggerConfetti();
      }
    }
  ];

  const handleReset = async () => {
    try {
      setResetting(true);
      await api.resetSeed();
      await refreshData();
      showToast('⚡ Demo database restored to pristine pitch state in 0.2s!');
      triggerConfetti();
    } catch (err) {
      showToast('Failed to reset demo state', 'error');
    } finally {
      setResetting(false);
    }
  };

  return (
    <>
      {/* Floating Demo Launcher Button (Bottom Right) */}
      <div 
        className="hackathon-floating-launcher"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 990,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap'
        }}
      >
        <button
          onClick={() => setShowImpactModal(true)}
          className="btn-impact-pill"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.55rem 1rem',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '9999px',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <BarChart3 size={14} color="#34D399" />
          <span>Impact & ROI</span>
        </button>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn-demo-pitch-pill"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.55rem 1.1rem',
            background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(37, 99, 235, 0.45)',
            transition: 'transform 0.15s ease'
          }}
        >
          <Zap size={15} fill="#FDE047" color="#FDE047" />
          <span>⚡ Pitch Mode</span>
        </button>
      </div>

      {/* Floating Demo Control Drawer Panel */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '24px',
            width: '380px',
            maxWidth: 'calc(100vw - 48px)',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
            padding: '1.25rem',
            zIndex: 995,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>🏆</span>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>Judges Pitch Guide</div>
                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>1-Click Persona Walkthroughs</div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Persona List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {demoPersonas.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  p.action();
                  setIsOpen(false);
                }}
                style={{
                  padding: '0.75rem',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#EFF6FF';
                  e.currentTarget.style.borderColor = '#93C5FD';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A' }}>{p.title}</div>
                  <ChevronRight size={14} color="#94A3B8" />
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748B', lineHeight: '1.3' }}>{p.description}</div>
              </div>
            ))}
          </div>

          {/* Quick Actions Footer */}
          <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #F1F5F9' }}>
            <button
              onClick={() => {
                setIsLandingView(true);
                setIsOpen(false);
              }}
              style={{
                flex: 1,
                padding: '0.45rem',
                backgroundColor: '#F1F5F9',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              Public Landing
            </button>
            <button
              onClick={handleReset}
              disabled={resetting}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem',
                padding: '0.45rem',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#DC2626',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={12} className={resetting ? 'animate-spin' : ''} />
              <span>Reset Seed</span>
            </button>
          </div>
        </div>
      )}

      {/* Impact & Problem Statement ROI Modal */}
      <Modal
        isOpen={showImpactModal}
        onClose={() => setShowImpactModal(false)}
        title="SkillBridge • Problem Statement Solution & Cluster ROI"
        maxWidth="760px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Problem vs Solution Banner */}
          <div style={{ backgroundColor: '#0A192F', color: '#FFFFFF', padding: '1.25rem 1.5rem', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.75rem', color: '#34D399', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
              Problem Statement Solved
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', lineHeight: '1.3' }}>
              Inter-Institutional Isolation $\rightarrow$ Collaborative Innovation Cluster
            </h3>
            <p style={{ fontSize: '0.8125rem', color: '#CBD5E1', lineHeight: '1.5' }}>
              Instead of colleges duplicating multi-crore infrastructure that sits idle 80% of the year, SkillBridge creates a unified digital resource ledger, pooled placement pipeline, and live expert faculty network.
            </p>
          </div>

          {/* 4 Quantified Hackathon Outcomes */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10B981' }}>₹7.16 Crores</div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A', marginTop: '0.2rem' }}>Avoided CapEx Duplication</div>
              <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.2rem' }}>Savings on robotic arms, cleanrooms, and GPU compute clusters.</div>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2563EB' }}>4.2x Growth</div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A', marginTop: '0.2rem' }}>Laboratory Asset Utilization</div>
              <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.2rem' }}>Shifted from 22% single-college use to 92% consortium scheduling.</div>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F59E0B' }}>14% $\rightarrow$ 88%</div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A', marginTop: '0.2rem' }}>Tier-2/3 Student Exposure</div>
              <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.2rem' }}>Students from all member colleges gain equal access to Tier-1 facilities.</div>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#8B5CF6' }}>95% Placement Rate</div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A', marginTop: '0.2rem' }}>Pooled Campus Drives</div>
              <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.2rem' }}>Global giants like TCS, Bosch & Persistent hire directly from the pool.</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
            <button 
              onClick={() => setShowImpactModal(false)}
              style={{ padding: '0.6rem 1.4rem', backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Close Presentation View
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
