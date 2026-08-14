const express = require('express');
const router = express.Router();
const db = require('../db');

// List all cluster trainers & faculty experts
router.get('/', (req, res) => {
  const { domain, search } = req.query;
  let trainers = db.get('trainers');

  if (domain && domain !== 'All') {
    trainers = trainers.filter(t => t.domain.toLowerCase().includes(domain.toLowerCase()));
  }
  if (search) {
    const q = search.toLowerCase();
    trainers = trainers.filter(t => 
      t.name.toLowerCase().includes(q) ||
      t.domain.toLowerCase().includes(q) ||
      (t.specializations && t.specializations.some(s => s.toLowerCase().includes(q)))
    );
  }

  const enriched = trainers.map(t => {
    const inst = db.findById('institutions', t.institutionId);
    return {
      ...t,
      institutionName: inst ? inst.name : 'Partner College',
      institutionLogo: inst ? inst.logo : '🏛️'
    };
  });

  res.json({ success: true, data: enriched });
});

// List all cross-college training sessions & masterclasses
router.get('/sessions', (req, res) => {
  const sessions = db.get('training_sessions');
  const enriched = sessions.map(s => {
    const trainer = db.findById('trainers', s.trainerId);
    const hostInst = db.findById('institutions', s.hostInstitutionId);
    return {
      ...s,
      trainerName: trainer ? trainer.name : 'Distinguished Faculty',
      trainerAvatar: trainer ? trainer.avatar : '👨‍🏫',
      trainerDomain: trainer ? trainer.domain : '',
      hostInstitutionName: hostInst ? hostInst.name : 'Host Campus'
    };
  });
  res.json({ success: true, data: enriched });
});

// Register student / faculty for a training session
router.post('/sessions/:id/register', (req, res) => {
  const session = db.findById('training_sessions', req.params.id);
  if (!session) {
    return res.status(404).json({ success: false, message: 'Training session not found' });
  }

  const registeredCount = (session.registeredCount || 0) + 1;
  const updated = db.update('training_sessions', session.id, { registeredCount });

  const userId = req.headers['x-user-id'] || req.body.userId;
  const user = userId ? db.findById('users', userId) : null;

  db.logActivity(
    'SESSION_REGISTERED',
    `${user ? user.name : 'A participant'} registered for cluster workshop '${session.title}'.`,
    userId,
    user ? user.institutionId : null
  );

  res.json({
    success: true,
    data: updated,
    message: 'Registered successfully for cluster workshop! Calendar invite dispatched.'
  });
});

// Create a new masterclass/training session
router.post('/sessions', (req, res) => {
  const { title, domain, trainerId, hostInstitutionId, scheduledDate, timeSlot, mode, venue, maxCapacity, prerequisites, badgeTitle } = req.body;
  if (!title || !trainerId || !scheduledDate) {
    return res.status(400).json({ success: false, message: 'Title, trainer, and scheduled date are required' });
  }

  const session = db.insert('training_sessions', {
    title,
    domain: domain || 'General Technology',
    trainerId,
    hostInstitutionId: hostInstitutionId || 'inst_1',
    scheduledDate,
    timeSlot: timeSlot || '02:00 PM - 05:00 PM',
    mode: mode || 'Hybrid',
    venue: venue || 'Cluster Multi-Media Amphitheater',
    maxCapacity: Number(maxCapacity) || 150,
    registeredCount: 1,
    status: 'open',
    prerequisites: prerequisites || 'Open to all cluster students',
    badgeTitle: badgeTitle || 'Cluster Skill Participant'
  });

  db.logActivity(
    'WORKSHOP_PUBLISHED',
    `New cluster workshop '${title}' announced for ${scheduledDate}.`,
    trainerId,
    hostInstitutionId
  );

  res.status(201).json({ success: true, data: session });
});

// Add new trainer profile
router.post('/', (req, res) => {
  const { name, institutionId, domain, specializations, yearsExp, bio, availability } = req.body;
  if (!name || !institutionId || !domain) {
    return res.status(400).json({ success: false, message: 'Name, institution, and domain are required' });
  }

  const newTrainer = db.insert('trainers', {
    name,
    institutionId,
    domain,
    specializations: Array.isArray(specializations) ? specializations : (specializations ? specializations.split(',').map(s => s.trim()) : []),
    yearsExp: Number(yearsExp) || 5,
    rating: 5.0,
    totalSessions: 0,
    hourlyRate: 'Free under Cluster MOU',
    bio: bio || 'Expert faculty member offering cross-campus mentorship.',
    availability: availability || 'Flexible / On-Demand',
    avatar: '👨‍🏫'
  });

  res.status(201).json({ success: true, data: newTrainer });
});

module.exports = router;
