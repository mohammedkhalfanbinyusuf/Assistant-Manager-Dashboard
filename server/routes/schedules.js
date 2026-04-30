const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Schedule = require('../models/Schedule');
const Joi = require('joi');

const scheduleSchema = Joi.object({
  time: Joi.string().required(),
  title: Joi.string().required(),
  type: Joi.string().valid('Personal', 'Office').required(),
  outcome: Joi.string().allow('')
});

// @route   GET api/schedules
router.get('/', auth, async (req, res) => {
  const mongoose = require('mongoose');
  if (mongoose.connection.readyState !== 1) {
    return res.json(require('../utils/mockData').schedules);
  }
  try {
    const schedules = await Schedule.find().sort({ time: 1 });
    res.json(schedules);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST api/schedules
router.post('/', auth, async (req, res) => {
  const { error } = scheduleSchema.validate(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  const mongoose = require('mongoose');
  if (mongoose.connection.readyState !== 1) {
    return res.json({ ...req.body, _id: Date.now().toString() });
  }

  try {

    const newSchedule = new Schedule(req.body);
    const schedule = await newSchedule.save();
    res.json(schedule);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/schedules/:id
router.put('/:id', auth, async (req, res) => {
  try {
    let schedule = await Schedule.findById(req.params.id);
    if (!schedule) return res.status(404).json({ msg: 'Schedule not found' });

    schedule = await Schedule.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(schedule);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
