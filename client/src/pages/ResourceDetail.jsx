import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { 
  ArrowLeft, 
  MapPin, 
  CheckCircle2, 
  Users, 
  Clock, 
  Calendar, 
  Star, 
  Cpu, 
  User, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const ResourceDetail = () => {
  const { selectedResourceId, setActiveTab, currentUser, showToast, triggerConfetti, refreshData } = useApp();
  const [resource, setResource] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Booking Form State
  const [bookingDate, setBookingDate] = useState('2025-08-10');
  const [bookingTimeSlot, setBookingTimeSlot] = useState('10:00 AM - 1:00 PM');
  const [bookingPurpose, setBookingPurpose] = useState('Hands-on learning for Mini Project');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await api.getResources();
        const list = res.data || [];
        const found = list.find(r => r.id === selectedResourceId) || list[0];
        setResource(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [selectedResourceId]);

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!resource) return;

    try {
      setSubmitting(true);
      await api.bookResource(resource.id, {
        requesterUserId: currentUser?.id || 'user_student_1',
        requesterInstitutionId: currentUser?.institutionId || 'inst_1',
        purpose: bookingPurpose,
        date: bookingDate,
        timeSlot: bookingTimeSlot
      });

      showToast(`Slot confirmed for '${resource.title}'! Entry pass generated.`);
      triggerConfetti();
      await refreshData();
      setTimeout(() => {
        setActiveTab('bookings');
      }, 1200);
    } catch (err) {
      showToast(err.message || 'Booking failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!resource) return <div>Loading resource details...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Back to Search Button */}
      <button 
        onClick={() => setActiveTab('resources')}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', color: '#2563EB', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', alignSelf: 'flex-start' }}
      >
        <ArrowLeft size={16} />
        <span>Back to Search</span>
      </button>

      {/* Main Two-Column Layout matching Image 2 Mid-Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem', alignItems: 'flex-start' }}>
        {/* Left Column: Details, Image, Tabs */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
          {/* Header Image */}
          <div style={{ height: '260px', borderRadius: '12px', overflow: 'hidden', position: 'relative', marginBottom: '1.25rem' }}>
            <img src={resource.imageUrl} alt={resource.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <span style={{ position: 'absolute', top: '14px', right: '14px', backgroundColor: '#10B981', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 700, padding: '0.3rem 0.75rem', borderRadius: '6px' }}>
              {resource.status || 'Available'}
            </span>
          </div>

          {/* Title & Institution */}
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>
            {resource.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#2563EB', fontWeight: 600, fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            <MapPin size={16} />
            <span>{resource.institutionName} • {resource.location}</span>
          </div>

          {/* Sub Navigation Tabs */}
          <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid #E2E8F0', marginBottom: '1.25rem', fontSize: '0.875rem', fontWeight: 600 }}>
            {['overview', 'equipment', 'trainer', 'reviews'].map((tab) => (
              <span
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                style={{
                  paddingBottom: '0.65rem',
                  textTransform: 'capitalize',
                  cursor: 'pointer',
                  color: activeSubTab === tab ? '#2563EB' : '#64748B',
                  borderBottom: activeSubTab === tab ? '2px solid #2563EB' : '2px solid transparent'
                }}
              >
                {tab}
              </span>
            ))}
          </div>

          {/* Tab Content */}
          {activeSubTab === 'overview' && (
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.35rem' }}>Overview</h3>
                <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: '1.6' }}>
                  {resource.description}
                </p>
              </div>

              {/* Key Features */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.65rem' }}>Key Features</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {resource.keyFeatures?.map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#334155' }}>
                      <CheckCircle2 size={16} color="#10B981" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Capacity & Dates Table */}
              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.8125rem' }}>
                <div>
                  <span style={{ color: '#64748B' }}>Capacity:</span> <strong style={{ color: '#0F172A' }}>{resource.capacity} Students</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B' }}>Available Seats:</span> <strong style={{ color: '#10B981' }}>{resource.seatsAvailable}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B' }}>Available Dates:</span> <strong style={{ color: '#0F172A' }}>{resource.availableDates}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B' }}>Time Slots:</span> <strong style={{ color: '#0F172A' }}>{resource.timeSlots}</strong>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'equipment' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Installed Equipment & Hardware</h3>
              {resource.equipment?.map((eq, i) => (
                <div key={i} style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.85rem' }}>
                  <Cpu size={16} color="#2563EB" />
                  <span style={{ fontWeight: 600 }}>{eq}</span>
                </div>
              ))}
            </div>
          )}

          {activeSubTab === 'trainer' && (
            <div style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                  👨‍🏫
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>{resource.trainerName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Assigned Lead Cluster Instructor</div>
                </div>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#475569', lineHeight: '1.5' }}>
                Available on site to supervise industrial arms, oversee code uploads, and guide research project methodologies.
              </p>
            </div>
          )}

          {activeSubTab === 'reviews' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: 700 }}>
                <Star size={20} color="#F59E0B" fill="#F59E0B" />
                <span>{resource.rating} / 5.0</span>
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 400 }}>({resource.reviewsCount} student & faculty reviews)</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Book Resource Form Widget matching Image 2 */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '1.75rem', boxShadow: 'var(--shadow-sm)', position: 'sticky', top: '90px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Book Resource</span>
            <span style={{ fontSize: '0.75rem', color: '#10B981', backgroundColor: '#ECFDF5', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Free Access</span>
          </h2>

          <form onSubmit={handleConfirmBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                Select Date
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="date"
                  required
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', outline: 'none', backgroundColor: '#F8FAFC' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                Select Time Slot
              </label>
              <select 
                value={bookingTimeSlot}
                onChange={(e) => setBookingTimeSlot(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', outline: 'none', backgroundColor: '#F8FAFC' }}
              >
                <option value="10:00 AM - 1:00 PM">10:00 AM - 1:00 PM</option>
                <option value="2:00 PM - 5:00 PM">2:00 PM - 5:00 PM</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                Purpose of Booking
              </label>
              <textarea 
                rows={3}
                required
                value={bookingPurpose}
                onChange={(e) => setBookingPurpose(e.target.value)}
                placeholder="Hands-on learning for Mini Project"
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', outline: 'none', backgroundColor: '#F8FAFC' }}
              />
            </div>

            <div style={{ backgroundColor: '#F1F5F9', padding: '0.75rem', borderRadius: '8px', fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} color="#2563EB" />
              <span>Instant slot approval under Maharashtra Cluster MOU</span>
            </div>

            <button 
              type="submit"
              disabled={submitting}
              style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)' }}
            >
              {submitting ? 'Confirming...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
