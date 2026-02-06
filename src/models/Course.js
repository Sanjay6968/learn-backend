const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
      default: 0,
    },
    image: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
    },
    instructor: {
      type: String,
      trim: true,
      default: 'TBD',
    },
    duration: {
      type: String,
      trim: true,
      default: '2 hours',
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
  },
  {
    timestamps: true,
  }
);

// ─── Virtual: is the course free? ────────────────────────
courseSchema.virtual('isFree').get(function () {
  return this.price === 0;
});

module.exports = mongoose.model('Course', courseSchema);
