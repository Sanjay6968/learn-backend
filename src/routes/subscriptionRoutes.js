const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Course = require('../models/Course');
const Subscription = require('../models/Subscription');

// ─── Valid promo codes map ────────────────────────────────
const PROMO_CODES = {
  BFSALE25: { discount: 0.50, label: '50% off' },   // 50 % discount (Black Friday)
};

// ─── POST /api/subscriptions/subscribe ───────────────────
router.post('/subscribe', authMiddleware, async (req, res) => {
  try {
    const { courseId, promoCode } = req.body;
    const userId = req.user.id;

    // ── Validate course exists ─────────────────────────
    if (!courseId) {
      return res.status(400).json({ message: 'courseId is required' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // ── Check for duplicate subscription ────────────────
    const alreadySubscribed = await Subscription.findOne({ userId, courseId });
    if (alreadySubscribed) {
      return res.status(409).json({ message: 'You are already subscribed to this course' });
    }

    let pricePaid = course.price;
    let promoApplied = false;
    let originalPrice = course.price;

    // ── Subscription logic based on course type ─────────
    if (course.price === 0) {
      // FREE course – instant subscription, no promo needed
      pricePaid = 0;
    } else {
      // PAID course – promo code is required
      if (!promoCode) {
        return res.status(400).json({ message: 'Promo code is required for paid courses' });
      }

      const upperPromo = promoCode.toUpperCase().trim();
      const promo = PROMO_CODES[upperPromo];

      if (!promo) {
        return res.status(400).json({ message: 'Invalid promo code' });
      }

      // Apply discount
      pricePaid = parseFloat((course.price * (1 - promo.discount)).toFixed(2));
      promoApplied = true;
    }

    // ── Create subscription document ─────────────────────
    const subscription = await Subscription.create({
      userId,
      courseId,
      pricePaid,
      promoApplied,
      originalPrice,
      subscribedAt: new Date(),
    });

    res.status(201).json({
      message: 'Successfully subscribed!',
      subscription: {
        id: subscription._id,
        courseId: subscription.courseId,
        pricePaid: subscription.pricePaid,
        originalPrice: subscription.originalPrice,
        promoApplied: subscription.promoApplied,
        subscribedAt: subscription.subscribedAt,
      },
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    // Duplicate key from compound index
    if (err.code === 11000) {
      return res.status(409).json({ message: 'You are already subscribed to this course' });
    }
    console.error('[POST /subscribe]', err);
    res.status(500).json({ message: 'Server error during subscription' });
  }
});

// ─── POST /api/subscriptions/validate-promo ──────────────
router.post('/validate-promo', authMiddleware, async (req, res) => {
  try {
    const { promoCode, courseId } = req.body;

    if (!promoCode || !courseId) {
      return res.status(400).json({ message: 'promoCode and courseId are required' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const upperPromo = promoCode.toUpperCase().trim();
    const promo = PROMO_CODES[upperPromo];

    if (!promo) {
      return res.status(400).json({ message: 'Invalid promo code', valid: false });
    }

    const discountedPrice = parseFloat((course.price * (1 - promo.discount)).toFixed(2));

    res.json({
      valid: true,
      label: promo.label,
      originalPrice: course.price,
      discountedPrice,
      savings: parseFloat((course.price - discountedPrice).toFixed(2)),
    });
  } catch (err) {
    console.error('[POST /validate-promo]', err);
    res.status(500).json({ message: 'Server error validating promo' });
  }
});

// ─── GET /api/subscriptions/my-courses ───────────────────
router.get('/my-courses', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const subscriptions = await Subscription.find({ userId })
      .populate('courseId', 'title description price image category instructor duration level')
      .sort({ subscribedAt: -1 });

    const myCourses = subscriptions.map((sub) => ({
      subscriptionId: sub._id,
      course: sub.courseId,
      pricePaid: sub.pricePaid,
      originalPrice: sub.originalPrice,
      promoApplied: sub.promoApplied,
      subscribedAt: sub.subscribedAt,
    }));

    res.json({ myCourses });
  } catch (err) {
    console.error('[GET /my-courses]', err);
    res.status(500).json({ message: 'Failed to fetch your courses' });
  }
});

module.exports = router;
