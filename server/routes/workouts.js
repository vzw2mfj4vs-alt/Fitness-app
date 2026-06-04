const express = require('express');
const Workout = require('../models/Workout');
const auth = require('../middleware/auth');

const router = express.Router();

// Log workout
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, type, duration, caloriesBurned, intensity, exercises, notes, location, weather, mood, averageHeartRate, maxHeartRate, minHeartRate } = req.body;

    if (!name || !type || !duration) {
      return res.status(400).json({ message: 'Name, type, and duration are required' });
    }

    const workout = new Workout({
      userId: req.userId,
      name,
      description,
      type,
      duration,
      caloriesBurned,
      intensity,
      exercises,
      notes,
      location,
      weather,
      mood,
      averageHeartRate,
      maxHeartRate,
      minHeartRate,
      startTime: new Date(),
    });

    await workout.save();

    res.status(201).json({
      message: 'Workout logged successfully',
      data: workout,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get workouts
router.get('/', auth, async (req, res) => {
  try {
    const { days = 30, limit = 100 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const workouts = await Workout.find({
      userId: req.userId,
      date: { $gte: startDate },
    })
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json({
      data: workouts,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get workout statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const workouts = await Workout.find({
      userId: req.userId,
      date: { $gte: startDate },
    });

    if (workouts.length === 0) {
      return res.json({
        message: 'No workout data available',
        stats: {},
      });
    }

    const stats = {
      totalWorkouts: workouts.length,
      totalDuration: 0,
      totalCalories: 0,
      averageDuration: 0,
      workoutsByType: {},
      workoutsByIntensity: {},
    };

    workouts.forEach(workout => {
      stats.totalDuration += workout.duration || 0;
      stats.totalCalories += workout.caloriesBurned || 0;

      // Count by type
      if (!stats.workoutsByType[workout.type]) {
        stats.workoutsByType[workout.type] = 0;
      }
      stats.workoutsByType[workout.type]++;

      // Count by intensity
      if (workout.intensity) {
        if (!stats.workoutsByIntensity[workout.intensity]) {
          stats.workoutsByIntensity[workout.intensity] = 0;
        }
        stats.workoutsByIntensity[workout.intensity]++;
      }
    });

    stats.averageDuration = Math.round(stats.totalDuration / stats.totalWorkouts);

    res.json({
      period: `Last ${days} days`,
      stats,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single workout
router.get('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    if (workout.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update workout
router.put('/:id', auth, async (req, res) => {
  try {
    let workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    if (workout.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { name, description, type, duration, caloriesBurned, intensity, exercises, notes, location, weather, mood, averageHeartRate, maxHeartRate, minHeartRate } = req.body;

    if (name) workout.name = name;
    if (description) workout.description = description;
    if (type) workout.type = type;
    if (duration) workout.duration = duration;
    if (caloriesBurned) workout.caloriesBurned = caloriesBurned;
    if (intensity) workout.intensity = intensity;
    if (exercises) workout.exercises = exercises;
    if (notes) workout.notes = notes;
    if (location) workout.location = location;
    if (weather) workout.weather = weather;
    if (mood) workout.mood = mood;
    if (averageHeartRate) workout.averageHeartRate = averageHeartRate;
    if (maxHeartRate) workout.maxHeartRate = maxHeartRate;
    if (minHeartRate) workout.minHeartRate = minHeartRate;

    await workout.save();

    res.json({
      message: 'Workout updated successfully',
      data: workout,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete workout
router.delete('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    if (workout.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Workout.findByIdAndDelete(req.params.id);

    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;