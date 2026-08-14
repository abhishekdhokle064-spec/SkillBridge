const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all institutions
router.get('/institutions', (req, res) => {
  const institutions = db.get('institutions');
  res.json({ success: true, data: institutions });
});

// Get all users
router.get('/users', (req, res) => {
  const users = db.get('users');
  res.json({ success: true, data: users });
});

// Get current user profile (or by id)
router.get('/me', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user_student_1';
  const user = db.findById('users', userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  const institution = user.institutionId ? db.findById('institutions', user.institutionId) : null;
  res.json({ success: true, data: { ...user, institution } });
});

// Login
router.post('/login', (req, res) => {
  const { email, password, role } = req.body;
  const users = db.get('users');

  let user = null;
  if (email && email.trim()) {
    user = users.find(u => u.email && u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'No account found with this email. Please sign up or check your spelling.'
      });
    }

    if (password && user.password && user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password. Please try again.'
      });
    }
  } else if (role) {
    user = users.find(u => u.role === role);
  }

  if (!user) {
    user = users[0];
  }

  const institution = user.institutionId ? db.findById('institutions', user.institutionId) : null;
  const token = `jwt_token_skillbridge_${user.id}_${Date.now()}`;

  res.json({
    success: true,
    message: `Welcome back, ${user.name}!`,
    token,
    user: {
      ...user,
      institution
    }
  });
});

// Register
router.post('/register', (req, res) => {
  const { name, email, password, role, institutionId, department, company, title } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Full name and email are required' });
  }

  const existing = db.get('users').find(u => u.email && u.email.toLowerCase() === email.trim().toLowerCase());
  if (existing) {
    return res.status(400).json({ success: false, message: 'An account with this email already exists. Please sign in.' });
  }

  const inst = institutionId ? db.findById('institutions', institutionId) : null;
  const userRole = role || 'student';

  const newUser = db.insert('users', {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: password || 'password123',
    role: userRole,
    institutionId: institutionId || (inst ? inst.id : 'inst_1'),
    institutionName: inst ? inst.name : (company || 'Cluster Partner Institute'),
    department: department || 'Engineering & Technology',
    company: company || (userRole === 'industry' ? 'Enterprise Partner' : null),
    title: title || `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} | ${inst ? inst.code : 'SkillBridge'}`,
    cgpa: userRole === 'student' ? 9.0 : undefined,
    avatar: userRole === 'student' ? '👨‍🎓' : (userRole === 'institution' ? '👨‍🏫' : (userRole === 'trainer' ? '👩‍🔬' : '💼')),
    avatarImg: userRole === 'student' 
      ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
      : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
  });

  db.logActivity(
    'USER_REGISTERED',
    `New ${userRole} account created for ${name} (${email}).`,
    newUser.id,
    institutionId
  );

  const token = `jwt_token_skillbridge_${newUser.id}_${Date.now()}`;

  res.status(201).json({
    success: true,
    message: `Account created successfully for ${name}!`,
    token,
    user: {
      ...newUser,
      institution: inst
    }
  });
});

// Update user profile
router.put('/me', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user_student_1';
  const updates = req.body;
  const updated = db.update('users', userId, updates);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.json({ success: true, data: updated });
});

module.exports = router;
