const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Meeting = require('../models/Meeting');
const Task = require('../models/Task');
const Joi = require('joi');

const meetingSchema = Joi.object({
  title: Joi.string().required(),
  department: Joi.string().required(),
  host: Joi.string().required(),
  date: Joi.date(),
  agenda: Joi.array().items(Joi.string()),
  discussionSummary: Joi.string(),
  decisionsMade: Joi.array().items(Joi.string()),
  actionItems: Joi.array().items(Joi.object({
    taskTitle: Joi.string().required(),
    assignedTo: Joi.string().required(),
    deadline: Joi.date().required(),
    status: Joi.string().valid('Finished', 'Pending', 'On-going')
  }))
});

// @route   GET api/meetings
router.get('/', auth, async (req, res) => {
  const mongoose = require('mongoose');
  if (mongoose.connection.readyState !== 1) {
    return res.json(require('../utils/mockData').meetings);
  }
  try {
    const meetings = await Meeting.find().sort({ date: -1 });
    res.json(meetings);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST api/meetings
router.post('/', auth, async (req, res) => {
  const { error } = meetingSchema.validate(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  const mongoose = require('mongoose');
  if (mongoose.connection.readyState !== 1) {
    return res.json({ ...req.body, _id: Date.now().toString() });
  }

  try {

    const newMeeting = new Meeting(req.body);
    const meeting = await newMeeting.save();

    // Automatically create tasks from action items if requested
    if (req.body.createTasks && meeting.actionItems.length > 0) {
      const tasks = meeting.actionItems.map(item => ({
        project: `Meeting: ${meeting.title}`,
        title: item.taskTitle,
        assignedTo: item.assignedTo,
        deadline: item.deadline,
        status: item.status,
        meetingId: meeting._id
      }));
      await Task.insertMany(tasks);
    }

    res.json(meeting);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET api/meetings/implementations
router.get('/implementations', auth, async (req, res) => {
  const mongoose = require('mongoose');
  if (mongoose.connection.readyState !== 1) {
    return res.json(require('../utils/mockData').implementations);
  }
  try {
    // In production, this might aggregate action items or decisions from all meetings
    const meetings = await Meeting.find({ 'decisionsMade.0': { $exists: true } });
    const implementations = meetings.flatMap(m => m.decisionsMade.map((d, i) => ({
      _id: `${m._id}-${i}`,
      decision: d,
      department: m.department,
      responsibility: m.host,
      status: 'On-going',
      rate: 50,
      decisionDate: m.date
    })));
    res.json(implementations);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @desc    Special Logic: Track implementation of meeting action items
router.get('/implementation/:id', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ meetingId: req.params.id });
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Finished').length;
    const ongoing = tasks.filter(t => t.status === 'On-going').length;
    const pending = tasks.filter(t => t.status === 'Pending').length;

    const rate = total > 0 ? (completed / total) * 100 : 0;

    res.json({
      meetingId: req.params.id,
      stats: {
        total,
        completed,
        ongoing,
        pending,
        implementationRate: `${rate.toFixed(2)}%`
      },
      tasks
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
