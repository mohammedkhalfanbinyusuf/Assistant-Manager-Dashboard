const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  title: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true,
    enum: ['IT', 'Finance', 'Operations', 'Marketing', 'Sales', 'HR']
  },
  host: {
    type: String,
    required: true
  },
  agenda: [String],
  discussionSummary: String,
  decisionsMade: [String],
  actionItems: [{
    taskTitle: String,
    assignedTo: String,
    deadline: Date,
    status: {
      type: String,
      enum: ['Finished', 'Pending', 'On-going'],
      default: 'Pending'
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Meeting', MeetingSchema);
