const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
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
  duration: {
    type: Number, // in days
    default: 7,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  targetCalories: Number,
  targetProtein: Number,
  targetCarbs: Number,
  targetFats: Number,
  meals: [
    {
      date: Date,
      breakfast: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meal',
      },
      lunch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meal',
      },
      dinner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meal',
      },
      snacks: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Meal',
        },
      ],
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

mealPlanSchema.index({ userId: 1, startDate: -1 });

module.exports = mongoose.model('MealPlan', mealPlanSchema);