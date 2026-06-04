const mongoose = require('mongoose');

const heartRateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bpm: {
    type: Number,
    required: true,
    min: 30,
    max: 220,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  activity: {
    type: String,
    enum: ['rest', 'walking', 'light-exercise', 'moderate-exercise', 'intense-exercise'],
    default: 'rest',
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Index for efficient queries
heartRateSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('HeartRate', heartRateSchema);