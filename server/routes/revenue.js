const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Revenue = require('../models/Revenue');
const Joi = require('joi');

const revenueSchema = Joi.object({
  brand: Joi.string().valid('Nizan', 'Team N', 'Brandnest', 'Finora').required(),
  adv: Joi.number().required(),
  receivable: Joi.number().required(),
  target: Joi.number().required(),
  achievement: Joi.number().required(),
  month: Joi.string().required()
});

// @route   GET api/revenue
router.get('/', auth, async (req, res) => {
  const mongoose = require('mongoose');
  if (mongoose.connection.readyState !== 1) {
    return res.json(require('../utils/mockData').revenue);
  }
  try {
    const revenue = await Revenue.find().sort({ createdAt: -1 });
    res.json(revenue);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST api/revenue
router.post('/', auth, async (req, res) => {
  const { error } = revenueSchema.validate(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  const mongoose = require('mongoose');
  if (mongoose.connection.readyState !== 1) {
    return res.json({ ...req.body, _id: Date.now().toString() });
  }

  try {

    const newRevenue = new Revenue(req.body);
    const revenue = await newRevenue.save();
    res.json(revenue);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET api/revenue/comparison
// @desc    Special Logic: Comparison Rate calculator
router.get('/comparison', auth, async (req, res) => {
  try {
    const revenueData = await Revenue.find();
    
    // Group by brand
    const brands = ['Nizan', 'Team N', 'Brandnest', 'Finora'];
    const comparison = brands.map(brand => {
      const data = revenueData.filter(r => r.brand === brand);
      const totalTarget = data.reduce((acc, curr) => acc + curr.target, 0);
      const totalAchievement = data.reduce((acc, curr) => acc + curr.achievement, 0);
      const rate = totalTarget > 0 ? (totalAchievement / totalTarget) * 100 : 0;

      return {
        brand,
        totalTarget,
        totalAchievement,
        comparisonRate: `${rate.toFixed(2)}%`
      };
    });

    res.json(comparison);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
