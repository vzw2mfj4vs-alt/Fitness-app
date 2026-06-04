const express = require('express');
const Meal = require('../models/Meal');
const auth = require('../middleware/auth');

const router = express.Router();

// Create meal
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, calories, protein, carbs, fats, fiber, mealType, ingredients, prepTime, cookTime, servings, instructions } = req.body;

    if (!name || !calories || !mealType) {
      return res.status(400).json({ message: 'Name, calories, and meal type are required' });
    }

    const meal = new Meal({
      userId: req.userId,
      name,
      description,
      calories,
      protein,
      carbs,
      fats,
      fiber,
      mealType,
      ingredients,
      prepTime,
      cookTime,
      servings,
      instructions,
    });

    await meal.save();

    res.status(201).json({
      message: 'Meal created successfully',
      data: meal,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get meals by date
router.get('/date/:date', auth, async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const meals = await Meal.find({
      userId: req.userId,
      date: { $gte: date, $lt: nextDate },
    }).sort({ mealType: 1 });

    const totals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      fiber: 0,
    };

    meals.forEach(meal => {
      totals.calories += meal.calories || 0;
      totals.protein += meal.protein || 0;
      totals.carbs += meal.carbs || 0;
      totals.fats += meal.fats || 0;
      totals.fiber += meal.fiber || 0;
    });

    res.json({
      date: req.params.date,
      meals,
      totals,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all meals
router.get('/', auth, async (req, res) => {
  try {
    const { days = 7, limit = 50 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const meals = await Meal.find({
      userId: req.userId,
      date: { $gte: startDate },
    })
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json({
      data: meals,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update meal
router.put('/:id', auth, async (req, res) => {
  try {
    let meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    if (meal.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { name, description, calories, protein, carbs, fats, fiber, mealType, ingredients, prepTime, cookTime, servings, instructions } = req.body;

    if (name) meal.name = name;
    if (description) meal.description = description;
    if (calories) meal.calories = calories;
    if (protein) meal.protein = protein;
    if (carbs) meal.carbs = carbs;
    if (fats) meal.fats = fats;
    if (fiber) meal.fiber = fiber;
    if (mealType) meal.mealType = mealType;
    if (ingredients) meal.ingredients = ingredients;
    if (prepTime) meal.prepTime = prepTime;
    if (cookTime) meal.cookTime = cookTime;
    if (servings) meal.servings = servings;
    if (instructions) meal.instructions = instructions;

    await meal.save();

    res.json({
      message: 'Meal updated successfully',
      data: meal,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete meal
router.delete('/:id', auth, async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    if (meal.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Meal.findByIdAndDelete(req.params.id);

    res.json({ message: 'Meal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;