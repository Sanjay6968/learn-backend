const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course ID is required'],
    },
    pricePaid: {
      type: Number,
      required: true,
      min: 0,
    },
    promoApplied: {
      type: Boolean,
      default: false,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Compound unique index: one sub per user per course ──
subscriptionSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
