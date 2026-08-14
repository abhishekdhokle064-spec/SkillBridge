import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Modal } from '../components/Modal';
import { 
  GraduationCap, 
  Search, 
  Star, 
  Calendar, 
  Video, 
  Plus, 
  CheckCircle2, 
  Users, 
  Award,
  Sparkles,
  MapPin
} from 'lucide-react';

export const Trainers = () => {
  const { currentUser, institutions, showToast, refreshData } = useApp();
  const [trainers, setTrainers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Host Masterclass Modal State
  const [showHostModal, setShowHostModal] = useState(false);
  const [newSession, setNewSession] = useState({
    title: '',
    domain: 'Artificial Intelligence',
    trainerId: '',
    hostInstitutionId: institutions[0]?.id || 'inst_1',
    scheduledDate: '2026-09-05',
    timeSlot: '02:00 PM - 05:00 PM',
    mode: 'Hybrid (Physical + Live Stream)',
    venue: 'Cluster Amphitheater & WebRTC',
    maxCapacity: 200,
    prerequisites: 'Basic programming fundamentals',
    badgeTitle: 'Cluster Specialist'
  });

  const domains = ['All', 'Artificial Intelligence', 'Bio-Informatics', 'VLSI & Hardware', 'Robotics & Automation', 'Design & HCI'];

  const loadData = async () => {
    try {
      setLoading(true);
      const [trnRes, sessRes] = await Promise.all([
        api.getTrainers({ domain: selectedDomain !== 'All' ? selectedDomain : '', search: searchQuery }),
        api.getTrainingSessions()
      ]);
      const fetchedTrainers = trnRes.data || [];
      setTrainers(fetchedTrainers);
      setSessions(sessRes.data || []);
      if (fetchedTrainers.length > 0 && !newSession.trainerId) {
        setNewSession(prev => ({ ...prev, trainerId: fetchedTrainers[0].id }));
      }
    } catch (err) {
      console.error('Failed to load trainer data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDomain, searchQuery]);

  const handleRegisterSession = async (sessionId, title) => {
    try {
      await api.registerTrainingSession(sessionId, { userId: currentUser?.id });
      showToast(`Registered for '${title}'! Session link and calendar invite sent.`);
      await loadData();
      await refreshData();
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      await api.createTrainingSession(newSession);
      showToast(`Masterclass '${newSession.title}' published across all cluster colleges!`);
      setShowHostModal(false);
      await loadData();
    } catch (err) {
      showToast(err.message || 'Failed to publish workshop', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Shared Trainers & Faculty Exchange</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Pool distinguished professors and domain experts to deliver cluster masterclasses and cross-campus training.
          </p>
        </div>

        {(currentUser?.role === 'faculty' || currentUser?.role === 'admin') && (
          <button onClick={() => setShowHostModal(true)} className="btn btn-primary btn-sm">
            <Plus size={16} />
            <span>Host Cluster Masterclass</span>
          </button>
        )}
      </div>

      {/* Upcoming Masterclasses Section */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem' }}>Scheduled Cross-Campus Masterclasses</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Open to all registered cluster students & faculty</p>
          </div>
          <span className="badge badge-indigo">{sessions.length} Live Workshops</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {sessions.map((sess) => (
            <div 
              key={sess.id}
              className="glass-card"
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid rgba(99, 102, 241, 0.25)' }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span className="badge badge-cyan">{sess.domain}</span>
                  <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>{sess.mode}</span>
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: '1.3' }}>
                  {sess.title}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>{sess.trainerAvatar}</span>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{sess.trainerName}</div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.625rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1rem' }}>
                  <div><strong style={{ color: '#a5b4fc' }}>Date & Time:</strong> {sess.scheduledDate} ({sess.timeSlot})</div>
                  <div><strong style={{ color: '#6ee7b7' }}>Venue:</strong> {sess.venue}</div>
                  <div><strong style={{ color: '#fcd34d' }}>Credential:</strong> Earn '{sess.badgeTitle}' Badge</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <Users size={13} style={{ display: 'inline', marginRight: '4px' }} />
                  <strong>{sess.registeredCount}</strong> / {sess.maxCapacity} Seats Filled
                </div>

                <button 
                  onClick={() => handleRegisterSession(sess.id, sess.title)}
                  className="btn btn-primary btn-sm"
                >
                  <span>1-Click Register</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expert Faculty Directory */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>Cluster Faculty Expert Directory</h2>
          
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {domains.map(d => (
              <button
                key={d}
                onClick={() => setSelectedDomain(d)}
                style={{
                  padding: '0.3rem 0.625rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: selectedDomain === d ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  background: selectedDomain === d ? 'var(--accent-primary-light)' : 'transparent',
                  color: selectedDomain === d ? '#a5b4fc' : 'var(--text-secondary)'
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {trainers.map((trn) => (
            <div key={trn.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-elevated)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.75rem',
                  border: '1px solid var(--border-subtle)'
                }}>
                  {trn.avatar}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{trn.name}</h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {trn.institutionName} • {trn.yearsExp} yrs exp
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                {trn.bio}
              </p>

              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.375rem', fontWeight: 600 }}>SPECIALIZATIONS</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                  {trn.specializations?.map((spec, i) => (
                    <span key={i} className="badge badge-indigo" style={{ fontSize: '0.6875rem' }}>
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <div><strong>Rating:</strong> ⭐ {trn.rating}/5.0 ({trn.totalSessions} sessions)</div>
                <div style={{ color: 'var(--accent-cyan)' }}><strong>Cost:</strong> {trn.hourlyRate}</div>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <strong>Availability:</strong> {trn.availability}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Host Masterclass Modal */}
      <Modal
        isOpen={showHostModal}
        onClose={() => setShowHostModal(false)}
        title="Host Inter-Institutional Masterclass"
      >
        <form onSubmit={handleCreateSession} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Workshop Title</label>
            <input 
              type="text"
              required
              placeholder="E.g. Advanced RISC-V Silicon Design & Emulation"
              value={newSession.title}
              onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
              className="input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Domain</label>
              <select 
                value={newSession.domain}
                onChange={(e) => setNewSession({ ...newSession, domain: e.target.value })}
                className="select"
              >
                {domains.filter(d => d !== 'All').map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Lead Faculty</label>
              <select 
                value={newSession.trainerId}
                onChange={(e) => setNewSession({ ...newSession, trainerId: e.target.value })}
                className="select"
              >
                {trainers.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.domain})</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Session Date</label>
              <input 
                type="date"
                required
                value={newSession.scheduledDate}
                onChange={(e) => setNewSession({ ...newSession, scheduledDate: e.target.value })}
                className="input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Time Window</label>
              <input 
                type="text"
                value={newSession.timeSlot}
                onChange={(e) => setNewSession({ ...newSession, timeSlot: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Delivery Mode</label>
              <select 
                value={newSession.mode}
                onChange={(e) => setNewSession({ ...newSession, mode: e.target.value })}
                className="select"
              >
                <option value="Hybrid (Physical + Live Stream)">Hybrid (Physical + Live Stream)</option>
                <option value="Online Interactive WebRTC">Online Interactive WebRTC</option>
                <option value="In-Person Lab Workshop">In-Person Lab Workshop</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Max Student Capacity</label>
              <input 
                type="number"
                value={newSession.maxCapacity}
                onChange={(e) => setNewSession({ ...newSession, maxCapacity: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Earnable Badge Title</label>
            <input 
              type="text"
              placeholder="E.g. Edge AI Practitioner"
              value={newSession.badgeTitle}
              onChange={(e) => setNewSession({ ...newSession, badgeTitle: e.target.value })}
              className="input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setShowHostModal(false)} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Broadcast Workshop to Cluster
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
