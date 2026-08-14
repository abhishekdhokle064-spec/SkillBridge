import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Modal } from '../components/Modal';
import { 
  Building2, 
  Search, 
  Calendar, 
  DollarSign, 
  Users, 
  CheckCircle2, 
  Plus, 
  ChevronRight, 
  Award, 
  Sparkles,
  Trophy,
  MapPin,
  TrendingUp
} from 'lucide-react';

export const Placements = () => {
  const { currentUser, showToast, triggerConfetti, refreshData } = useApp();
  const [drives, setDrives] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [activeTab, setActiveTab] = useState('drives'); // 'drives' | 'candidates'
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // New Drive Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDrive, setNewDrive] = useState({
    companyName: '',
    role: '',
    packageCtc: '₹14 - ₹20 LPA',
    driveDate: '2025-09-20',
    registrationDeadline: '2025-09-10',
    minCgpa: 7.5,
    eligibleBranches: 'Mechanical, Robotics, CSE, ECE',
    openings: 25,
    description: 'Joint cluster-wide pooled recruitment drive open to all member colleges.',
    logo: '🏢'
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [drvRes, candRes] = await Promise.all([
        api.getPlacementDrives({ search: searchQuery }),
        api.getCandidates()
      ]);
      setDrives(drvRes.data || []);
      setCandidates(candRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchQuery]);

  const handleRegisterForDrive = async (drive) => {
    try {
      await api.registerForDrive(drive.id, {
        studentUserId: currentUser?.id || 'user_student_1',
        studentName: currentUser?.name || 'Rahul Sharma',
        studentInstitutionName: currentUser?.institutionName || 'GEC Nashik',
        cgpa: currentUser?.cgpa || 9.12,
        department: currentUser?.department || 'Mechanical & Robotics'
      });

      showToast(`Registered for ${drive.companyName} Pooled Placement Drive! Hall Ticket generated.`);
      triggerConfetti();
      await loadData();
      await refreshData();
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
    }
  };

  const handleAdvanceCandidate = async (candidateId, nextRound, status, offeredCtc) => {
    try {
      await api.advanceCandidate(candidateId, {
        nextRound,
        status,
        offeredCtc
      });

      if (status === 'offered') {
        showToast('🎉 Placement Offer extended to candidate! Offer Letter dispatched.');
        triggerConfetti();
      } else {
        showToast(`Candidate advanced to '${nextRound}'`);
      }

      await loadData();
    } catch (err) {
      showToast('Failed to update candidate status', 'error');
    }
  };

  const handleCreateDrive = async (e) => {
    e.preventDefault();
    try {
      await api.createPlacementDrive(newDrive);
      showToast(`Pooled Drive '${newDrive.companyName} - ${newDrive.role}' launched across all cluster colleges!`);
      setShowCreateModal(false);
      await loadData();
    } catch (err) {
      showToast(err.message || 'Failed to create drive', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>Centralized Cluster Placement Management</h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
            Pooled campus recruitment drives attracting premier global enterprises across all member colleges.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', backgroundColor: '#F1F5F9', borderRadius: '8px', padding: '0.25rem' }}>
            <button 
              onClick={() => setActiveTab('drives')}
              style={{
                padding: '0.4rem 0.9rem',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: activeTab === 'drives' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'drives' ? '#1D4ED8' : '#64748B',
                boxShadow: activeTab === 'drives' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              Pooled Drives ({drives.length})
            </button>
            <button 
              onClick={() => setActiveTab('candidates')}
              style={{
                padding: '0.4rem 0.9rem',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: activeTab === 'candidates' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'candidates' ? '#1D4ED8' : '#64748B',
                boxShadow: activeTab === 'candidates' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              Candidate Pipeline ({candidates.length})
            </button>
          </div>

          {(currentUser?.role === 'institution' || currentUser?.role === 'admin' || currentUser?.role === 'industry') && (
            <button 
              onClick={() => setShowCreateModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1.1rem', backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)' }}
            >
              <Plus size={16} />
              <span>Launch Pooled Drive</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Placement KPI Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#8B5CF6' }}>342</div>
          <div style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: '0.2rem' }}>Placements This Year</div>
        </div>
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10B981' }}>₹18.4 LPA</div>
          <div style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: '0.2rem' }}>Average CTC Package</div>
        </div>
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2563EB' }}>200+</div>
          <div style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: '0.2rem' }}>Industry Hiring Partners</div>
        </div>
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F59E0B' }}>95%</div>
          <div style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: '0.2rem' }}>Placement Assistance</div>
        </div>
      </div>

      {activeTab === 'drives' ? (
        <>
          {/* Search bar */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input 
                type="text"
                placeholder="Search recruiter company, role, package CTC, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.5rem', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '0.875rem', outline: 'none', backgroundColor: '#F8FAFC' }}
              />
            </div>
          </div>

          {/* Drives Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
            {drives.map((drv) => (
              <div 
                key={drv.id}
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                        {drv.logo || '🏢'}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748B' }}>{drv.companyName}</div>
                        <span style={{ backgroundColor: '#ECFDF5', color: '#059669', fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                          Cluster Pooled Drive
                        </span>
                      </div>
                    </div>
                    <span style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '99px' }}>
                      {drv.openings} Positions
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>
                    {drv.role}
                  </h3>

                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10B981', marginBottom: '0.75rem' }}>
                    {drv.packageCtc}
                  </div>

                  <p style={{ fontSize: '0.8125rem', color: '#64748B', lineHeight: '1.4', marginBottom: '1rem' }}>
                    {drv.description}
                  </p>

                  <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.75rem', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '1rem' }}>
                    <div>📅 <strong>Drive Date:</strong> {drv.driveDate} (Deadline: {drv.registrationDeadline})</div>
                    <div>🎯 <strong>Eligibility:</strong> Min {drv.minCgpa} CGPA ({drv.eligibleBranches})</div>
                    <div>📍 <strong>Venue:</strong> {drv.location}</div>
                  </div>

                  {/* Rounds Timeline */}
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700, marginBottom: '0.35rem' }}>RECRUITMENT ROUNDS</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {drv.rounds?.map((rnd, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#475569' }}>
                          <span style={{ color: '#2563EB', fontWeight: 700 }}>R{idx + 1}:</span>
                          <span>{rnd.name}</span>
                          <span style={{ fontSize: '0.6875rem', color: '#94A3B8' }}>({rnd.date})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid #F1F5F9', marginTop: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    👥 <strong>{drv.registeredCandidates || 342}</strong> Registered
                  </div>

                  <button 
                    onClick={() => handleRegisterForDrive(drv)}
                    style={{ padding: '0.55rem 1.1rem', backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)' }}
                  >
                    Register for Drive
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Candidates Pipeline View */
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1.5rem', overflowX: 'auto', boxShadow: 'var(--shadow-sm)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Scholar</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Institution</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Position & Company</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Current Round</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Evaluation Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((cand) => (
                <tr key={cand.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <div style={{ fontWeight: 700, color: '#0F172A' }}>{cand.studentName}</div>
                    <div style={{ fontSize: '0.7rem', color: '#2563EB' }}>CGPA: {cand.cgpa} • {cand.department}</div>
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', color: '#475569' }}>
                    {cand.studentInstitutionName}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <div style={{ fontWeight: 600 }}>{cand.companyName}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{cand.role}</div>
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', color: '#1D4ED8', fontWeight: 600 }}>
                    {cand.currentRound}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <span className={cand.status === 'offered' ? 'status-pill-green' : 'status-pill-orange'}>
                      {cand.status === 'offered' ? '🏆 OFFER EXTENDED' : cand.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button 
                        onClick={() => handleAdvanceCandidate(cand.id, 'Executive HR Panel', 'shortlisted')}
                        style={{ padding: '0.3rem 0.65rem', backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Advance Round
                      </button>
                      <button 
                        onClick={() => handleAdvanceCandidate(cand.id, 'Offer Extended', 'offered', '₹18.0 LPA')}
                        style={{ padding: '0.3rem 0.65rem', backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Extend Offer 🏆
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Launch Pooled Drive Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Launch Cluster Pooled Campus Recruitment Drive"
      >
        <form onSubmit={handleCreateDrive} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                Hiring Enterprise
              </label>
              <input 
                type="text"
                required
                placeholder="E.g. Bosch Global / TCS Digital"
                value={newDrive.companyName}
                onChange={(e) => setNewDrive({ ...newDrive, companyName: e.target.value })}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                Role Title
              </label>
              <input 
                type="text"
                required
                placeholder="E.g. Embedded AI Systems Engineer"
                value={newDrive.role}
                onChange={(e) => setNewDrive({ ...newDrive, role: e.target.value })}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                Package CTC
              </label>
              <input 
                type="text"
                required
                placeholder="E.g. ₹16 - ₹22 LPA"
                value={newDrive.packageCtc}
                onChange={(e) => setNewDrive({ ...newDrive, packageCtc: e.target.value })}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                Total Openings
              </label>
              <input 
                type="number"
                value={newDrive.openings}
                onChange={(e) => setNewDrive({ ...newDrive, openings: Number(e.target.value) })}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" style={{ padding: '0.65rem 1.5rem', backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
              Broadcast Drive to All Colleges
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
