import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Compass, 
  Target, 
  TrendingUp, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Layers, 
  Clock, 
  Award, 
  Briefcase, 
  FlaskConical, 
  Cpu, 
  Code2, 
  Zap, 
  ChevronRight, 
  Check,
  Star
} from 'lucide-react';

const DOMAIN_BENCHMARKS = {
  'Autonomous Robotics & ROS2': {
    track: 'Hardware & Software',
    readinessBase: 85,
    requiredSkills: [
      { name: 'C++ & Python OOP', benchmark: 4.5, icon: '💻' },
      { name: 'ROS2 Nodes & Navigation (Nav2)', benchmark: 4.0, icon: '🤖' },
      { name: 'Sensors (LiDAR, IMU, Depth Camera)', benchmark: 4.0, icon: '📡' },
      { name: 'Kinematics & Control Systems', benchmark: 3.5, icon: '⚙️' },
      { name: 'Linux RTOS & Embedded Firmware', benchmark: 4.0, icon: '🐧' }
    ],
    recommendedCourses: [
      { id: 'crs_2', title: 'ROS2 Autonomous Navigation & SLAM', provider: 'COEP Robotics Center of Excellence', rating: 4.9, image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80' },
      { id: 'crs_hw_2', title: 'Industrial Robotic Arms & PLC Automation', provider: 'COEP Robotics Center', rating: 4.9, image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80' }
    ],
    recommendedLabs: [
      { title: 'Robotics & Automation Center', location: 'COEP Tech, Pune', specs: 'KUKA 6-DOF Industrial Arms, Mobile TurtleBots, LiDAR test track' }
    ],
    targetRoles: ['Robotics Software Engineer', 'Autonomous Systems Engineer', 'Controls & Motion Specialist'],
    avgSalary: '₹14 - 24 LPA'
  },
  'Embedded Systems & IoT Architect': {
    track: 'Hardware',
    readinessBase: 80,
    requiredSkills: [
      { name: 'Embedded C & Assembly', benchmark: 4.5, icon: '⚡' },
      { name: 'Microcontrollers (ARM Cortex, ESP32)', benchmark: 4.5, icon: '🎛️' },
      { name: 'Hardware Protocols (I2C, SPI, CAN)', benchmark: 4.0, icon: '🔌' },
      { name: 'RTOS & Low Power Design', benchmark: 3.8, icon: '⏱️' },
      { name: 'PCB Layout & Signal Integrity', benchmark: 3.5, icon: '📐' }
    ],
    recommendedCourses: [
      { id: 'crs_1', title: 'IoT & Embedded Systems', provider: 'VIT Pune Micro Systems', rating: 4.8, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80' },
      { id: 'crs_hw_3', title: 'VLSI & FPGA Digital System Design', provider: 'VJTI Microelectronics', rating: 4.95, image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&auto=format&fit=crop&q=80' }
    ],
    recommendedLabs: [
      { title: 'Embedded IoT & PCB Prototyping Fab', location: 'VIT Pune Campus', specs: 'Altium PCB Milling, Rohde & Schwarz Spectrum Analyzers' }
    ],
    targetRoles: ['Embedded Firmware Engineer', 'IoT Solutions Architect', 'Hardware Design Specialist'],
    avgSalary: '₹12 - 20 LPA'
  },
  'AI & Deep Learning Engineer': {
    track: 'Software',
    readinessBase: 88,
    requiredSkills: [
      { name: 'Python, PyTorch & TensorFlow', benchmark: 4.8, icon: '🧠' },
      { name: 'Mathematical Foundations & Linear Algebra', benchmark: 4.2, icon: '📐' },
      { name: 'Computer Vision / NLP Architectures', benchmark: 4.0, icon: '👁️' },
      { name: 'GPU Acceleration (CUDA / TensorRT)', benchmark: 3.8, icon: '🚀' },
      { name: 'MLOps & Model Deployment', benchmark: 3.5, icon: '☁️' }
    ],
    recommendedCourses: [
      { id: 'crs_3', title: 'GPU Accelerated Deep Learning & TensorRT', provider: 'VNIT Supercomputing Center', rating: 5.0, image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80' },
      { id: 'crs_sw_4', title: 'Applied Computer Vision & Real-Time Detection', provider: 'PICT AI Research Lab', rating: 4.92, image: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=600&auto=format&fit=crop&q=80' }
    ],
    recommendedLabs: [
      { title: 'High Performance NVIDIA DGX AI Lab', location: 'VNIT Nagpur', specs: '8x NVIDIA A100 GPUs, High-throughput cluster storage' }
    ],
    targetRoles: ['AI Research Engineer', 'Deep Learning Specialist', 'Computer Vision Architect'],
    avgSalary: '₹16 - 28 LPA'
  },
  'Cloud Microservices & DevOps': {
    track: 'Software',
    readinessBase: 82,
    requiredSkills: [
      { name: 'Go / Node.js Backend Microservices', benchmark: 4.5, icon: '⚙️' },
      { name: 'Docker & Kubernetes Orchestration', benchmark: 4.2, icon: '🐳' },
      { name: 'CI/CD Pipelines & Infrastructure as Code', benchmark: 4.0, icon: '🔄' },
      { name: 'Distributed Systems & Database Scaling', benchmark: 4.0, icon: '🗄️' },
      { name: 'Cloud Security & Observability', benchmark: 3.8, icon: '🛡️' }
    ],
    recommendedCourses: [
      { id: 'crs_sw_3', title: 'Full Stack Cloud Microservices with Docker & K8s', provider: 'GEC Nashik Cloud Hub', rating: 4.88, image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80' }
    ],
    recommendedLabs: [
      { title: 'Cluster Hybrid Cloud Testbed', location: 'GEC Nashik Server Farm', specs: 'Private Kubernetes Cloud with 512GB RAM Nodes' }
    ],
    targetRoles: ['Cloud Architect', 'DevOps Platform Engineer', 'Full Stack Systems Engineer'],
    avgSalary: '₹13 - 22 LPA'
  },
  'Electric Vehicle (EV) Powertrain & BMS': {
    track: 'Hardware',
    readinessBase: 84,
    requiredSkills: [
      { name: 'Lithium Battery Chemistry & Cell Modeling', benchmark: 4.2, icon: '🔋' },
      { name: 'BMS State of Charge (SoC/SoH) Algorithms', benchmark: 4.2, icon: '📊' },
      { name: 'Motor Drive Control (PMSM / BLDC)', benchmark: 4.0, icon: '⚡' },
      { name: 'Thermal Management & Enclosure Design', benchmark: 3.8, icon: '🌡️' },
      { name: 'Automotive CAN Bus & ISO 26262', benchmark: 3.5, icon: '🚗' }
    ],
    recommendedCourses: [
      { id: 'crs_hw_4', title: 'EV Powertrain, Battery Pack & BMS Hardware', provider: 'PICT Pune Automotive Research Hub', rating: 4.85, image: 'https://images.unsplash.com/photo-1558441719-5b3ea946d499?w=600&auto=format&fit=crop&q=80' }
    ],
    recommendedLabs: [
      { title: 'EV Battery Test & Dynamometer Facility', location: 'PICT Pune', specs: '150kW Regenerative Dyno, Environmental Climatic Chamber' }
    ],
    targetRoles: ['EV Powertrain Specialist', 'BMS Firmware Engineer', 'Automotive Battery Scientist'],
    avgSalary: '₹14 - 25 LPA'
  }
};

export const SmartSkillAdvisor = () => {
  const { setActiveTab, setSelectedResourceId, showToast } = useApp();

  const [step, setStep] = useState(1);
  const [selectedDomain, setSelectedDomain] = useState('Autonomous Robotics & ROS2');
  const [academicYear, setAcademicYear] = useState('3rd Year / 6th Semester');
  const [preferredTrack, setPreferredTrack] = useState('Hardware & Software');
  const [weeklyCommitment, setWeeklyCommitment] = useState('10-15 hrs/week');
  const [primaryGoal, setPrimaryGoal] = useState('Land a Tier-1 Placement (₹14-25 LPA)');

  const [selfRatings, setSelfRatings] = useState({
    'C++ & Python OOP': 3,
    'ROS2 Nodes & Navigation (Nav2)': 2,
    'Sensors (LiDAR, IMU, Depth Camera)': 3,
    'Kinematics & Control Systems': 2,
    'Linux RTOS & Embedded Firmware': 3
  });

  const [advisorResults, setAdvisorResults] = useState(null);
  const [completedMilestones, setCompletedMilestones] = useState(() => {
    try {
      const saved = localStorage.getItem('skillbridge_advisor_milestones');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  useEffect(() => {
    try {
      const savedResults = localStorage.getItem('skillbridge_skill_advisor_results');
      if (savedResults) {
        const parsed = JSON.parse(savedResults);
        setAdvisorResults(parsed);
        setSelectedDomain(parsed.domain || 'Autonomous Robotics & ROS2');
        setStep(4);
      }
    } catch (e) {}
  }, []);

  const handleDomainChange = (domainKey) => {
    setSelectedDomain(domainKey);
    const domainData = DOMAIN_BENCHMARKS[domainKey];
    if (domainData) {
      const initialRatings = {};
      domainData.requiredSkills.forEach(s => {
        initialRatings[s.name] = 3;
      });
      setSelfRatings(initialRatings);
      setPreferredTrack(domainData.track);
    }
  };

  const handleRatingChange = (skillName, value) => {
    setSelfRatings(prev => ({
      ...prev,
      [skillName]: Number(value)
    }));
  };

  const toggleMilestone = (phaseId, milestoneIdx) => {
    const key = `${phaseId}_${milestoneIdx}`;
    const nextState = {
      ...completedMilestones,
      [key]: !completedMilestones[key]
    };
    setCompletedMilestones(nextState);
    try {
      localStorage.setItem('skillbridge_advisor_milestones', JSON.stringify(nextState));
    } catch (e) {}
    showToast(!completedMilestones[key] ? 'Milestone completed! Keep it up!' : 'Milestone updated');
  };

  const calculateAssessment = () => {
    const domain = DOMAIN_BENCHMARKS[selectedDomain];
    if (!domain) return;

    let totalEarned = 0;
    let totalBenchmark = 0;
    const skillBreakdown = [];

    domain.requiredSkills.forEach(skill => {
      const userRating = selfRatings[skill.name] || 2;
      const benchmark = skill.benchmark;
      const diff = benchmark - userRating;
      
      totalEarned += userRating;
      totalBenchmark += benchmark;

      let status = 'Mastered';
      let statusColor = '#10B981';
      if (diff > 1.2) {
        status = 'High-Priority Gap';
        statusColor = '#EF4444';
      } else if (diff > 0) {
        status = 'In Progress';
        statusColor = '#F59E0B';
      }

      skillBreakdown.push({
        name: skill.name,
        icon: skill.icon,
        userRating,
        benchmark,
        diff: Math.max(0, diff),
        status,
        statusColor
      });
    });

    const readinessScore = Math.min(100, Math.round((totalEarned / totalBenchmark) * 100));
    const skillGapPercentage = Math.max(0, 100 - readinessScore);

    const generatedRoadmap = [
      {
        phase: 'Phase 1: Foundational Competencies & Architecture',
        duration: 'Weeks 1 - 3',
        tag: 'Core Fundamentals',
        milestones: [
          `Review core ${selectedDomain} fundamentals and system specifications`,
          `Set up local workstation environment and Linux test toolchains`,
          `Complete preliminary diagnostic quizzes on SkillBridge platform`
        ]
      },
      {
        phase: 'Phase 2: Hands-on Lab Simulation & Prototyping',
        duration: 'Weeks 4 - 7',
        tag: 'Cluster Lab Workcells',
        milestones: [
          `Book a physical or remote slot at ${domain.recommendedLabs[0]?.title || 'Partner Lab'}`,
          `Build 2 end-to-end hardware/software prototypes under mentor guidance`,
          `Submit peer review and faculty validation reports`
        ]
      },
      {
        phase: 'Phase 3: Advanced Course Specialization & Certificate',
        duration: 'Weeks 8 - 10',
        tag: 'Distinction Credential',
        milestones: [
          `Complete ${domain.recommendedCourses[0]?.title || 'Specialization Course'} modules`,
          `Score 85%+ in the cluster benchmark exam to earn Verified Credential`,
          `Publish project artifact to the inter-collegiate portfolio registry`
        ]
      },
      {
        phase: 'Phase 4: Industry Capstone & Placement Drive Entry',
        duration: 'Weeks 11 - 12',
        tag: 'Corporate Readiness',
        milestones: [
          `Participate in mock technical interview panels with Industry Mentors`,
          `Get auto-whitelisted for ${selectedDomain} pooled placement drives`,
          `Target average offer package of ${domain.avgSalary}`
        ]
      }
    ];

    const results = {
      domain: selectedDomain,
      academicYear,
      preferredTrack,
      weeklyCommitment,
      primaryGoal,
      readinessScore,
      skillGapPercentage,
      skillBreakdown,
      roadmap: generatedRoadmap,
      recommendedCourses: domain.recommendedCourses,
      recommendedLabs: domain.recommendedLabs,
      targetRoles: domain.targetRoles,
      avgSalary: domain.avgSalary,
      generatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    setAdvisorResults(results);
    try {
      localStorage.setItem('skillbridge_skill_advisor_results', JSON.stringify(results));
    } catch (e) {}
    setStep(4);
    showToast('Diagnostic completed! Your personalized roadmap is ready.');
  };

  const handleResetAssessment = () => {
    try {
      localStorage.removeItem('skillbridge_skill_advisor_results');
    } catch (e) {}
    setAdvisorResults(null);
    setStep(1);
    showToast('Assessment reset. You can begin a new diagnosis.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      
      {/* Header Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
          borderRadius: '16px',
          padding: '2rem 2.25rem',
          color: '#FFFFFF',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 800, marginBottom: '0.75rem', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
              <Sparkles size={14} />
              <span>AI-POWERED CAREER & COMPETENCY DIAGNOSTIC</span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 0.5rem', color: '#FFFFFF' }}>
              Smart Skill Advisor & Gap Detector
            </h1>
            <p style={{ fontSize: '0.925rem', color: '#94A3B8', margin: 0, maxWidth: '650px', lineHeight: 1.5 }}>
              Benchmark your technical skills against live industry recruitment criteria, uncover exact competency gaps, and follow your personalized learning roadmap to high-impact careers.
            </p>
          </div>

          {advisorResults && (
            <button
              onClick={handleResetAssessment}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '0.6rem 1.1rem',
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <RotateCcw size={14} />
              <span>Retake Diagnosis</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Steps (Shown during diagnosis) */}
      {step < 4 && (
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
          {[
            { num: 1, label: 'Target Career' },
            { num: 2, label: 'Academic Track' },
            { num: 3, label: 'Skill Ratings' }
          ].map((s) => (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, justifyContent: s.num === 1 ? 'flex-start' : (s.num === 2 ? 'center' : 'flex-end') }}>
              <div 
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: step === s.num ? '#2563EB' : (step > s.num ? '#10B981' : '#F1F5F9'),
                  color: step >= s.num ? '#FFFFFF' : '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.875rem'
                }}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: step === s.num ? 800 : 600, color: step === s.num ? '#0F172A' : '#64748B' }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Step 1: Target Career Goal */}
      {step === 1 && (
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <Target size={20} color="#2563EB" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Step 1: Choose Your Target Domain & Specialization
            </h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.5rem' }}>
            Select the specialized engineering or technology domain you wish to benchmark your profile against:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {Object.keys(DOMAIN_BENCHMARKS).map((key) => {
              const item = DOMAIN_BENCHMARKS[key];
              const isSelected = selectedDomain === key;
              return (
                <div
                  key={key}
                  onClick={() => handleDomainChange(key)}
                  style={{
                    border: isSelected ? '2px solid #2563EB' : '1px solid #E2E8F0',
                    backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 4px 12px rgba(37, 99, 235, 0.15)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '9999px', backgroundColor: item.track === 'Hardware' ? '#FEF3C7' : (item.track === 'Software' ? '#DBEAFE' : '#E0E7FF'), color: item.track === 'Hardware' ? '#B45309' : (item.track === 'Software' ? '#1D4ED8' : '#4338CA') }}>
                      {item.track}
                    </span>
                    {isSelected && <CheckCircle2 size={18} color="#2563EB" />}
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.35rem' }}>
                    {key}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                    <Briefcase size={12} />
                    <span>Avg Salary: <strong>{item.avgSalary}</strong></span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 600 }}>
                    {item.targetRoles.slice(0, 2).join(' • ')}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setStep(2)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.65rem 1.5rem',
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)'
              }}
            >
              <span>Next: Academic Context</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Academic Track & Goals */}
      {step === 2 && (
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <Layers size={20} color="#2563EB" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Step 2: Academic Year & Learning Preferences
            </h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.5rem' }}>
            Tell us about your current academic standing and available weekly commitment:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                Academic Year / Semester
              </label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', backgroundColor: '#F8FAFC', outline: 'none' }}
              >
                <option value="1st Year (Sem 1-2)">1st Year (Foundation)</option>
                <option value="2nd Year (Sem 3-4)">2nd Year (Intermediate)</option>
                <option value="3rd Year (Sem 5-6)">3rd Year (Specialization & Internships)</option>
                <option value="Final Year (Sem 7-8)">Final Year (Capstone & Placements)</option>
                <option value="Post-Graduate / M.Tech">Post-Graduate / M.Tech / Research Scholar</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                Weekly Learning Commitment
              </label>
              <select
                value={weeklyCommitment}
                onChange={(e) => setWeeklyCommitment(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', backgroundColor: '#F8FAFC', outline: 'none' }}
              >
                <option value="5-8 hrs/week">5 - 8 hrs/week (Light)</option>
                <option value="10-15 hrs/week">10 - 15 hrs/week (Balanced / Recommended)</option>
                <option value="18-25 hrs/week">18 - 25 hrs/week (Intensive Fast-Track)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                Primary Objective
              </label>
              <select
                value={primaryGoal}
                onChange={(e) => setPrimaryGoal(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', backgroundColor: '#F8FAFC', outline: 'none' }}
              >
                <option value="Land a Tier-1 Placement (₹14-25 LPA)">Land a Tier-1 Placement (₹14-25 LPA)</option>
                <option value="Secure a High-Stipend R&D Internship">Secure a High-Stipend R&D Internship</option>
                <option value="Build an Autonomous Capstone Project">Build an Autonomous Capstone Project</option>
                <option value="Crack High-Impact Hackathons / Grants">Crack High-Impact Hackathons / Grants</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              onClick={() => setStep(1)}
              style={{ padding: '0.65rem 1.25rem', backgroundColor: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.5rem', backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)' }}
            >
              <span>Next: Skill Self-Evaluation</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Self-Evaluation Ratings */}
      {step === 3 && (
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <TrendingUp size={20} color="#2563EB" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Step 3: Self-Evaluate Your Competencies for {selectedDomain}
            </h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.5rem' }}>
            Rate your confidence in each core competency from <strong>1 (Beginner)</strong> to <strong>5 (Expert / Production Ready)</strong>:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
            {DOMAIN_BENCHMARKS[selectedDomain]?.requiredSkills.map((skill) => {
              const currentRating = selfRatings[skill.name] || 3;
              return (
                <div 
                  key={skill.name}
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '10px',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '240px' }}>
                    <span style={{ fontSize: '1.4rem' }}>{skill.icon}</span>
                    <div>
                      <div style={{ fontSize: '0.925rem', fontWeight: 800, color: '#0F172A' }}>{skill.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        Industry Placement Benchmark: <strong>{skill.benchmark} / 5.0</strong>
                      </div>
                    </div>
                  </div>

                  {/* Rating Selector Buttons (1 to 5) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleRatingChange(skill.name, val)}
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '8px',
                          border: currentRating === val ? '2px solid #2563EB' : '1px solid #CBD5E1',
                          backgroundColor: currentRating === val ? '#2563EB' : '#FFFFFF',
                          color: currentRating === val ? '#FFFFFF' : '#334155',
                          fontSize: '0.85rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          boxShadow: currentRating === val ? '0 2px 8px rgba(37, 99, 235, 0.3)' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {val}★
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              onClick={() => setStep(2)}
              style={{ padding: '0.65rem 1.25rem', backgroundColor: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Back
            </button>
            <button
              onClick={calculateAssessment}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.75rem',
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}
            >
              <Zap size={16} />
              <span>Run Skill Gap Detector</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Diagnostic Results, Gap Detector & Roadmap */}
      {step === 4 && advisorResults && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Top Score Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {/* Readiness Score */}
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B' }}>INDUSTRY READINESS</span>
                <Sparkles size={16} color="#2563EB" />
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: 900, color: advisorResults.readinessScore >= 75 ? '#10B981' : (advisorResults.readinessScore >= 50 ? '#2563EB' : '#F59E0B') }}>
                {advisorResults.readinessScore}%
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden', margin: '0.5rem 0' }}>
                <div style={{ width: `${advisorResults.readinessScore}%`, height: '100%', backgroundColor: advisorResults.readinessScore >= 75 ? '#10B981' : (advisorResults.readinessScore >= 50 ? '#2563EB' : '#F59E0B'), borderRadius: '9999px' }} />
              </div>
              <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>
                Target: {advisorResults.domain}
              </p>
            </div>

            {/* Detected Skill Gap */}
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B' }}>IDENTIFIED SKILL GAP</span>
                <AlertTriangle size={16} color="#F59E0B" />
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#F59E0B' }}>
                {advisorResults.skillGapPercentage}%
              </div>
              <p style={{ fontSize: '0.78rem', color: '#475569', margin: '0.4rem 0 0', lineHeight: 1.4 }}>
                {advisorResults.skillGapPercentage <= 20 ? 'Mild polish needed on capstone integration.' : 'Bridgeable in 8-12 weeks using cluster facilities.'}
              </p>
            </div>

            {/* Target Placements */}
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B' }}>PLACEMENT BENCHMARK</span>
                <Award size={16} color="#10B981" />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>
                {advisorResults.avgSalary}
              </div>
              <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.4rem 0 0' }}>
                Roles: {advisorResults.targetRoles?.slice(0, 2).join(', ')}
              </p>
            </div>
          </div>

          {/* Detailed Skill Breakdown Bar */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} color="#2563EB" />
              <span>Skill Gap Diagnostic Matrix</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {advisorResults.skillBreakdown?.map((item) => (
                <div key={item.name} style={{ backgroundColor: '#F8FAFC', padding: '0.85rem 1.15rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>{item.icon}</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F172A' }}>{item.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        Your Rating: <strong>{item.userRating}★</strong> / Benchmark: <strong>{item.benchmark}★</strong>
                      </span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '9999px', backgroundColor: item.status === 'Mastered' ? '#ECFDF5' : (item.status === 'In Progress' ? '#FEF3C7' : '#FEE2E2'), color: item.statusColor }}>
                        {item.status}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ flex: 1, height: '6px', backgroundColor: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ width: `${(item.userRating / 5) * 100}%`, height: '100%', backgroundColor: item.statusColor, borderRadius: '9999px' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Personalized Learning Roadmap */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Layers size={18} color="#2563EB" />
                  <span>Personalized 4-Phase Learning Roadmap</span>
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0.2rem 0 0' }}>
                  Check off milestones as you progress through cluster courses, labs, and workshops:
                </p>
              </div>

              <span style={{ fontSize: '0.75rem', backgroundColor: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontWeight: 700 }}>
                {Object.values(completedMilestones).filter(Boolean).length} of 12 Milestones Done
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              {advisorResults.roadmap?.map((phase, phaseIdx) => (
                <div 
                  key={phase.phase}
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.7rem', backgroundColor: '#DBEAFE', color: '#1E40AF', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 800 }}>
                        {phase.tag}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>{phase.duration}</span>
                    </div>
                    <h4 style={{ fontSize: '0.925rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.85rem' }}>
                      {phase.phase}
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {phase.milestones.map((m, mIdx) => {
                        const isDone = !!completedMilestones[`phase_${phaseIdx}_${mIdx}`];
                        return (
                          <div 
                            key={mIdx}
                            onClick={() => toggleMilestone(`phase_${phaseIdx}`, mIdx)}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '0.5rem',
                              cursor: 'pointer',
                              fontSize: '0.78rem',
                              color: isDone ? '#059669' : '#334155',
                              textDecoration: isDone ? 'line-through' : 'none'
                            }}
                          >
                            <div 
                              style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '4px',
                                border: isDone ? '1px solid #10B981' : '1px solid #CBD5E1',
                                backgroundColor: isDone ? '#10B981' : '#FFFFFF',
                                color: '#FFFFFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                marginTop: '1px'
                              }}
                            >
                              {isDone && <Check size={12} strokeWidth={3} />}
                            </div>
                            <span>{m}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended SkillBridge Resources to Bridge Gap */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={18} color="#2563EB" />
              <span>Direct Recommended Courses & Labs for {advisorResults.domain}</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {advisorResults.recommendedCourses?.map((crs) => (
                <div key={crs.id} style={{ border: '1px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
                  <img src={crs.image} alt={crs.title} style={{ width: '100%', height: '130px', objectFit: 'cover' }} />
                  <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem' }}>{crs.title}</h4>
                      <p style={{ fontSize: '0.75rem', color: '#2563EB', margin: 0, fontWeight: 600 }}>{crs.provider}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', margin: '0.4rem 0', fontSize: '0.75rem', color: '#D97706', fontWeight: 700 }}>
                        <Star size={13} fill="#F59E0B" color="#F59E0B" />
                        <span>{crs.rating}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab('trainings')}
                      style={{
                        width: '100%',
                        marginTop: '0.75rem',
                        padding: '0.5rem',
                        backgroundColor: '#EFF6FF',
                        color: '#1D4ED8',
                        border: '1px solid #BFDBFE',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Enroll via SkillBridge Trainings
                    </button>
                  </div>
                </div>
              ))}

              {advisorResults.recommendedLabs?.map((lab, i) => (
                <div key={i} style={{ border: '1px solid #E2E8F0', borderRadius: '10px', padding: '1.25rem', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10B981', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                      <FlaskConical size={14} />
                      <span>RECOMMENDED CLUSTER LAB</span>
                    </div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem' }}>{lab.title}</h4>
                    <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0 0 0.5rem' }}>📍 {lab.location}</p>
                    <p style={{ fontSize: '0.75rem', color: '#334155', margin: 0, lineHeight: 1.4 }}>
                      <strong>Equipment:</strong> {lab.specs}
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('resources')}
                    style={{
                      width: '100%',
                      marginTop: '1rem',
                      padding: '0.5rem',
                      backgroundColor: '#10B981',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Book Lab Slot
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
