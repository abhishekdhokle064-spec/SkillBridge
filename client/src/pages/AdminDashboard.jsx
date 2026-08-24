import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { 
  Building2, 
  Layers, 
  Calendar, 
  Users, 
  TrendingUp, 
  Check, 
  X, 
  Clock, 
  MapPin, 
  FileText,
  Sparkles,
  Star,
  Eye,
  EyeOff,
  Trash2,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';

export const AdminDashboard = () => {
  const { showToast, triggerConfetti } = useApp();
  const [bookings, setBookings] = useState([]);
  const [resources, setResources] = useState([]);
  const [reviews, setReviews] = useState([]);

  const fetchAdminData = async () => {
    try {
      const [bkRes, resRes, revRes] = await Promise.all([
        api.getBookings(),
        api.getResources(),
        api.getReviews()
      ]);
      setBookings(bkRes.data || []);
      setResources(resRes.data || []);
      setReviews(revRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleAction = async (id, status) => {
    try {
      await api.updateBooking(id, { status });
      if (status === 'Approved') {
        showToast('Booking request Approved! Entry authorization sent.');
        triggerConfetti();
      } else {
        showToast('Booking request Rejected.');
      }
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status, statusType: status === 'Approved' ? 'green' : 'orange' } : b));
    } catch (err) {
      showToast('Action failed', 'error');
    }
  };

  const chartData = [
    { day: "Mon", value: 45 },
    { day: "Tue", value: 70 },
    { day: "Wed", value: 60 },
    { day: "Thu", value: 85 },
    { day: "Fri", value: 75 },
    { day: "Sat", value: 92 },
    { day: "Sun", value: 40 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.2rem' }}>
          Institution Admin Dashboard
        </h1>
        <p style={{ color: '#2563EB', fontWeight: 600, fontSize: '0.875rem' }}>
          Government Engineering College, Nashik
        </p>
      </div>

      {/* 4 Stat Cards matching Image 2 Bottom-Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.1' }}>12</div>
          <div style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: '0.25rem' }}>Total Resources</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.1' }}>45</div>
          <div style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: '0.25rem' }}>Active Bookings</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.1' }}>320</div>
          <div style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: '0.25rem' }}>Students Served</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10B981', lineHeight: '1.1' }}>92%</div>
          <div style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: '0.25rem' }}>Utilization Rate</div>
        </div>
      </div>

      {/* Two Columns: Resource Utilization Chart (Left) + Pending Requests (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        {/* Left: Resource Utilization Chart */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A' }}>Resource Utilization</h2>
            <span style={{ fontSize: '0.8125rem', color: '#2563EB', fontWeight: 600, cursor: 'pointer' }}>View Report</span>
          </div>

          {/* Bar Chart Representation */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', padding: '0 1rem 0.5rem', borderBottom: '1px solid #E2E8F0' }}>
            {chartData.map((d, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B' }}>{d.value}%</div>
                <div 
                  style={{
                    width: '28px',
                    height: `${d.value * 1.4}px`,
                    backgroundColor: '#2563EB',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.4s ease'
                  }}
                />
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>{d.day}</div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '1rem', textAlign: 'center' }}>
            Peak utilization observed on Friday & Saturday for robotics research batches.
          </div>
        </div>

        {/* Right: Pending Requests */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A' }}>Pending Requests</h2>
            <span style={{ fontSize: '0.8125rem', color: '#2563EB', fontWeight: 600, cursor: 'pointer' }}>View All</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* Request 1: Rahul Sharma */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: '10px', backgroundColor: '#F8FAFC' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                  👨‍🎓
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A' }}>Rahul Sharma</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Robotics Lab • 10 Aug</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button 
                  onClick={() => handleAction('bk_1', 'Approved')}
                  style={{ padding: '0.3rem 0.65rem', backgroundColor: '#DCFCE7', color: '#15803D', border: '1px solid #86EFAC', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleAction('bk_1', 'Rejected')}
                  style={{ padding: '0.3rem 0.65rem', backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Reject
                </button>
              </div>
            </div>

            {/* Request 2: Anjali Patil */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: '10px', backgroundColor: '#F8FAFC' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                  👩‍🎓
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A' }}>Anjali Patil</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>AI Lab • 11 Aug</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button 
                  onClick={() => handleAction('bk_4', 'Approved')}
                  style={{ padding: '0.3rem 0.65rem', backgroundColor: '#DCFCE7', color: '#15803D', border: '1px solid #86EFAC', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleAction('bk_4', 'Rejected')}
                  style={{ padding: '0.3rem 0.65rem', backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Moderation Management Section */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Star size={18} color="#F59E0B" fill="#F59E0B" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Cluster Reviews & Ratings Moderation
              </h2>
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '0.2rem 0 0' }}>
              Review student feedback, verify booking credentials, and manage inappropriate submissions.
            </p>
          </div>

          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#2563EB', backgroundColor: '#EFF6FF', padding: '0.3rem 0.75rem', borderRadius: '9999px' }}>
            {reviews.length} Total Submissions
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E2E8F0', color: '#64748B' }}>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>Scholar</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>Facility / Course</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>Rating</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>Review Comment</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700, textAlign: 'right' }}>Moderation Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((rev) => (
                <tr key={rev.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <div style={{ fontWeight: 700, color: '#0F172A' }}>{rev.userName}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{rev.userInstitution}</div>
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600, color: '#2563EB' }}>
                    {rev.targetTitle}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <span style={{ fontWeight: 700, color: '#D97706', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Star size={13} fill="#F59E0B" color="#F59E0B" /> {rev.rating}★
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', color: '#334155', maxWidth: '300px' }}>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      "{rev.reviewText}"
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <span style={{
                      backgroundColor: rev.status === 'hidden' ? '#FEF2F2' : '#ECFDF5',
                      color: rev.status === 'hidden' ? '#DC2626' : '#059669',
                      border: rev.status === 'hidden' ? '1px solid #FECACA' : '1px solid #A7F3D0',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 700
                    }}>
                      {rev.status === 'hidden' ? 'Hidden' : 'Active'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button
                        onClick={async () => {
                          const nextStatus = rev.status === 'hidden' ? 'active' : 'hidden';
                          await api.moderateReview(rev.id, { status: nextStatus });
                          showToast(`Review ${nextStatus === 'hidden' ? 'Hidden' : 'Restored'}.`);
                          fetchAdminData();
                        }}
                        style={{ padding: '0.3rem 0.6rem', backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        {rev.status === 'hidden' ? <Eye size={12} /> : <EyeOff size={12} />}
                        <span>{rev.status === 'hidden' ? 'Unhide' : 'Hide'}</span>
                      </button>

                      <button
                        onClick={async () => {
                          if (window.confirm('Delete this review permanently?')) {
                            await api.deleteReview(rev.id);
                            showToast('Review removed.');
                            fetchAdminData();
                          }
                        }}
                        style={{ padding: '0.3rem 0.6rem', backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
