const express = require('express');
const HeartRate = require('../models/HeartRate');
const auth = require('../middleware/auth');

const router = express.Router();

// Log heart rate
router.post('/log', auth, async (req, res) => {
  try {
    const { bpm, activity, notes } = req.body;

    if (!bpm || bpm < 30 || bpm > 220) {
      return res.status(400).json({ message: 'Invalid BPM value (must be between 30-220)' });
    }

    const heartRateEntry = new HeartRate({
      userId: req.userId,
      bpm,
      activity: activity || 'rest',
      notes,
    });

    await heartRateEntry.save();

    res.status(201).json({
      message: 'Heart rate logged successfully',
      data: heartRateEntry,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get heart rate history
router.get('/history', auth, async (req, res) => {
  try {
    const { days = 7, limit = 100 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const heartRates = await HeartRate.find({
      userId: req.userId,
      createdAt: { $gte: startDate },
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    const stats = {
      average: 0,
      max: 0,
      min: 0,
      total: heartRates.length,
    };

    if (heartRates.length > 0) {
      const bpms = heartRates.map(hr => hr.bpm);
      stats.average = Math.round(bpms.reduce((a, b) => a + b) / bpms.length);
      stats.max = Math.max(...bpms);
      stats.min = Math.min(...bpms);
    }

    res.json({
      data: heartRates,
      stats,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get heart rate statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const heartRates = await HeartRate.find({
      userId: req.userId,
      createdAt: { $gte: startDate },
    });

    if (heartRates.length === 0) {
      return res.json({
        message: 'No data available',
        stats: {},
      });
    }

    const bpms = heartRates.map(hr => hr.bpm);
    const average = bpms.reduce((a, b) => a + b) / bpms.length;
    const max = Math.max(...bpms);
    const min = Math.min(...bpms);
    const sorted = [...bpms].sort((a, b) => a - b);
    const median = sorted.length % 2 ? sorted[Math.floor(sorted.length / 2)] : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;

    const activityStats = {};
    heartRates.forEach(hr => {
      if (!activityStats[hr.activity]) {
        activityStats[hr.activity] = [];
      }
      activityStats[hr.activity].push(hr.bpm);
    });

    res.json({
      period: `Last ${days} days`,
      total: heartRates.length,
      average: Math.round(average),
      max,
      min,
      median: Math.round(median),
      activityStats: Object.keys(activityStats).reduce((acc, activity) => {
        const values = activityStats[activity];
        acc[activity] = {
          average: Math.round(values.reduce((a, b) => a + b) / values.length),
          count: values.length,
        };
        return acc;
      }, {}),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;