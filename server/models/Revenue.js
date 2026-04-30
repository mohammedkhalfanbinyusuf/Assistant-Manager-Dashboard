const mongoose = require('mongoose');

const RevenueSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
    enum: ['Nizan', 'Team N', 'Brandnest', 'Finora']
  },
  adv: {
    type: Number,
    required: true,
    default: 0
  },
  receivable: {
    type: Number,
    required: true,
    default: 0
  },
  target: {
    type: Number,
    required: true,
    default: 0
  },
  achievement: {
    type: Number,
    required: true,
    default: 0
  },
  month: {
    type: String, // e.g., "April 2026"
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Revenue', RevenueSchema);
