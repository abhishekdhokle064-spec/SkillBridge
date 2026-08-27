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
  MessageSquare,
  Cpu,
  Code2,
  SlidersHorizontal,
  Compass,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const MyTrainings = () => {
  const { currentUser, institutions, showToast, triggerConfetti, refreshData, studentInterest, setStudentInterest } = useApp();
  const [sessions, setSessions] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' | 'masterclasses' | 'trainers'
  const [courseSearchQuery, setCourseSearchQuery] = useState('');
  const [interestMenuOpen, setInterestMenuOpen] = useState(false);
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
    // Hardware Courses
    {
      id: "crs_1",
      title: "IoT & Embedded Systems",
      provider: "Online Training by VIT Pune",
      category: "Hardware",
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
      id: "crs_hw_2",
      title: "Industrial Robotic Arms & PLC Automation",
      provider: "COEP Robotics Center of Excellence",
      category: "Hardware",
      startsAt: "18 Aug 2025",
      progress: 30,
      modulesCount: "3 of 10 Modules Completed",
      instructor: "Dr. K. R. Joshi",
      rating: 4.9,
      reviewsCount: 110,
      isCompleted: false,
      imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "crs_hw_3",
      title: "VLSI & FPGA Digital System Design",
      provider: "VJTI Mumbai Microelectronics Lab",
      category: "Hardware",
      startsAt: "10 Aug 2025",
      progress: 100,
      modulesCount: "12 of 12 Modules Completed",
      instructor: "Dr. P. Deshmukh",
      rating: 4.95,
      reviewsCount: 88,
      isCompleted: true,
      imageUrl: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "crs_hw_4",
      title: "EV Powertrain, Battery Pack & BMS Hardware",
      provider: "PICT Pune Automotive Research Hub",
      category: "Hardware",
      startsAt: "25 Aug 2025",
      progress: 50,
      modulesCount: "5 of 10 Modules Completed",
      instructor: "Dr. Vikramaditya Rao",
      rating: 4.85,
      reviewsCount: 76,
      isCompleted: false,
      imageUrl: "https://images.unsplash.com/photo-1558441719-5b3ea946d499?w=600&auto=format&fit=crop&q=80"
    },
    // Software Courses
    {
      id: "crs_2",
      title: "ROS2 Autonomous Navigation & SLAM",
      provider: "COEP Robotics Center of Excellence",
      category: "Software",
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
      category: "Software",
      startsAt: "01 Aug 2025",
      progress: 100,
      modulesCount: "10 of 10 Modules Completed",
      instructor: "Dr. Arvind Rao",
      rating: 5.0,
      reviewsCount: 156,
      isCompleted: true,
      imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "crs_sw_3",
      title: "Full Stack Cloud Microservices with Docker & Kubernetes",
      provider: "GEC Nashik Cloud Center",
      category: "Software",
      startsAt: "12 Aug 2025",
      progress: 75,
      modulesCount: "9 of 12 Modules Completed",
      instructor: "Prof. S. Verma",
      rating: 4.88,
      reviewsCount: 142,
      isCompleted: false,
      imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "crs_sw_4",
      title: "Applied Computer Vision & Real-Time Object Detection",
      provider: "PICT Pune AI Research Center",
      category: "Software",
      startsAt: "05 Aug 2025",
      progress: 100,
      modulesCount: "8 of 8 Modules Completed",
      instructor: "Prof. Ananya Sen",
      rating: 4.92,
      reviewsCount: 165,
      isCompleted: true,
      imageUrl: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=600&auto=format&fit=crop&q=80"
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
          
          {/* Student Interest & Search Filter Header */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Compass size={18} color="#2563EB" />
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Recommended & Enrolled Courses
                  </h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                  <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: 0 }}>
                    Filter courses by your primary student interest track:
                  </p>
                  {studentInterest && studentInterest !== 'All' && (
                    <span 
                      onClick={() => setStudentInterest('All')}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.72rem',
                        backgroundColor: '#EFF6FF',
                        color: '#1D4ED8',
                        border: '1px solid #BFDBFE',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '9999px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                      title="Click to reset filter"
                    >
                      <span>Showing {studentInterest} Courses</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>✕</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Student Interest Section - Collapsed by default, opens Hardware & Software options on click */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#F8FAFC', padding: '0.25rem 0.35rem', borderRadius: '10px', border: '1px solid #CBD5E1' }}>
                  {/* Primary Trigger Button: Student Interest */}
                  <button
                    type="button"
                    onClick={() => setInterestMenuOpen(prev => !prev)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.45rem 0.95rem',
                      borderRadius: '8px',
                      border: (studentInterest && studentInterest !== 'All') ? '1.5px solid #2563EB' : '1px solid #CBD5E1',
                      backgroundColor: (studentInterest && studentInterest !== 'All') ? '#EFF6FF' : '#FFFFFF',
                      color: (studentInterest && studentInterest !== 'All') ? '#1D4ED8' : '#0F172A',
                      fontSize: '0.8125rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <SlidersHorizontal size={14} color={(studentInterest && studentInterest !== 'All') ? '#2563EB' : '#475569'} />
                    <span>
                      {studentInterest && studentInterest !== 'All' ? `Student Interest: ${studentInterest}` : 'Student Interest'}
                    </span>
                    {interestMenuOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  {/* Revealed Separate Options: Hardware and Software (Shown when clicked) */}
                  {interestMenuOpen && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', paddingLeft: '0.2rem' }}>
                      {/* Hardware Option */}
                      <button
                        type="button"
                        onClick={() => {
                          const nextVal = studentInterest === 'Hardware' ? 'All' : 'Hardware';
                          setStudentInterest(nextVal);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.4rem 0.85rem',
                          borderRadius: '8px',
                          border: studentInterest === 'Hardware' ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
                          backgroundColor: studentInterest === 'Hardware' ? '#2563EB' : '#FFFFFF',
                          color: studentInterest === 'Hardware' ? '#FFFFFF' : '#334155',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: studentInterest === 'Hardware' ? '0 2px 6px rgba(37, 99, 235, 0.3)' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <Cpu size={13} />
                        <span>Hardware</span>
                        <span style={{
                          fontSize: '0.68rem',
                          padding: '0.1rem 0.4rem',
                          borderRadius: '9999px',
                          backgroundColor: studentInterest === 'Hardware' ? 'rgba(255,255,255,0.3)' : '#F1F5F9',
                          color: studentInterest === 'Hardware' ? '#FFFFFF' : '#64748B',
                          fontWeight: 700
                        }}>
                          {coursesInProgress.filter(c => c.category === 'Hardware').length}
                        </span>
                      </button>

                      {/* Software Option */}
                      <button
                        type="button"
                        onClick={() => {
                          const nextVal = studentInterest === 'Software' ? 'All' : 'Software';
                          setStudentInterest(nextVal);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.4rem 0.85rem',
                          borderRadius: '8px',
                          border: studentInterest === 'Software' ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
                          backgroundColor: studentInterest === 'Software' ? '#2563EB' : '#FFFFFF',
                          color: studentInterest === 'Software' ? '#FFFFFF' : '#334155',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: studentInterest === 'Software' ? '0 2px 6px rgba(37, 99, 235, 0.3)' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <Code2 size={13} />
                        <span>Software</span>
                        <span style={{
                          fontSize: '0.68rem',
                          padding: '0.1rem 0.4rem',
                          borderRadius: '9999px',
                          backgroundColor: studentInterest === 'Software' ? 'rgba(255,255,255,0.3)' : '#F1F5F9',
                          color: studentInterest === 'Software' ? '#FFFFFF' : '#64748B',
                          fontWeight: 700
                        }}>
                          {coursesInProgress.filter(c => c.category === 'Software').length}
                        </span>
                      </button>

                      {/* All / Reset Option */}
                      {studentInterest && studentInterest !== 'All' && (
                        <button
                          type="button"
                          onClick={() => setStudentInterest('All')}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.2rem',
                            padding: '0.4rem 0.65rem',
                            borderRadius: '8px',
                            border: '1px solid #E2E8F0',
                            backgroundColor: '#F1F5F9',
                            color: '#475569',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          <span>All</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Course Search Box */}
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="text"
                placeholder={`Search ${studentInterest !== 'All' ? studentInterest : ''} courses by title, instructor, or college...`}
                value={courseSearchQuery}
                onChange={(e) => setCourseSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 1rem 0.6rem 2.3rem',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  fontSize: '0.8125rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Courses Grid Filtered by Student Interest */}
          {coursesInProgress.filter(crs => {
            const matchesInterest = (studentInterest || 'All') === 'All' || crs.category?.toLowerCase() === studentInterest?.toLowerCase();
            const matchesSearch = !courseSearchQuery ||
              crs.title.toLowerCase().includes(courseSearchQuery.toLowerCase()) ||
              crs.provider.toLowerCase().includes(courseSearchQuery.toLowerCase()) ||
              crs.instructor.toLowerCase().includes(courseSearchQuery.toLowerCase());
            return matchesInterest && matchesSearch;
          }).length === 0 ? (
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '3rem 2rem', textAlign: 'center' }}>
              <Compass size={36} color="#94A3B8" style={{ margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>
                No {studentInterest !== 'All' ? studentInterest : ''} courses found
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#64748B', marginBottom: '1rem' }}>
                Try resetting your search or exploring All student interests.
              </p>
              <button
                onClick={() => { setStudentInterest('All'); setCourseSearchQuery(''); }}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
              >
                View All Courses
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
              {coursesInProgress.filter(crs => {
                const matchesInterest = (studentInterest || 'All') === 'All' || crs.category?.toLowerCase() === studentInterest?.toLowerCase();
                const matchesSearch = !courseSearchQuery ||
                  crs.title.toLowerCase().includes(courseSearchQuery.toLowerCase()) ||
                  crs.provider.toLowerCase().includes(courseSearchQuery.toLowerCase()) ||
                  crs.instructor.toLowerCase().includes(courseSearchQuery.toLowerCase());
                return matchesInterest && matchesSearch;
              }).map((crs) => (
                <div 
                  key={crs.id}
                  style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                >
                  <div>
                    <div style={{ height: '160px', position: 'relative' }}>
                      <img src={crs.imageUrl} alt={crs.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '0.35rem' }}>
                        <span style={{
                          backgroundColor: crs.category === 'Hardware' ? '#D97706' : '#2563EB',
                          color: '#FFFFFF',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '0.25rem 0.6rem',
                          borderRadius: '4px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}>
                          {crs.category === 'Hardware' ? '🔧 Hardware Track' : '💻 Software Track'}
                        </span>
                      </div>
                      <span style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: crs.isCompleted ? '#10B981' : '#1E293B', color: '#FFFFFF', fontSize: '0.7rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '4px' }}>
                        {crs.isCompleted ? '✓ Completed' : `In Progress (${crs.progress}%)`}
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
          )}
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
