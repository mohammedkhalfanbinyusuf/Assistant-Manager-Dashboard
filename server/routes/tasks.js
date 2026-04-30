const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const Joi = require('joi');

const taskSchema = Joi.object({
  project: Joi.string().required(),
  title: Joi.string().required(),
  assignedTo: Joi.string().required(),
  deadline: Joi.date().required(),
  priority: Joi.string().valid('Low', 'Medium', 'High', 'Urgent'),
  status: Joi.string().valid('Finished', 'Pending', 'On-going'),
  meetingId: Joi.string().optional().allow(null)
});

// @route   GET api/tasks
router.get('/', auth, async (req, res) => {
  const mongoose = require('mongoose');
  if (mongoose.connection.readyState !== 1) {
    return res.json(require('../utils/mockData').tasks);
  }
  try {
    const tasks = await Task.find().sort({ deadline: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST api/tasks
router.post('/', auth, async (req, res) => {
  const { error } = taskSchema.validate(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  const mongoose = require('mongoose');
  if (mongoose.connection.readyState !== 1) {
    return res.json({ ...req.body, _id: Date.now().toString() });
  }

  try {

    const newTask = new Task(req.body);
    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/tasks/:id
router.put('/:id', auth, async (req, res) => {
  const mongoose = require('mongoose');
  if (mongoose.connection.readyState !== 1) {
    return res.json({ ...req.body, _id: req.params.id });
  }
  try {
    let task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: 'Task not found' });

    task = await Task.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
