const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  project: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  assignedTo: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Finished', 'Pending', 'On-going'],
    default: 'Pending'
  },
  meetingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meeting',
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
