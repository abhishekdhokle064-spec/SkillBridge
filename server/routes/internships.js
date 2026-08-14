const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all active internships
router.get('/', (req, res) => {
  const { search, type } = req.query;
  let list = db.get('internships');

  if (type && type !== 'All') {
    list = list.filter(i => i.type.toLowerCase().includes(type.toLowerCase()));
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(i =>
      i.title.toLowerCase().includes(q) ||
      i.companyName.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, data: list });
});

// Post a new internship (by Recruiter or College Placement Cell)
router.post('/', (req, res) => {
  const { companyName, title, location, type, stipend, openings, minDurationMonths, deadline, description, requirements, eligibleInstitutions, logo } = req.body;
  if (!companyName || !title || !stipend) {
    return res.status(400).json({ success: false, message: 'Company, title, and stipend are required' });
  }

  const internship = db.insert('internships', {
    companyName,
    title,
    location: location || 'Hybrid',
    type: type || 'Full-time Paid Internship',
    stipend,
    openings: Number(openings) || 5,
    minDurationMonths: Number(minDurationMonths) || 6,
    deadline: deadline || '2026-09-30',
    description: description || 'Exciting industry opportunity for cluster students.',
    requirements: Array.isArray(requirements) ? requirements : (requirements ? requirements.split(',').map(r => r.trim()) : ['Good problem-solving ability']),
    eligibleInstitutions: eligibleInstitutions || ['All Cluster Partner Institutions'],
    clusterWide: true,
    status: 'active',
    logo: logo || '💼'
  });

  db.logActivity(
    'INTERNSHIP_POSTED',
    `${companyName} posted new internship opportunity: '${title}' (${stipend}).`,
    req.headers['x-user-id'] || 'recruiter',
    null
  );

  res.status(201).json({ success: true, data: internship });
});

// Submit internship application
router.post('/:id/apply', (req, res) => {
  const internshipId = req.params.id;
  const internship = db.findById('internships', internshipId);
  if (!internship) {
    return res.status(404).json({ success: false, message: 'Internship not found' });
  }

  const { studentUserId, studentName, studentInstitutionId, resumeUrl, coverNote } = req.body;
  if (!studentUserId) {
    return res.status(400).json({ success: false, message: 'Student information is required' });
  }

  const inst = studentInstitutionId ? db.findById('institutions', studentInstitutionId) : null;

  // Check if already applied
  const existing = db.findOne('internship_applications', a => a.internshipId === internshipId && a.studentUserId === studentUserId);
  if (existing) {
    return res.status(400).json({ success: false, message: 'You have already submitted an application for this position.' });
  }

  const application = db.insert('internship_applications', {
    internshipId,
    studentUserId,
    studentName: studentName || 'Student Applicant',
    studentInstitutionId: studentInstitutionId || 'inst_3',
    studentInstitutionName: inst ? inst.name : 'Cluster College',
    resumeUrl: resumeUrl || 'https://drive.google.com/sample_resume.pdf',
    coverNote: coverNote || 'Passionate about applying cluster learning in high-impact industrial projects.',
    appliedAt: new Date().toISOString(),
    status: 'applied',
    feedback: 'Application under preliminary screening'
  });

  db.logActivity(
    'INTERNSHIP_APPLIED',
    `${studentName || 'Student'} applied for ${internship.companyName}'s ${internship.title}.`,
    studentUserId,
    studentInstitutionId
  );

  res.status(201).json({
    success: true,
    data: application,
    message: 'Application submitted successfully to corporate talent pool!'
  });
});

// Get applications (filter by student, internship, or recruiter)
router.get('/applications/all', (req, res) => {
  const { studentUserId, internshipId, status } = req.query;
  let applications = db.get('internship_applications');

  if (studentUserId) {
    applications = applications.filter(a => a.studentUserId === studentUserId);
  }
  if (internshipId) {
    applications = applications.filter(a => a.internshipId === internshipId);
  }
  if (status && status !== 'All') {
    applications = applications.filter(a => a.status === status);
  }

  const enriched = applications.map(a => {
    const internship = db.findById('internships', a.internshipId);
    return {
      ...a,
      internshipTitle: internship ? internship.title : 'Position',
      companyName: internship ? internship.companyName : 'Company',
      stipend: internship ? internship.stipend : 'Competitive'
    };
  });

  res.json({ success: true, data: enriched });
});

// Update application status (Shortlist / Accept / Reject)
router.patch('/applications/:id', (req, res) => {
  const { status, feedback } = req.body;
  const application = db.findById('internship_applications', req.params.id);
  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }

  const updated = db.update('internship_applications', req.params.id, {
    status: status || application.status,
    feedback: feedback || application.feedback
  });

  res.json({ success: true, data: updated, message: `Application status updated to ${status}` });
});

module.exports = router;
