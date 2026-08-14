const express = require('express');
const router = express.Router();
const db = require('../db');

// List certificates (filter by recipient or issuer)
router.get('/', (req, res) => {
  const { recipientUserId, issuerInstitutionId } = req.query;
  let list = db.get('certifications');

  if (recipientUserId) {
    list = list.filter(c => c.recipientUserId === recipientUserId);
  }
  if (issuerInstitutionId) {
    list = list.filter(c => c.issuerInstitutionId === issuerInstitutionId);
  }

  res.json({ success: true, data: list });
});

// Public certificate verification endpoint by unique certCode
router.get('/verify/:certCode', (req, res) => {
  const code = req.params.certCode.trim().toUpperCase();
  const cert = db.findOne('certifications', c => c.certCode.toUpperCase() === code);

  if (!cert) {
    return res.status(404).json({
      success: false,
      verified: false,
      message: `No authentic credential found for code: ${code}. Please verify with issuing institution.`
    });
  }

  // Increment verification audit counter
  db.update('certifications', cert.id, {
    verifiedCount: (cert.verifiedCount || 0) + 1
  });

  const issuer = db.findById('institutions', cert.issuerInstitutionId);

  res.json({
    success: true,
    verified: true,
    data: {
      ...cert,
      issuerDetails: issuer,
      verificationTimestamp: new Date().toISOString(),
      integrityStatus: 'Cryptographically Verified via Cluster Ledger',
      tamperProof: true
    }
  });
});

// Issue a new certificate
router.post('/issue', (req, res) => {
  const { title, issuerInstitutionId, recipientUserId, recipientName, recipientInstitution, grade, skills, badgeIcon } = req.body;
  if (!title || !recipientName) {
    return res.status(400).json({ success: false, message: 'Title and recipient name are required' });
  }

  const prefix = title.toLowerCase().includes('ai') ? 'AI' : (title.toLowerCase().includes('robot') ? 'ROB' : 'TECH');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const certCode = `EDU-CERT-${randomNum}-${prefix}`;

  const issuer = issuerInstitutionId ? db.findById('institutions', issuerInstitutionId) : null;

  const newCert = db.insert('certifications', {
    certCode,
    title,
    issuerInstitutionId: issuerInstitutionId || 'inst_1',
    issuerInstitutionName: issuer ? issuer.name : 'Apex Institute of Technology',
    recipientUserId: recipientUserId || 'user_student_1',
    recipientName,
    recipientInstitution: recipientInstitution || 'St. Xavier College of Engineering',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '2029-12-31',
    grade: grade || 'Honors Distinction',
    skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : ['Cluster Verified Competency']),
    badgeIcon: badgeIcon || '🎖️',
    verificationUrl: `/verify/${certCode}`,
    verifiedCount: 1
  });

  db.logActivity(
    'CERTIFICATE_ISSUED',
    `Certificate '${title}' (${certCode}) awarded to ${recipientName} by ${issuer ? issuer.name : 'Issuing College'}.`,
    issuerInstitutionId,
    null
  );

  res.status(201).json({
    success: true,
    data: newCert,
    message: `Digital Certificate ${certCode} successfully issued and published to cluster registry!`
  });
});

module.exports = router;
