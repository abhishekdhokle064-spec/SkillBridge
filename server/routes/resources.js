const express = require('express');
const router = express.Router();
const db = require('../db');

// List all cluster resources with enriched institution details
router.get('/', (req, res) => {
  const { category, institutionId, search } = req.query;
  let list = db.get('resources');

  if (category && category !== 'All') {
    list = list.filter(r => r.category.toLowerCase().includes(category.toLowerCase()));
  }
  if (institutionId) {
    list = list.filter(r => r.institutionId === institutionId);
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(r => 
      r.title.toLowerCase().includes(q) || 
      (r.specs && r.specs.toLowerCase().includes(q)) || 
      (r.category && r.category.toLowerCase().includes(q)) ||
      (r.location && r.location.toLowerCase().includes(q))
    );
  }

  const enriched = list.map(r => {
    const inst = db.findById('institutions', r.institutionId);
    return {
      ...r,
      institutionName: inst ? inst.name : 'Government Engineering College, Nashik',
      institutionCode: inst ? inst.code : 'GEC',
      institutionCity: inst ? inst.city : 'Nashik'
    };
  });

  res.json({ success: true, data: enriched });
});

// Get single resource
router.get('/:id', (req, res) => {
  const resource = db.findById('resources', req.params.id);
  if (!resource) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  const inst = db.findById('institutions', resource.institutionId);
  const bookings = db.filter('resource_bookings', b => b.resourceId === resource.id);
  res.json({
    success: true,
    data: {
      ...resource,
      institution: inst,
      institutionName: inst ? inst.name : 'Partner College',
      bookings
    }
  });
});

// Create new resource
router.post('/', (req, res) => {
  const { 
    title, 
    category, 
    institutionId, 
    specs, 
    capacity, 
    seatsAvailable,
    availableDates,
    timeSlots,
    location, 
    description, 
    keyFeatures,
    equipment,
    imageUrl,
    trainerName,
    status
  } = req.body;

  if (!title || !category || !institutionId) {
    return res.status(400).json({ success: false, message: 'Title, category, and host institution are required' });
  }

  const inst = db.findById('institutions', institutionId);

  const featuresArray = Array.isArray(keyFeatures) 
    ? keyFeatures 
    : (typeof keyFeatures === 'string' && keyFeatures.trim().length > 0 
        ? keyFeatures.split(',').map(s => s.trim()) 
        : (specs ? specs.split(',').map(s => s.trim()) : ["High precision calibration", "Interactive test rig"]));

  const equipmentArray = Array.isArray(equipment) 
    ? equipment 
    : (typeof equipment === 'string' && equipment.trim().length > 0 
        ? equipment.split(',').map(s => s.trim()) 
        : ["Dedicated hardware workcell", "Data acquisition unit"]);

  const newResource = db.insert('resources', {
    title,
    category: category || 'Laboratories',
    institutionId,
    institutionName: inst ? inst.name : 'Partner College',
    location: location || (inst ? `${inst.city}, ${inst.state}` : 'Nashik, Maharashtra'),
    specs: specs || 'Industrial grade equipment and test setup',
    capacity: Number(capacity) || 30,
    seatsAvailable: Number(seatsAvailable) || Number(capacity) || 25,
    availableDates: availableDates || '15 Aug 2025 - 30 Sep 2025',
    timeSlots: timeSlots || '10:00 AM - 1:00 PM, 2:00 PM - 5:00 PM',
    status: status || 'Available',
    description: description || 'High-end shared facility available for all cluster students, researchers, and faculty members under MOU.',
    keyFeatures: featuresArray,
    equipment: equipmentArray,
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    trainerName: trainerName || (inst ? `Lead Faculty (${inst.code})` : 'Faculty Incharge'),
    totalBookedHours: 0,
    rating: 5.0,
    reviewsCount: 1
  });

  db.logActivity(
    'RESOURCE_CREATED',
    `New cluster facility '${title}' registered by ${inst ? inst.name : 'an institution'}.`,
    req.headers['x-user-id'] || 'admin',
    institutionId
  );

  res.status(201).json({ success: true, data: newResource, message: 'Resource successfully added to cluster catalog!' });
});

// List bookings (with user role filtering)
router.get('/bookings/all', (req, res) => {
  const { userId, institutionId, status } = req.query;
  let bookings = db.get('resource_bookings');

  if (userId) {
    bookings = bookings.filter(b => b.studentUserId === userId || b.requesterUserId === userId);
  }
  if (institutionId) {
    bookings = bookings.filter(b => b.requesterInstitutionId === institutionId);
  }
  if (status && status !== 'All') {
    bookings = bookings.filter(b => b.status === status);
  }

  const enriched = bookings.map(b => {
    const resource = db.findById('resources', b.resourceId);
    const hostInst = resource ? db.findById('institutions', resource.institutionId) : null;
    const user = db.findById('users', b.studentUserId || b.requesterUserId);

    return {
      ...b,
      resourceTitle: resource ? resource.title : (b.resourceTitle || 'Lab Resource'),
      resourceCategory: resource ? resource.category : 'Laboratories',
      institutionName: hostInst ? hostInst.name : (b.institutionName || 'GEC Nashik'),
      studentName: user ? user.name : (b.studentName || 'Scholar')
    };
  });

  res.json({ success: true, data: enriched });
});

// Book a resource slot
router.post('/:id/book', (req, res) => {
  const resourceId = req.params.id;
  const resource = db.findById('resources', resourceId);
  if (!resource) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }

  const { requesterUserId, requesterInstitutionId, purpose, date, timeSlot, notes } = req.body;
  if (!date || !timeSlot) {
    return res.status(400).json({ success: false, message: 'Date and time slot are required' });
  }

  const user = db.findById('users', requesterUserId || 'user_student_1');
  const reqInst = db.findById('institutions', requesterInstitutionId || user?.institutionId || 'inst_1');

  const booking = db.insert('resource_bookings', {
    resourceId,
    resourceTitle: resource.title,
    institutionName: resource.institutionName || 'Host Campus',
    studentUserId: requesterUserId || 'user_student_1',
    studentName: user ? user.name : 'Rahul Sharma',
    studentInstitution: reqInst ? reqInst.code : 'GEC Nashik',
    purpose: purpose || 'Hands-on project work and research analysis',
    date,
    timeSlot,
    status: 'Confirmed',
    statusType: 'green',
    allocatedNode: `Workcell-${Math.floor(Math.random() * 8) + 1}`,
    notes: notes || 'Access credentials sent to student dashboard.',
    createdAt: new Date().toISOString()
  });

  // Increment resource booked hours & decrement seats
  db.update('resources', resourceId, {
    totalBookedHours: (resource.totalBookedHours || 0) + 4,
    seatsAvailable: Math.max(0, (resource.seatsAvailable || resource.capacity || 25) - 1)
  });

  db.logActivity(
    'RESOURCE_BOOKED',
    `${user ? user.name : 'Student'} (${reqInst ? reqInst.code : 'Cluster'}) booked '${resource.title}' for ${date}.`,
    requesterUserId || 'user_student_1',
    requesterInstitutionId
  );

  res.status(201).json({ success: true, data: booking, message: 'Resource slot confirmed successfully!' });
});

// Update booking status
router.patch('/bookings/:bookingId', (req, res) => {
  const { status, notes } = req.body;
  const booking = db.findById('resource_bookings', req.params.bookingId);
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }

  const updated = db.update('resource_bookings', req.params.bookingId, {
    status: status || booking.status,
    notes: notes || booking.notes
  });

  res.json({ success: true, data: updated });
});

module.exports = router;
