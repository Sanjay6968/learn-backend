const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// ─── GET /api/courses ────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json({ courses });
  } catch (err) {
    console.error('[GET /courses]', err);
    res.status(500).json({ message: 'Failed to fetch courses' });
  }
});

// ─── GET /api/courses/:id ────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ course });
  } catch (err) {
    // CastError = invalid ObjectId format
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid course ID format' });
    }
    console.error('[GET /courses/:id]', err);
    res.status(500).json({ message: 'Failed to fetch course' });
  }
});

module.exports = router;
