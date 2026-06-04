const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: String,
  type: {
    type: String,
    enum: ['cardio', 'strength', 'flexibility', 'sports', 'other'],
    required: true,
  },
  duration: {
    type: Number, // in minutes
    required: true,
  },
  caloriesBurned: {
    type: Number,
  },
  intensity: {
    type: String,
    enum: ['low', 'moderate', 'high'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  startTime: Date,
  endTime: Date,
  exercises: [
    {
      name: String,
      sets: Number,
      reps: Number,
      weight: Number, // in kg
      duration: Number, // in minutes (for cardio)
      distance: Number, // in km
      notes: String,
    },
  ],
  notes: String,
  location: String,
  weather: String,
  mood: {
    type: String,
    enum: ['great', 'good', 'okay', 'tired', 'unmotivated'],
  },
  averageHeartRate: Number,
  maxHeartRate: Number,
  minHeartRate: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

workoutSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Workout', workoutSchema);