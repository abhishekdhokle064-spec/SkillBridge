const express = require('express');
const router = express.Router();
const db = require('../db');

// List reviews with filters & computed summary statistics
router.get('/', (req, res) => {
  const { targetType, targetId, userId, rating, status, sort, search } = req.query;
  let list = db.get('reviews') || [];

  // Filter by targetType ('resource', 'course', 'internship', 'all')
  if (targetType && targetType !== 'all') {
    list = list.filter(r => (r.targetType || '').toLowerCase() === targetType.toLowerCase());
  }

  // Filter by targetId
  if (targetId) {
    list = list.filter(r => String(r.targetId) === String(targetId));
  }

  // Filter by author userId
  if (userId) {
    list = list.filter(r => String(r.userId) === String(userId));
  }

  // Calculate statistics over the target set (before rating filter)
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

  // Filter by star rating (after computing global target distribution)
  if (rating && rating !== 'all') {
    list = list.filter(r => Math.round(Number(r.rating)) === Math.round(Number(rating)));
  }

  const averageRating = total > 0 ? Number((sumRating / total).toFixed(1)) : 4.8;
  const categoryAverages = {
    facilityQuality: countFacility > 0 ? Number((sumFacility / countFacility).toFixed(1)) : 4.8,
    staffSupport: countStaff > 0 ? Number((sumStaff / countStaff).toFixed(1)) : 4.7,
    learningExp: countLearning > 0 ? Number((sumLearning / countLearning).toFixed(1)) : 4.9,
    infrastructure: countInfra > 0 ? Number((sumInfra / countInfra).toFixed(1)) : 4.8
  };

  // Sorting
  const sortMode = sort || 'recent';
  list.sort((a, b) => {
    if (sortMode === 'highest') return (b.rating || 0) - (a.rating || 0);
    if (sortMode === 'lowest') return (a.rating || 0) - (b.rating || 0);
    if (sortMode === 'helpful') return (b.helpfulCount || 0) - (a.helpfulCount || 0);
    // default: recent
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  res.json({
    success: true,
    data: list,
    stats: {
      totalReviews: total,
      averageRating,
      ratingDistribution,
      categoryAverages
    }
  });
});

// Get single review by id
router.get('/:id', (req, res) => {
  const review = db.findById('reviews', req.params.id);
  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }
  res.json({ success: true, data: review });
});

// Submit new review
router.post('/', (req, res) => {
  const {
    targetType,
    targetId,
    targetTitle,
    bookingId,
    enrollmentId,
    userId,
    userName,
    userAvatar,
    userInstitution,
    rating,
    reviewText,
    categoryRatings,
    verified
  } = req.body;

  if (!targetId || !userId || !rating || !reviewText) {
    return res.status(400).json({ 
      success: false, 
      message: 'Target ID, User ID, Rating (1-5), and Review comments are required.' 
    });
  }

  // Prevent duplicate review for the same completed booking
  const existingReviews = db.get('reviews') || [];
  if (bookingId) {
    const duplicate = existingReviews.find(r => r.bookingId === bookingId);
    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this booking.'
      });
    }
  }

  const newRecord = db.insert('reviews', {
    targetType: targetType || 'resource',
    targetId: String(targetId),
    targetTitle: targetTitle || 'Cluster Resource',
    bookingId: bookingId || null,
    enrollmentId: enrollmentId || null,
    userId: String(userId),
    userName: userName || 'Student Scholar',
    userAvatar: userAvatar || '👨‍🎓',
    userInstitution: userInstitution || 'Cluster Institute',
    rating: Number(rating),
    reviewText: reviewText.trim(),
    categoryRatings: categoryRatings || {
      facilityQuality: Number(rating),
      staffSupport: Number(rating),
      learningExp: Number(rating),
      infrastructure: Number(rating)
    },
    verified: verified !== undefined ? verified : true,
    helpfulCount: 0,
    helpfulUsers: [],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  db.logActivity(
    'REVIEW_SUBMITTED',
    `New ${rating}★ review submitted for ${targetTitle || 'facility'} by ${userName || 'Scholar'}.`,
    userId,
    null
  );

  res.status(201).json({
    success: true,
    message: 'Thank you! Your review has been submitted.',
    data: newRecord
  });
});

// Update review
router.put('/:id', (req, res) => {
  const { rating, reviewText, categoryRatings } = req.body;
  const review = db.findById('reviews', req.params.id);
  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }

  const updated = db.update('reviews', req.params.id, {
    rating: rating !== undefined ? Number(rating) : review.rating,
    reviewText: reviewText !== undefined ? reviewText.trim() : review.reviewText,
    categoryRatings: categoryRatings || review.categoryRatings,
    updatedAt: new Date().toISOString()
  });

  res.json({
    success: true,
    message: 'Review updated successfully!',
    data: updated
  });
});

// Delete review
router.delete('/:id', (req, res) => {
  const deleted = db.delete('reviews', req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }
  res.json({ success: true, message: 'Review deleted successfully' });
});

// Toggle helpful vote
router.post('/:id/helpful', (req, res) => {
  const userId = req.body.userId || 'user_student_1';
  const review = db.findById('reviews', req.params.id);
  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }

  let helpfulUsers = Array.isArray(review.helpfulUsers) ? [...review.helpfulUsers] : [];
  let isHelpful = false;

  if (helpfulUsers.includes(userId)) {
    // Un-vote
    helpfulUsers = helpfulUsers.filter(u => u !== userId);
    isHelpful = false;
  } else {
    // Vote
    helpfulUsers.push(userId);
    isHelpful = true;
  }

  const updated = db.update('reviews', req.params.id, {
    helpfulUsers,
    helpfulCount: helpfulUsers.length
  });

  res.json({
    success: true,
    isHelpful,
    helpfulCount: updated.helpfulCount,
    message: isHelpful ? 'Marked review as helpful!' : 'Removed helpful vote.'
  });
});

// Admin moderation (hide, approve, report, verify)
router.patch('/:id/moderate', (req, res) => {
  const { status, verified } = req.body;
  const review = db.findById('reviews', req.params.id);
  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }

  const updates = {};
  if (status !== undefined) updates.status = status;
  if (verified !== undefined) updates.verified = verified;

  const updated = db.update('reviews', req.params.id, updates);
  res.json({
    success: true,
    message: 'Review moderation status updated.',
    data: updated
  });
});

module.exports = router;
