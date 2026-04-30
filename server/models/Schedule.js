const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
  time: {
    type: String, // e.g., "06:00 AM"
    required: true
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Personal', 'Office'],
    required: true
  },
  outcome: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Schedule', ScheduleSchema);
