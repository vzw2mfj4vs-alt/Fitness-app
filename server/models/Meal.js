const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
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
  calories: {
    type: Number,
    required: true,
  },
  protein: {
    type: Number, // in grams
  },
  carbs: {
    type: Number, // in grams
  },
  fats: {
    type: Number, // in grams
  },
  fiber: {
    type: Number, // in grams
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  ingredients: [String],
  prepTime: Number, // in minutes
  cookTime: Number, // in minutes
  servings: Number,
  instructions: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

mealSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Meal', mealSchema);