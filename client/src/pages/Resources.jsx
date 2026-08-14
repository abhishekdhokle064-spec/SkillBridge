import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Modal } from '../components/Modal';
import { 
  Search, 
  MapPin, 
  Building2, 
  Calendar, 
  Clock, 
  Users, 
  Plus, 
  CheckCircle2, 
  Cpu, 
  Sparkles,
  Layers,
  Filter,
  Image as ImageIcon,
  Wrench,
  Check
} from 'lucide-react';

export const Resources = () => {
  const { currentUser, institutions, showToast, triggerConfetti, refreshData, setSelectedResourceId, setActiveTab, globalSearchQuery } = useApp();
  const [resources, setResources] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeView, setActiveView] = useState('catalog'); // 'catalog' | 'bookings'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('Any Location');
  const [selectedInstitution, setSelectedInstitution] = useState('Any Institution');
  const [searchQuery, setSearchQuery] = useState(globalSearchQuery || '');
  const [loading, setLoading] = useState(true);

  // Booking Modal State
  const [bookingResource, setBookingResource] = useState(null);
  const [bookingDate, setBookingDate] = useState('2025-08-20');
  const [bookingTimeSlot, setBookingTimeSlot] = useState('10:00 AM - 1:00 PM');
  const [bookingPurpose, setBookingPurpose] = useState('Hands-on research & prototype testing');
  const [submittingBooking, setSubmittingBooking] = useState(false);

  // Register New Resource Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [submittingResource, setSubmittingResource] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    category: 'Laboratories',
    institutionId: institutions[0]?.id || 'inst_1',
    location: 'Nashik, Maharashtra',
    specs: 'Industrial Arms, High-speed controllers, Precision sensors',
    capacity: 30,
    seatsAvailable: 25,
    availableDates: '15 Aug 2025 - 30 Sep 2025',
    timeSlots: '10:00 AM - 1:00 PM, 2:00 PM - 5:00 PM',
    trainerName: 'Dr. K. R. Joshi (Lead Incharge)',
    description: 'State-of-the-art laboratory facility available for all cluster students & researchers under MOU.',
    keyFeatures: 'ABB Industrial Robot Arm, Arduino & Raspberry Pi Kits, ROS (Robot Operating System), 3D Printer & CNC Setup',
    equipment: '6-DOF Robot Arm, 20x Microcontroller Kits, FPGA Boards, High-Speed Telemetry Rig',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80'
  });

  const categories = ['All', 'Laboratories', 'Classrooms', 'Equipment', 'Trainers'];

  const samplePresets = [
    {
      title: "5G & Software Defined Radio Testbed",
      category: "Equipment",
      specs: "NI USRP-2974, Keysight Vector Signal Analyzer, mmWave Antennas",
      imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80",
      description: "Dedicated telecommunications testbed for massive MIMO beamforming and sub-6GHz protocol validation."
    },
    {
      title: "Cyber-Physical & Smart Grid Simulation Lab",
      category: "Laboratories",
      specs: "OPAL-RT Real-Time Simulator, SCADA Testbed, IEC 61850 Relays",
      imageUrl: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&auto=format&fit=crop&q=80",
      description: "Hardware-in-the-loop power grid simulation workcells for renewable microgrid integration."
    },
    {
      title: "Advanced 5-Axis CNC & Additive Manufacturing Center",
      category: "Laboratories",
      specs: "DMG MORI 5-Axis Milling, Renishaw Metal 3D Printer, CMM Coordinate Inspection",
      imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80",
      description: "High-precision mechanical prototyping lab for aerospace turbine blades and medical titanium implants."
    }
  ];

  const imagePresets = [
    { label: "Robotics & Automation", url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80" },
    { label: "GPU Computing Rig", url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80" },
    { label: "IoT & Electronics", url: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&auto=format&fit=crop&q=80" },
    { label: "Cleanroom Micro-Fab", url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80" },
    { label: "EV Powertrain Dyno", url: "https://images.unsplash.com/photo-1558441719-5b3ea946d499?w=600&auto=format&fit=crop&q=80" }
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      const [resRes, bookRes] = await Promise.all([
        api.getResources(),
        api.getBookings()
      ]);
      setResources(resRes.data || []);
      setBookings(bookRes.data || []);
    } catch (err) {
      console.error('Failed to load resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (globalSearchQuery !== undefined) {
      setSearchQuery(globalSearchQuery);
    }
  }, [globalSearchQuery]);

  const handleOpenDetail = (id) => {
    setSelectedResourceId(id);
    setActiveTab('resource_detail');
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    if (!bookingResource) return;

    try {
      setSubmittingBooking(true);
      await api.bookResource(bookingResource.id, {
        requesterUserId: currentUser?.id || 'user_student_1',
        requesterInstitutionId: currentUser?.institutionId || 'inst_1',
        purpose: bookingPurpose,
        date: bookingDate,
        timeSlot: bookingTimeSlot
      });

      showToast(`Slot confirmed for '${bookingResource.title}'! Entry authorization pass created.`);
      triggerConfetti();
      setBookingResource(null);
      setBookingPurpose('Hands-on research & prototype testing');
      await loadData();
      await refreshData();
    } catch (err) {
      showToast(err.message || 'Failed to book slot', 'error');
    } finally {
      setSubmittingBooking(false);
    }
  };

  const handleCreateResource = async (e) => {
    e.preventDefault();
    try {
      setSubmittingResource(true);
      await api.createResource(newResource);
      showToast(`Facility '${newResource.title}' successfully published to SkillBridge catalog!`);
      triggerConfetti();
      setShowAddModal(false);
      
      // Reset form
      setNewResource({
        title: '',
        category: 'Laboratories',
        institutionId: institutions[0]?.id || 'inst_1',
        location: 'Nashik, Maharashtra',
        specs: 'Industrial Arms, High-speed controllers, Precision sensors',
        capacity: 30,
        seatsAvailable: 25,
        availableDates: '15 Aug 2025 - 30 Sep 2025',
        timeSlots: '10:00 AM - 1:00 PM, 2:00 PM - 5:00 PM',
        trainerName: 'Dr. K. R. Joshi (Lead Incharge)',
        description: 'State-of-the-art laboratory facility available for all cluster students & researchers under MOU.',
        keyFeatures: 'ABB Industrial Robot Arm, Arduino & Raspberry Pi Kits, ROS (Robot Operating System), 3D Printer & CNC Setup',
        equipment: '6-DOF Robot Arm, 20x Microcontroller Kits, FPGA Boards, High-Speed Telemetry Rig',
        imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80'
      });

      await loadData();
      await refreshData();
    } catch (err) {
      showToast(err.message || 'Failed to register facility', 'error');
    } finally {
      setSubmittingResource(false);
    }
  };

  const applyPreset = (preset) => {
    setNewResource(prev => ({
      ...prev,
      title: preset.title,
      category: preset.category,
      specs: preset.specs,
      description: preset.description,
      imageUrl: preset.imageUrl
    }));
    showToast(`Loaded preset template: ${preset.title}`);
  };

  // Comprehensive Client-Side Filter
  const filteredResources = resources.filter((r) => {
    const matchesSearch = !searchQuery || 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.specs && r.specs.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.location && r.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.institutionName && r.institutionName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || 
      (r.category && r.category.toLowerCase() === selectedCategory.toLowerCase()) ||
      (selectedCategory === 'Laboratories' && (r.title?.includes('Lab') || r.category === 'Laboratories'));

    const matchesLocation = selectedLocation === 'Any Location' || 
      (r.location && r.location.toLowerCase().includes(selectedLocation.split(',')[0].toLowerCase()));

    const matchesInstitution = selectedInstitution === 'Any Institution' || 
      (r.institutionName && r.institutionName.toLowerCase().includes(selectedInstitution.toLowerCase())) ||
      r.institutionId === selectedInstitution;

    return matchesSearch && matchesCategory && matchesLocation && matchesInstitution;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header & View Switcher */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>Explore Shared Cluster Resources</h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
            Discover and book shared laboratories, equipment, and research infrastructure across partner colleges.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', backgroundColor: '#F1F5F9', borderRadius: '8px', padding: '0.25rem' }}>
            <button 
              onClick={() => setActiveView('catalog')}
              style={{
                padding: '0.4rem 0.9rem',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: activeView === 'catalog' ? '#FFFFFF' : 'transparent',
                color: activeView === 'catalog' ? '#1D4ED8' : '#64748B',
                boxShadow: activeView === 'catalog' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              Catalog ({resources.length})
            </button>
            <button 
              onClick={() => setActiveView('bookings')}
              style={{
                padding: '0.4rem 0.9rem',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: activeView === 'bookings' ? '#FFFFFF' : 'transparent',
                color: activeView === 'bookings' ? '#1D4ED8' : '#64748B',
                boxShadow: activeView === 'bookings' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              Cluster Bookings ({bookings.length})
            </button>
          </div>

          <button 
            onClick={() => setShowAddModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1.25rem', backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 10px rgba(37, 99, 235, 0.35)' }}
          >
            <Plus size={16} />
            <span>Add / Register Facility</span>
          </button>
        </div>
      </div>

      {activeView === 'catalog' ? (
        <>
          {/* Search Bar & Dropdown Filters */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', border: '1px solid #E2E8F0', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input 
                type="text"
                placeholder="Search labs, equipment, robotics, AI, supercomputing..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.5rem', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '0.875rem', outline: 'none', backgroundColor: '#F8FAFC' }}
              />
            </div>

            <select 
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              style={{ padding: '0.65rem 1rem', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '0.875rem', color: '#475569', outline: 'none', backgroundColor: '#F8FAFC' }}
            >
              <option value="Any Location">Any Location</option>
              <option value="Nashik">Nashik, Maharashtra</option>
              <option value="Pune">Pune, Maharashtra</option>
              <option value="Mumbai">Mumbai, Maharashtra</option>
              <option value="Nagpur">Nagpur, Maharashtra</option>
            </select>

            <select 
              value={selectedInstitution}
              onChange={(e) => setSelectedInstitution(e.target.value)}
              style={{ padding: '0.65rem 1rem', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '0.875rem', color: '#475569', outline: 'none', backgroundColor: '#F8FAFC' }}
            >
              <option value="Any Institution">Any Institution</option>
              {institutions.map(i => (
                <option key={i.id} value={i.name}>{i.name}</option>
              ))}
            </select>

            <button 
              onClick={loadData}
              style={{ padding: '0.65rem 1.5rem', backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Search
            </button>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.35rem 0.95rem',
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

          {/* Showing Results Heading */}
          <div style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 600 }}>
            Showing {filteredResources.length} facilities across cluster
          </div>

          {/* Resources Grid */}
          {filteredResources.length === 0 ? (
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '3rem', textAlign: 'center', color: '#64748B' }}>
              <Layers size={36} color="#94A3B8" style={{ margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>No facilities matched your search</h3>
              <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>Try clearing your filters or register a new facility below.</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                <button 
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedLocation('Any Location'); setSelectedInstitution('Any Institution'); }}
                  style={{ padding: '0.5rem 1.25rem', backgroundColor: '#F1F5F9', color: '#1E293B', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Reset Filters
                </button>
                <button 
                  onClick={() => setShowAddModal(true)}
                  style={{ padding: '0.5rem 1.25rem', backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  + Add New Facility
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
              {filteredResources.map((res) => (
                <div 
                  key={res.id} 
                  style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                >
                  <div>
                    <div style={{ height: '175px', position: 'relative', overflow: 'hidden' }}>
                      <img src={res.imageUrl} alt={res.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <span style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: '#10B981', color: '#FFFFFF', fontSize: '0.7rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '4px' }}>
                        {res.status || 'Available'}
                      </span>
                    </div>

                    <div style={{ padding: '1.25rem' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>
                        {res.title}
                      </h3>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', color: '#2563EB', fontWeight: 600, marginBottom: '0.75rem' }}>
                        <MapPin size={14} />
                        <span>{res.institutionName} • {res.location}</span>
                      </div>

                      <p style={{ fontSize: '0.8125rem', color: '#64748B', lineHeight: '1.4', marginBottom: '0.85rem' }}>
                        {res.description?.slice(0, 110)}...
                      </p>

                      <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.75rem', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '0.5rem' }}>
                        <div>👥 <strong>Capacity:</strong> {res.capacity} Students ({res.seatsAvailable || 20} Seats Free)</div>
                        <div>📅 <strong>Available Dates:</strong> {res.availableDates || '10 Aug 2025 - 25 Aug 2025'}</div>
                        <div>⏱️ <strong>Time Slots:</strong> {res.timeSlots || '10:00 AM - 1:00 PM'}</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #F1F5F9', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <button 
                      onClick={() => handleOpenDetail(res.id)}
                      style={{ padding: '0.6rem', backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => setBookingResource(res)}
                      style={{ padding: '0.6rem', backgroundColor: '#2563EB', border: 'none', borderRadius: '6px', fontSize: '0.8125rem', fontWeight: 600, color: '#FFFFFF', cursor: 'pointer', boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)' }}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* Bookings View */
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.5rem', overflowX: 'auto', boxShadow: 'var(--shadow-sm)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Facility</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Host College</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Date & Slot</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Purpose</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: '#0F172A' }}>
                    {b.resourceTitle}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', color: '#475569' }}>
                    {b.institutionName || 'GEC Nashik'}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <div style={{ color: '#2563EB', fontWeight: 600 }}>{b.date}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{b.timeSlot}</div>
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', color: '#334155' }}>
                    {b.purpose}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <span className={b.status === 'Confirmed' || b.status === 'approved' ? 'status-pill-green' : 'status-pill-orange'}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Book Slot Modal */}
      <Modal 
        isOpen={Boolean(bookingResource)} 
        onClose={() => setBookingResource(null)}
        title={`Book Resource: ${bookingResource?.title || ''}`}
      >
        <form onSubmit={handleBookSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div style={{ backgroundColor: '#F8FAFC', padding: '0.85rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.8125rem' }}>
            <div><strong>Host Campus:</strong> {bookingResource?.institutionName}</div>
            <div><strong>Location:</strong> {bookingResource?.location}</div>
            <div><strong>Access Fee:</strong> Free for Cluster Partner Students & Faculty</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                Select Date
              </label>
              <input 
                type="date"
                required
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                Select Time Slot
              </label>
              <select 
                value={bookingTimeSlot}
                onChange={(e) => setBookingTimeSlot(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', backgroundColor: '#FFFFFF' }}
              >
                <option value="10:00 AM - 1:00 PM">10:00 AM - 1:00 PM</option>
                <option value="2:00 PM - 5:00 PM">2:00 PM - 5:00 PM</option>
                <option value="09:00 AM - 01:00 PM">09:00 AM - 01:00 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
              Purpose of Booking
            </label>
            <textarea 
              rows={3}
              required
              placeholder="E.g., Hands-on learning for Mini Project or ROS simulation"
              value={bookingPurpose}
              onChange={(e) => setBookingPurpose(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setBookingResource(null)} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={submittingBooking} style={{ padding: '0.65rem 1.5rem', backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
              {submittingBooking ? 'Confirming...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add New Resource Modal with Presets & Full Form */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add & Register Shared Lab Facility"
        maxWidth="680px"
      >
        <form onSubmit={handleCreateResource} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* Quick Presets Bar */}
          <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.75rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sparkles size={14} color="#2563EB" />
              <span>Quick Template Presets:</span>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {samplePresets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(p)}
                  style={{ padding: '0.25rem 0.6rem', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 600, color: '#1E293B', cursor: 'pointer' }}
                >
                  ⚡ {p.title.split(' ')[0]} {p.title.split(' ')[1]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
              Facility / Laboratory Title *
            </label>
            <input 
              type="text"
              required
              placeholder="E.g. Mechatronics & Drone Avionics Lab"
              value={newResource.title}
              onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                Resource Category *
              </label>
              <select 
                value={newResource.category}
                onChange={(e) => setNewResource({ ...newResource, category: e.target.value })}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', backgroundColor: '#FFFFFF' }}
              >
                {categories.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                Host Institution *
              </label>
              <select 
                value={newResource.institutionId}
                onChange={(e) => setNewResource({ ...newResource, institutionId: e.target.value })}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', backgroundColor: '#FFFFFF' }}
              >
                {institutions.map(i => (
                  <option key={i.id} value={i.id}>{i.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                Location / Campus *
              </label>
              <input 
                type="text"
                required
                placeholder="E.g. Pune, Maharashtra"
                value={newResource.location}
                onChange={(e) => setNewResource({ ...newResource, location: e.target.value })}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                Student Capacity (Seats)
              </label>
              <input 
                type="number"
                value={newResource.capacity}
                onChange={(e) => setNewResource({ ...newResource, capacity: Number(e.target.value) })}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
              Equipment & Technical Specifications
            </label>
            <input 
              type="text"
              placeholder="Hardware models, sensors, arms, workstations..."
              value={newResource.specs}
              onChange={(e) => setNewResource({ ...newResource, specs: e.target.value })}
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
            />
          </div>

          {/* Image Presets Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
              Select Laboratory Image Preset
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
              {imagePresets.map((img, i) => (
                <div 
                  key={i}
                  onClick={() => setNewResource({ ...newResource, imageUrl: img.url })}
                  style={{
                    height: '56px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative',
                    border: newResource.imageUrl === img.url ? '2px solid #2563EB' : '1px solid #E2E8F0'
                  }}
                >
                  <img src={img.url} alt={img.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {newResource.imageUrl === img.url && (
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(37,99,235,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={16} color="#FFFFFF" strokeWidth={3} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
              Description & Research Capabilities
            </label>
            <textarea 
              rows={3}
              placeholder="Describe facility capabilities, project suitability, and operating environment..."
              value={newResource.description}
              onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={submittingResource}
              style={{ padding: '0.65rem 1.75rem', backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 10px rgba(37, 99, 235, 0.35)' }}
            >
              {submittingResource ? 'Publishing...' : 'Publish Facility to Catalog'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
