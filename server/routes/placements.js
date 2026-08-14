const express = require('express');
const router = express.Router();
const db = require('../db');

// List all cluster placement drives
router.get('/drives', (req, res) => {
  const { status, search } = req.query;
  let drives = db.get('placement_drives');

  if (status && status !== 'All') {
    drives = drives.filter(d => d.status === status);
  }
  if (search) {
    const q = search.toLowerCase();
    drives = drives.filter(d =>
      d.companyName.toLowerCase().includes(q) ||
      d.role.toLowerCase().includes(q) ||
      d.location.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, data: drives });
});

// Get single placement drive details with candidate pool
router.get('/drives/:id', (req, res) => {
  const drive = db.findById('placement_drives', req.params.id);
  if (!drive) {
    return res.status(404).json({ success: false, message: 'Placement drive not found' });
  }

  const candidates = db.filter('placement_candidates', c => c.driveId === drive.id);
  res.json({ success: true, data: { ...drive, candidates } });
});

// Create new pooled campus drive
router.post('/drives', (req, res) => {
  const { companyName, role, packageCtc, driveDate, registrationDeadline, location, minCgpa, eligibleBranches, openings, description, rounds, logo } = req.body;
  if (!companyName || !role || !packageCtc) {
    return res.status(400).json({ success: false, message: 'Company, role, and package CTC are required' });
  }

  const newDrive = db.insert('placement_drives', {
    companyName,
    role,
    packageCtc,
    driveDate: driveDate || '2026-09-25',
    registrationDeadline: registrationDeadline || '2026-09-15',
    location: location || 'Cluster Central Placement Hub (Apex Campus)',
    minCgpa: Number(minCgpa) || 7.0,
    eligibleBranches: Array.isArray(eligibleBranches) ? eligibleBranches : ['CSE', 'ECE', 'Mechanical', 'Robotics', 'Biotech'],
    openings: Number(openings) || 20,
    rounds: rounds || [
      { name: "Online Aptitude & Technical Screening", date: "Day 1", weight: "Screening" },
      { name: "Domain Lab Assessment", date: "Day 2", weight: "Technical" },
      { name: "Panel Discussion & HR", date: "Day 3", weight: "Final" }
    ],
    description: description || 'Inter-collegiate pooled placement drive for all cluster partner colleges.',
    status: 'active',
    registeredCandidates: 0,
    shortlistedCount: 0,
    offersIssued: 0,
    logo: logo || '🏢'
  });

  db.logActivity(
    'DRIVE_ANNOUNCED',
    `New Pooled Placement Drive by ${companyName} for ${role} (${packageCtc}) opened to all cluster students.`,
    req.headers['x-user-id'] || 'admin',
    null
  );

  res.status(201).json({ success: true, data: newDrive });
});

// Register student for placement drive
router.post('/drives/:id/register', (req, res) => {
  const drive = db.findById('placement_drives', req.params.id);
  if (!drive) {
    return res.status(404).json({ success: false, message: 'Placement drive not found' });
  }

  const { studentUserId, studentName, studentInstitutionName, cgpa, department } = req.body;
  if (!studentUserId) {
    return res.status(400).json({ success: false, message: 'Student information is required' });
  }

  const existing = db.findOne('placement_candidates', c => c.driveId === drive.id && c.studentUserId === studentUserId);
  if (existing) {
    return res.status(400).json({ success: false, message: 'You have already registered for this pooled placement drive.' });
  }

  const candidate = db.insert('placement_candidates', {
    driveId: drive.id,
    studentUserId,
    studentName: studentName || 'Candidate',
    studentInstitutionName: studentInstitutionName || 'Cluster College',
    cgpa: Number(cgpa) || 8.5,
    department: department || 'Engineering & Tech',
    currentRound: drive.rounds && drive.rounds.length > 0 ? drive.rounds[0].name : 'Round 1 Assessment',
    status: 'registered',
    interviewsScore: 85,
    offeredCtc: null
  });

  // Update drive registered counter
  db.update('placement_drives', drive.id, {
    registeredCandidates: (drive.registeredCandidates || 0) + 1
  });

  db.logActivity(
    'CANDIDATE_REGISTERED',
    `${studentName || 'Student'} registered for ${drive.companyName} recruitment drive.`,
    studentUserId,
    null
  );

  res.status(201).json({
    success: true,
    data: candidate,
    message: 'Registered successfully for cluster pooled drive! Hall ticket generated.'
  });
});

// Advance candidate round / Issue Offer
router.patch('/candidates/:id/advance', (req, res) => {
  const candidate = db.findById('placement_candidates', req.params.id);
  if (!candidate) {
    return res.status(404).json({ success: false, message: 'Candidate not found' });
  }

  const { nextRound, status, offeredCtc, interviewsScore } = req.body;
  const drive = db.findById('placement_drives', candidate.driveId);

  const updated = db.update('placement_candidates', candidate.id, {
    currentRound: nextRound || candidate.currentRound,
    status: status || candidate.status,
    offeredCtc: offeredCtc || candidate.offeredCtc,
    interviewsScore: interviewsScore !== undefined ? interviewsScore : candidate.interviewsScore
  });

  if (status === 'offered' && drive) {
    db.update('placement_drives', drive.id, {
      offersIssued: (drive.offersIssued || 0) + 1
    });

    db.logActivity(
      'OFFER_ISSUED',
      `🎉 Placement Offer extended to ${candidate.studentName} (${candidate.studentInstitutionName}) by ${drive.companyName} at ${offeredCtc || drive.packageCtc}!`,
      candidate.studentUserId,
      null
    );
  }

  res.json({ success: true, data: updated, message: 'Candidate status successfully updated' });
});

// Get all candidates for a specific student or all
router.get('/candidates/all', (req, res) => {
  const { studentUserId, driveId } = req.query;
  let list = db.get('placement_candidates');

  if (studentUserId) {
    list = list.filter(c => c.studentUserId === studentUserId);
  }
  if (driveId) {
    list = list.filter(c => c.driveId === driveId);
  }

  const enriched = list.map(c => {
    const drive = db.findById('placement_drives', c.driveId);
    return {
      ...c,
      companyName: drive ? drive.companyName : 'Company',
      role: drive ? drive.role : 'Role',
      drivePackage: drive ? drive.packageCtc : 'Competitive',
      driveLocation: drive ? drive.location : 'Campus'
    };
  });

  res.json({ success: true, data: enriched });
});

module.exports = router;
