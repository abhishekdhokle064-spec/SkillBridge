import seedData from '../data/seedData.json';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Complete initial dataset fallback
const FALLBACK_DATA = seedData;

// Local storage helper
function getStore() {
  try {
    const raw = localStorage.getItem('skillbridge_local_db');
    if (!raw) {
      localStorage.setItem('skillbridge_local_db', JSON.stringify(FALLBACK_DATA));
      return FALLBACK_DATA;
    }
    const parsed = JSON.parse(raw);
    if (!parsed.reviews || !parsed.resources || parsed.resources.length === 0) {
      localStorage.setItem('skillbridge_local_db', JSON.stringify(FALLBACK_DATA));
      return FALLBACK_DATA;
    }
    return parsed;
  } catch (e) {
    return FALLBACK_DATA;
  }
}

function saveStore(data) {
  try {
    localStorage.setItem('skillbridge_local_db', JSON.stringify(data));
  } catch (e) {}
}

async function request(endpoint, options = {}) {
  const activeUserId = localStorage.getItem('skillbridge_active_user_id') || 'user_student_1';
  
  const headers = {
    'Content-Type': 'application/json',
    'x-user-id': activeUserId,
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Network / offline error -> fallback to client mock
  }

  // Graceful standalone / offline client mock router
  const db = getStore();
  const [urlPath, queryString] = endpoint.split('?');
  const params = new URLSearchParams(queryString || '');

  // 1. Auth routes
  if (urlPath === '/auth/login' && options.method === 'POST') {
    const { email, password, role } = JSON.parse(options.body || '{}');
    let user = null;
    if (email && email.trim()) {
      user = (db.users || []).find(u => u.email && u.email.toLowerCase() === email.trim().toLowerCase());
      if (!user) {
        throw new Error('No account found with this email. Please sign up first.');
      }
      if (password && user.password && user.password !== password) {
        throw new Error('Incorrect password. Please try again.');
      }
    } else if (role) {
      user = (db.users || []).find(u => u.role === role);
    }
    user = user || db.users[0];
    return { success: true, token: `token_${user.id}`, user, message: `Welcome back, ${user.name}!` };
  }

  if (urlPath === '/auth/register' && options.method === 'POST') {
    const body = JSON.parse(options.body || '{}');
    const inst = (db.institutions || []).find(i => i.id === body.institutionId);
    const newUser = {
      id: `user_${Date.now()}`,
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      password: body.password || 'password123',
      role: body.role || 'student',
      institutionId: body.institutionId || 'inst_1',
      institutionName: inst ? inst.name : (body.company || 'Partner College'),
      department: body.department || 'Engineering',
      company: body.role === 'industry' ? body.company : null,
      title: `${(body.role || 'student').toUpperCase()} | ${inst ? inst.code : 'SkillBridge'}`,
      cgpa: body.role === 'student' ? 9.0 : undefined,
      avatarImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
    };
    db.users = [newUser, ...(db.users || [])];
    saveStore(db);
    return { success: true, token: `token_${newUser.id}`, user: newUser, message: `Account created for ${newUser.name}!` };
  }

  if (urlPath === '/auth/me') {
    const activeUser = (db.users || []).find(u => u.id === activeUserId) || db.users[0];
    if (options.method === 'PUT') {
      const body = JSON.parse(options.body || '{}');
      Object.assign(activeUser, body);
      saveStore(db);
      return { success: true, user: activeUser };
    }
    return { success: true, user: activeUser };
  }

  if (urlPath === '/auth/institutions') {
    return { success: true, data: db.institutions || [] };
  }

  if (urlPath === '/auth/users') {
    return { success: true, data: db.users || [] };
  }

  // 2. Resources & Bookings
  if (urlPath === '/resources/bookings/all') {
    let list = db.resource_bookings || [];
    const statusParam = params.get('status');
    const userParam = params.get('userId');
    if (statusParam && statusParam !== 'All') {
      list = list.filter(b => (b.status || '').toLowerCase() === statusParam.toLowerCase());
    }
    if (userParam) {
      list = list.filter(b => b.studentUserId === userParam);
    }
    return { success: true, data: list };
  }

  if (urlPath.startsWith('/resources/bookings/') && options.method === 'PATCH') {
    const bookingId = urlPath.split('/').pop();
    const body = JSON.parse(options.body || '{}');
    const bk = (db.resource_bookings || []).find(b => b.id === bookingId);
    if (bk) {
      Object.assign(bk, body);
      saveStore(db);
      return { success: true, data: bk };
    }
    return { success: true, message: 'Updated' };
  }

  if (urlPath.includes('/book') && options.method === 'POST') {
    const body = JSON.parse(options.body || '{}');
    const newBk = {
      id: `bk_${Date.now()}`,
      resourceTitle: 'Reserved Facility',
      status: 'Confirmed',
      studentUserId: activeUserId,
      ...body
    };
    db.resource_bookings = [newBk, ...(db.resource_bookings || [])];
    saveStore(db);
    return { success: true, data: newBk };
  }

  if (urlPath === '/resources' && options.method === 'POST') {
    const body = JSON.parse(options.body || '{}');
    const newRes = { id: `res_${Date.now()}`, ...body, status: 'Available' };
    db.resources = [newRes, ...(db.resources || [])];
    saveStore(db);
    return { success: true, data: newRes };
  }

  if (urlPath.startsWith('/resources/') && !urlPath.includes('bookings') && !urlPath.includes('book')) {
    const id = urlPath.split('/')[2];
    const found = (db.resources || []).find(r => r.id === id);
    return { success: true, data: found || db.resources[0] };
  }

  if (urlPath === '/resources') {
    return { success: true, data: db.resources || [] };
  }

  // 3. Reviews & Ratings API
  if (urlPath === '/reviews' && options.method === 'POST') {
    const body = JSON.parse(options.body || '{}');
    const newReview = {
      id: `rev_${Date.now()}`,
      targetType: body.targetType || 'resource',
      targetId: body.targetId || 'res_1',
      targetTitle: body.targetTitle || 'Facility',
      bookingId: body.bookingId || '',
      userId: activeUserId,
      userName: body.userName || 'Scholar',
      userAvatar: '👨‍🎓',
      userInstitution: body.userInstitution || 'GEC Nashik',
      rating: Number(body.rating || 5),
      reviewText: body.reviewText || '',
      categoryRatings: body.categoryRatings || { facilityQuality: 5, staffSupport: 5, learningExp: 5, infrastructure: 5 },
      verified: true,
      helpfulCount: 0,
      helpfulUsers: [],
      status: 'active',
      createdAt: new Date().toISOString()
    };
    db.reviews = [newReview, ...(db.reviews || [])];
    saveStore(db);
    return { success: true, data: newReview };
  }

  if (urlPath.startsWith('/reviews/') && urlPath.endsWith('/helpful') && options.method === 'POST') {
    const reviewId = urlPath.split('/')[2];
    const { userId } = JSON.parse(options.body || '{}');
    const rev = (db.reviews || []).find(r => r.id === reviewId);
    if (rev) {
      if (!rev.helpfulUsers) rev.helpfulUsers = [];
      const hasUpvoted = rev.helpfulUsers.includes(userId);
      if (hasUpvoted) {
        rev.helpfulUsers = rev.helpfulUsers.filter(u => u !== userId);
        rev.helpfulCount = Math.max(0, (rev.helpfulCount || 1) - 1);
      } else {
        rev.helpfulUsers.push(userId);
        rev.helpfulCount = (rev.helpfulCount || 0) + 1;
      }
      saveStore(db);
      return { success: true, helpfulCount: rev.helpfulCount, hasUpvoted: !hasUpvoted };
    }
  }

  if (urlPath.startsWith('/reviews/') && urlPath.endsWith('/moderate') && options.method === 'PATCH') {
    const reviewId = urlPath.split('/')[2];
    const body = JSON.parse(options.body || '{}');
    const rev = (db.reviews || []).find(r => r.id === reviewId);
    if (rev) {
      Object.assign(rev, body);
      saveStore(db);
      return { success: true, data: rev };
    }
  }

  if (urlPath.startsWith('/reviews/') && options.method === 'PUT') {
    const reviewId = urlPath.split('/')[2];
    const body = JSON.parse(options.body || '{}');
    const rev = (db.reviews || []).find(r => r.id === reviewId);
    if (rev) {
      Object.assign(rev, body);
      saveStore(db);
      return { success: true, data: rev };
    }
  }

  if (urlPath.startsWith('/reviews/') && options.method === 'DELETE') {
    const reviewId = urlPath.split('/')[2];
    db.reviews = (db.reviews || []).filter(r => r.id !== reviewId);
    saveStore(db);
    return { success: true, message: 'Deleted' };
  }

  if (urlPath === '/reviews') {
    let list = db.reviews || [];
    const targetType = params.get('targetType');
    const targetId = params.get('targetId');
    const userId = params.get('userId');
    const rating = params.get('rating');
    const search = params.get('search');
    const sort = params.get('sort') || 'recent';

    if (targetType && targetType !== 'all') {
      list = list.filter(r => (r.targetType || '').toLowerCase() === targetType.toLowerCase());
    }
    if (targetId) {
      list = list.filter(r => String(r.targetId) === String(targetId));
    }
    if (userId) {
      list = list.filter(r => String(r.userId) === String(userId));
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(r =>
        (r.reviewText && r.reviewText.toLowerCase().includes(q)) ||
        (r.userName && r.userName.toLowerCase().includes(q)) ||
        (r.targetTitle && r.targetTitle.toLowerCase().includes(q))
      );
    }

    // Compute stats on target set before rating filter
    const total = list.length;
    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sumRating = 0;
    let sumFacility = 0, countFacility = 0;
    let sumStaff = 0, countStaff = 0;
    let sumLearning = 0, countLearning = 0;
    let sumInfra = 0, countInfra = 0;

    list.forEach(r => {
      const rScore = Math.max(1, Math.min(5, Math.round(r.rating || 5)));
      ratingDistribution[rScore] = (ratingDistribution[rScore] || 0) + 1;
      sumRating += Number(r.rating || 5);

      if (r.categoryRatings) {
        if (r.categoryRatings.facilityQuality) { sumFacility += Number(r.categoryRatings.facilityQuality); countFacility++; }
        if (r.categoryRatings.staffSupport) { sumStaff += Number(r.categoryRatings.staffSupport); countStaff++; }
        if (r.categoryRatings.learningExp) { sumLearning += Number(r.categoryRatings.learningExp); countLearning++; }
        if (r.categoryRatings.infrastructure) { sumInfra += Number(r.categoryRatings.infrastructure); countInfra++; }
      }
    });

    if (rating && rating !== 'all') {
      list = list.filter(r => Math.round(Number(r.rating)) === Math.round(Number(rating)));
    }

    list.sort((a, b) => {
      if (sort === 'highest') return (b.rating || 0) - (a.rating || 0);
      if (sort === 'lowest') return (a.rating || 0) - (b.rating || 0);
      if (sort === 'helpful') return (b.helpfulCount || 0) - (a.helpfulCount || 0);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    const averageRating = total > 0 ? Number((sumRating / total).toFixed(1)) : 4.8;
    const categoryAverages = {
      facilityQuality: countFacility > 0 ? Number((sumFacility / countFacility).toFixed(1)) : 4.8,
      staffSupport: countStaff > 0 ? Number((sumStaff / countStaff).toFixed(1)) : 4.7,
      learningExp: countLearning > 0 ? Number((sumLearning / countLearning).toFixed(1)) : 4.9,
      infrastructure: countInfra > 0 ? Number((sumInfra / countInfra).toFixed(1)) : 4.8
    };

    return {
      success: true,
      data: list,
      stats: {
        averageRating,
        totalReviews: total,
        ratingDistribution,
        categoryAverages
      }
    };
  }

  // 4. Trainers & Training Sessions
  if (urlPath === '/trainers/sessions' && options.method === 'POST') {
    const body = JSON.parse(options.body || '{}');
    const newSess = { id: `sess_${Date.now()}`, ...body, enrolledCount: 1 };
    db.training_sessions = [newSess, ...(db.training_sessions || [])];
    saveStore(db);
    return { success: true, data: newSess };
  }

  if (urlPath.includes('/trainers/sessions/') && urlPath.endsWith('/register') && options.method === 'POST') {
    return { success: true, message: 'Enrolled successfully' };
  }

  if (urlPath === '/trainers/sessions') {
    return { success: true, data: db.training_sessions || [] };
  }

  if (urlPath === '/trainers') {
    return { success: true, data: db.trainers || [] };
  }

  // 5. Internships & Applications
  if (urlPath.includes('/internships/') && urlPath.endsWith('/apply') && options.method === 'POST') {
    const body = JSON.parse(options.body || '{}');
    const newApp = {
      id: `app_${Date.now()}`,
      applicantName: 'Rahul Sharma',
      applicantInstitutionName: 'Government Engineering College, Nashik',
      status: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0],
      ...body
    };
    db.internship_applications = [newApp, ...(db.internship_applications || [])];
    saveStore(db);
    return { success: true, data: newApp };
  }

  if (urlPath === '/internships/applications/all') {
    return { success: true, data: db.internship_applications || [] };
  }

  if (urlPath === '/internships') {
    return { success: true, data: db.internships || [] };
  }

  // 6. Placements
  if (urlPath === '/placements/drives') {
    return { success: true, data: db.placement_drives || [] };
  }

  if (urlPath === '/placements/candidates/all') {
    return { success: true, data: db.placement_candidates || [] };
  }

  // 7. Certifications
  if (urlPath.startsWith('/certifications/verify/')) {
    const code = decodeURIComponent(urlPath.split('/').pop());
    const cert = (db.certifications || []).find(c => c.certCode === code || c.id === code);
    if (cert) return { success: true, data: cert };
    return { success: false, message: 'Certificate not found' };
  }

  if (urlPath === '/certifications') {
    return { success: true, data: db.certifications || [] };
  }

  if (urlPath === '/analytics/overview') {
    return {
      success: true,
      data: {
        institutionsCount: (db.institutions || []).length,
        labsCount: (db.resources || []).length,
        activeStudents: 1240,
        internshipsCount: (db.internships || []).length,
        placementsCount: (db.placement_candidates || []).length
      }
    };
  }

  if (urlPath === '/analytics/reset-seed') {
    localStorage.removeItem('skillbridge_local_db');
    return { success: true, message: 'Reset done' };
  }

  return { success: true, data: [] };
}

export const api = {
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getInstitutions: () => request('/auth/institutions'),
  getUsers: () => request('/auth/users'),
  getCurrentUser: () => request('/auth/me'),
  updateProfile: (data) => request('/auth/me', { method: 'PUT', body: JSON.stringify(data) }),

  getResources: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/resources${qs ? '?' + qs : ''}`);
  },
  getResourceById: (id) => request(`/resources/${id}`),
  createResource: (data) => request('/resources', { method: 'POST', body: JSON.stringify(data) }),
  bookResource: (id, data) => request(`/resources/${id}/book`, { method: 'POST', body: JSON.stringify(data) }),
  getBookings: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/resources/bookings/all${qs ? '?' + qs : ''}`);
  },
  updateBooking: (id, data) => request(`/resources/bookings/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  getTrainers: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/trainers${qs ? '?' + qs : ''}`);
  },
  getTrainingSessions: () => request('/trainers/sessions'),
  createTrainingSession: (data) => request('/trainers/sessions', { method: 'POST', body: JSON.stringify(data) }),
  registerTrainingSession: (id, data = {}) => request(`/trainers/sessions/${id}/register`, { method: 'POST', body: JSON.stringify(data) }),
  addTrainer: (data) => request('/trainers', { method: 'POST', body: JSON.stringify(data) }),

  getInternships: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/internships${qs ? '?' + qs : ''}`);
  },
  postInternship: (data) => request('/internships', { method: 'POST', body: JSON.stringify(data) }),
  applyInternship: (id, data) => request(`/internships/${id}/apply`, { method: 'POST', body: JSON.stringify(data) }),
  getApplications: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/internships/applications/all${qs ? '?' + qs : ''}`);
  },
  updateApplicationStatus: (id, data) => request(`/internships/applications/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  getCertifications: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/certifications${qs ? '?' + qs : ''}`);
  },
  verifyCertificate: (code) => request(`/certifications/verify/${code}`),
  issueCertificate: (data) => request('/certifications/issue', { method: 'POST', body: JSON.stringify(data) }),

  getPlacementDrives: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/placements/drives${qs ? '?' + qs : ''}`);
  },
  getPlacementDriveById: (id) => request(`/placements/drives/${id}`),
  createPlacementDrive: (data) => request('/placements/drives', { method: 'POST', body: JSON.stringify(data) }),
  registerForDrive: (id, data) => request(`/placements/drives/${id}/register`, { method: 'POST', body: JSON.stringify(data) }),
  getCandidates: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/placements/candidates/all${qs ? '?' + qs : ''}`);
  },
  advanceCandidate: (id, data) => request(`/placements/candidates/${id}/advance`, { method: 'PATCH', body: JSON.stringify(data) }),

  getAnalyticsOverview: () => request('/analytics/overview'),
  resetSeed: () => request('/analytics/reset-seed', { method: 'POST' }),

  // Review & Rating System API
  getReviews: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/reviews${qs ? '?' + qs : ''}`);
  },
  getReviewById: (id) => request(`/reviews/${id}`),
  createReview: (data) => request('/reviews', { method: 'POST', body: JSON.stringify(data) }),
  updateReview: (id, data) => request(`/reviews/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteReview: (id) => request(`/reviews/${id}`, { method: 'DELETE' }),
  toggleHelpful: (id, userId) => request(`/reviews/${id}/helpful`, { method: 'POST', body: JSON.stringify({ userId }) }),
  moderateReview: (id, data) => request(`/reviews/${id}/moderate`, { method: 'PATCH', body: JSON.stringify(data) }),
};
