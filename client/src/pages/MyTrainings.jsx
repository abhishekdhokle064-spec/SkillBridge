import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Modal } from '../components/Modal';
import { ReviewModal } from '../components/ReviewModal';
import { StarRating } from '../components/StarRating';
import { 
  BookOpen, 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  Award, 
  CheckCircle2, 
  Play, 
  Plus,
  Star,
  GraduationCap,
  Sparkles,
  ExternalLink,
  Search,
  MessageSquare
} from 'lucide-react';

export const MyTrainings = () => {
  const { currentUser, institutions, showToast, triggerConfetti, refreshData } = useApp();
  const [sessions, setSessions] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' | 'masterclasses' | 'trainers'
  const [loading, setLoading] = useState(true);

  // Review Modal State
  const [reviewCourse, setReviewCourse] = useState(null);
  const [showCourseReviewModal, setShowCourseReviewModal] = useState(false);

  // Live Classroom Modal State
  const [liveClassModal, setLiveClassModal] = useState(null);

  // Host Workshop Modal State
  const [showHostModal, setShowHostModal] = useState(false);
  const [newSession, setNewSession] = useState({
    title: '',
    domain: 'Robotics & AI',
    trainerId: '',
    hostInstitutionId: institutions[0]?.id || 'inst_1',
    scheduledDate: '2025-08-28',
    timeSlot: '02:00 PM - 05:00 PM',
    mode: 'Hybrid (Physical + Live Stream)',
    venue: 'Cluster Amphitheater & WebRTC',
    maxCapacity: 200,
    prerequisites: 'Basic C++ & Linux Knowledge',
    badgeTitle: 'Cluster Robotics Specialist'
  });

  const coursesInProgress = [
    {
      id: "crs_1",
      title: "IoT & Embedded Systems",
      provider: "Online Training by VIT Pune",
      startsAt: "15 Aug 2025",
      progress: 65,
      modulesCount: "8 of 12 Modules Completed",
      instructor: "Prof. Ananya Sen",
      rating: 4.8,
      reviewsCount: 128,
      isCompleted: false,
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "crs_2",
      title: "ROS2 Autonomous Navigation & SLAM",
      provider: "COEP Robotics Center of Excellence",
      startsAt: "22 Aug 2025",
      progress: 40,
      modulesCount: "4 of 10 Modules Completed",
      instructor: "Dr. K. R. Joshi",
      rating: 4.9,
      reviewsCount: 94,
      isCompleted: false,
      imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "crs_3",
      title: "GPU Accelerated Deep Learning & TensorRT",
      provider: "Visvesvaraya National Institute of Technology",
      startsAt: "01 Aug 2025",
      progress: 100,
      modulesCount: "10 of 10 Modules Completed",
      instructor: "Dr. Arvind Rao",
      rating: 5.0,
      reviewsCount: 156,
      isCompleted: true,
      imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80"
    }
  ];

  const loadTrainings = async () => {
    try {
      setLoading(true);
      const [sessRes, trnRes] = await Promise.all([
        api.getTrainingSessions(),
        api.getTrainers()
      ]);
      const fetchedSessions = sessRes.data || [];
      const fetchedTrainers = trnRes.data || [];
      setSessions(fetchedSessions);
      setTrainers(fetchedTrainers);
      if (fetchedTrainers.length > 0 && !newSession.trainerId) {
        setNewSession(prev => ({ ...prev, trainerId: fetchedTrainers[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrainings();
  }, []);

  const handleRegisterSession = async (sessionId, title) => {
    try {
      await api.registerTrainingSession(sessionId, { userId: currentUser?.id });
      showToast(`Enrolled in '${title}'! Calendar invite and WebRTC links sent.`);
      triggerConfetti();
      await loadTrainings();
      await refreshData();
    } catch (err) {
      showToast(err.message || 'Enrollment failed', 'error');
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      await api.createTrainingSession(newSession);
      showToast(`Masterclass '${newSession.title}' broadcasted to all 5 cluster colleges!`);
      setShowHostModal(false);
      await loadTrainings();
    } catch (err) {
      showToast(err.message || 'Failed to publish workshop', 'error');
    }
  };

  const handleOpenLiveClass = (trainingItem) => {
    setLiveClassModal(trainingItem);
    triggerConfetti();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header & Role Action */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>My Trainings & Masterclasses</h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
            Cross-campus skill development programs, expert faculty exchange, and live virtual labs.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', backgroundColor: '#F1F5F9', borderRadius: '8px', padding: '0.25rem' }}>
            <button 
              onClick={() => setActiveTab('courses')}
              style={{
                padding: '0.4rem 0.9rem',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: activeTab === 'courses' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'courses' ? '#1D4ED8' : '#64748B',
                boxShadow: activeTab === 'courses' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              Courses in Progress ({coursesInProgress.length})
            </button>
            <button 
              onClick={() => setActiveTab('masterclasses')}
              style={{
                padding: '0.4rem 0.9rem',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: activeTab === 'masterclasses' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'masterclasses' ? '#1D4ED8' : '#64748B',
                boxShadow: activeTab === 'masterclasses' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              Live Masterclasses ({sessions.length})
            </button>
            <button 
              onClick={() => setActiveTab('trainers')}
              style={{
                padding: '0.4rem 0.9rem',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: activeTab === 'trainers' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'trainers' ? '#1D4ED8' : '#64748B',
                boxShadow: activeTab === 'trainers' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              Faculty Directory ({trainers.length})
            </button>
          </div>

          {(currentUser?.role === 'trainer' || currentUser?.role === 'institution' || currentUser?.role === 'admin') && (
            <button 
              onClick={() => setShowHostModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1.1rem', backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)' }}
            >
              <Plus size={16} />
              <span>Host Masterclass</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Pills matching Image 2 Top-Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1rem 1.25rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2563EB' }}>3</div>
          <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Active Bookings</div>
        </div>
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1rem 1.25rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10B981' }}>2</div>
          <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Courses in Progress</div>
        </div>
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1rem 1.25rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F59E0B' }}>5</div>
          <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Certificates Earned</div>
        </div>
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1rem 1.25rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#8B5CF6' }}>4</div>
          <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Internship Applications</div>
        </div>
      </div>

      {/* Main Tab Views */}
      {activeTab === 'courses' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>Recommended & Enrolled Courses</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {coursesInProgress.map((crs) => (
              <div 
                key={crs.id}
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <div style={{ height: '160px', position: 'relative' }}>
                    <img src={crs.imageUrl} alt={crs.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: '#2563EB', color: '#FFFFFF', fontSize: '0.7rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '4px' }}>
                      In Progress ({crs.progress}%)
                    </span>
                  </div>

                  <div style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.2rem' }}>{crs.title}</h3>
                        <div style={{ fontSize: '0.8125rem', color: '#2563EB', fontWeight: 600 }}>{crs.provider}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', margin: '0.5rem 0 0.85rem', fontSize: '0.8125rem', color: '#D97706', fontWeight: 700 }}>
                      <Star size={15} color="#F59E0B" fill="#F59E0B" />
                      <span>{crs.rating}</span>
                      <span style={{ color: '#64748B', fontWeight: 500 }}>({crs.reviewsCount} Reviews)</span>
                      {crs.isCompleted && (
                        <span style={{ marginLeft: 'auto', backgroundColor: '#ECFDF5', color: '#059669', fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '9999px', border: '1px solid #A7F3D0' }}>
                          ✓ Completed
                        </span>
                      )}
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B', marginBottom: '0.35rem' }}>
                        <span>Progress</span>
                        <strong>{crs.modulesCount}</strong>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ width: `${crs.progress}%`, height: '100%', backgroundColor: crs.isCompleted ? '#10B981' : '#2563EB', borderRadius: '9999px' }} />
                      </div>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      👨‍🏫 <strong>Instructor:</strong> {crs.instructor}
                    </div>
                  </div>
                </div>

                <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {crs.isCompleted ? (
                    <>
                      <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>● Certificate Earned</span>
                      <button 
                        onClick={() => { setReviewCourse(crs); setShowCourseReviewModal(true); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 1rem', backgroundColor: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A', borderRadius: '6px', fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        <Star size={14} fill="#F59E0B" color="#F59E0B" />
                        <span>Rate this Course</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => { setReviewCourse(crs); setShowCourseReviewModal(true); }}
                        style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <Star size={13} />
                        <span>Reviews</span>
                      </button>
                      <button 
                        onClick={() => handleOpenLiveClass(crs)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1.1rem', backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)' }}
                      >
                        <Play size={13} fill="#FFFFFF" />
                        <span>Continue Learning</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'masterclasses' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {sessions.map((sess) => (
            <div 
              key={sess.id}
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8', fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '9999px' }}>
                    {sess.domain}
                  </span>
                  <span style={{ backgroundColor: '#ECFDF5', color: '#059669', fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    {sess.mode}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem', lineHeight: '1.3' }}>
                  {sess.title}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>{sess.trainerAvatar || '👨‍🏫'}</span>
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1E293B' }}>{sess.trainerName}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{sess.hostInstitutionName}</div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.75rem', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1rem' }}>
                  <div>📅 <strong>Date:</strong> {sess.scheduledDate} ({sess.timeSlot})</div>
                  <div>📍 <strong>Venue:</strong> {sess.venue}</div>
                  <div>🏆 <strong>Credential:</strong> Earn '{sess.badgeTitle}'</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  👥 <strong>{sess.registeredCount || 1}</strong> Enrolled
                </span>
                <button 
                  onClick={() => handleRegisterSession(sess.id, sess.title)}
                  style={{ padding: '0.55rem 1.1rem', backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)' }}
                >
                  1-Click Enroll
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'trainers' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {trainers.map((trn) => (
            <div 
              key={trn.id}
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.85rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', border: '2px solid #BFDBFE' }}>
                    {trn.avatar || '👨‍🏫'}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A' }}>{trn.name}</h3>
                    <div style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 600 }}>{trn.institutionName} • {trn.yearsExp} yrs exp</div>
                  </div>
                </div>

                <p style={{ fontSize: '0.8125rem', color: '#64748B', lineHeight: '1.5', marginBottom: '1rem' }}>
                  {trn.bio}
                </p>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700, marginBottom: '0.35rem' }}>SPECIALIZATIONS</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {trn.specializations?.map((sp, i) => (
                      <span key={i} style={{ backgroundColor: '#F1F5F9', color: '#334155', fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                        {sp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.85rem', borderTop: '1px solid #F1F5F9' }}>
                <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700 }}>⭐ {trn.rating} / 5.0</span>
                <button 
                  onClick={() => {
                    showToast(`Mentorship session request sent to ${trn.name}!`);
                    triggerConfetti();
                  }}
                  style={{ padding: '0.45rem 0.9rem', backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, color: '#1E293B', cursor: 'pointer' }}
                >
                  Request Mentorship
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Live Classroom WebRTC Simulation Modal */}
      <Modal
        isOpen={Boolean(liveClassModal)}
        onClose={() => setLiveClassModal(null)}
        title={`Live Cluster Interactive Studio: ${liveClassModal?.title || ''}`}
        maxWidth="720px"
      >
        {liveClassModal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Video Player Frame */}
            <div style={{ backgroundColor: '#0B0F19', borderRadius: '12px', height: '320px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
              <img src={liveClassModal.imageUrl} alt="Video Stream" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
              <div style={{ position: 'absolute', top: '16px', left: '16px', backgroundColor: 'rgba(239, 68, 68, 0.9)', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.65rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
                <span>LIVE STREAM ACTIVE</span>
              </div>
              <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', padding: '0.75rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Interactive Lab Workcell #04 • ROS2 Telemetry</div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Instructor: Prof. Ananya Sen • 184 Cluster Scholars Connected</div>
                </div>
                <button 
                  onClick={() => showToast('Audio & Video streams initialized!')}
                  style={{ padding: '0.4rem 0.8rem', backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Unmute Mic
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setLiveClassModal(null)} className="btn btn-outline">
                Leave Session
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Host Masterclass Modal */}
      <Modal
        isOpen={showHostModal}
        onClose={() => setShowHostModal(false)}
        title="Host Inter-Institutional Masterclass"
      >
        <form onSubmit={handleCreateSession} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
              Workshop Title
            </label>
            <input 
              type="text"
              required
              placeholder="E.g. Autonomous Mobile Robotics with ROS2 & SLAM"
              value={newSession.title}
              onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                Domain
              </label>
              <select 
                value={newSession.domain}
                onChange={(e) => setNewSession({ ...newSession, domain: e.target.value })}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', backgroundColor: '#FFFFFF' }}
              >
                <option value="Robotics & AI">Robotics & AI</option>
                <option value="Embedded Systems & IoT">Embedded Systems & IoT</option>
                <option value="VLSI & Microelectronics">VLSI & Microelectronics</option>
                <option value="Bio-Informatics">Bio-Informatics</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                Host Campus
              </label>
              <select 
                value={newSession.hostInstitutionId}
                onChange={(e) => setNewSession({ ...newSession, hostInstitutionId: e.target.value })}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', backgroundColor: '#FFFFFF' }}
              >
                {institutions.map(i => (
                  <option key={i.id} value={i.id}>{i.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setShowHostModal(false)} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" style={{ padding: '0.65rem 1.5rem', backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
              Broadcast to Cluster
            </button>
          </div>
        </form>
      </Modal>

      {/* Course Review Modal */}
      {reviewCourse && (
        <ReviewModal
          isOpen={showCourseReviewModal}
          onClose={() => { setShowCourseReviewModal(false); setReviewCourse(null); }}
          targetType="course"
          targetId={reviewCourse.id}
          targetTitle={reviewCourse.title}
          onReviewSubmitted={() => {
            showToast('Course rating and review submitted!');
          }}
        />
      )}
    </div>
  );
};
