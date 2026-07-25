const mongoose = require('mongoose');

const behavioralSignalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sessionToken: { type: String, required: true },
  categoryDwellTime: { type: Map, of: Number, default: {} }, // { "Basic UI Components": 45 }
  scrollDepth: { type: Number, default: 0 }, // 0 to 100%
  filterClicks: [{
    filter: String,
    count: { type: Number, default: 1 }
  }],
  timestamp: { type: Date, default: Date.now }
});

// Index for rapid user/session profile lookup
behavioralSignalSchema.index({ userId: 1, timestamp: -1 });
behavioralSignalSchema.index({ sessionToken: 1 });

module.exports = mongoose.model('BehavioralSignal', behavioralSignalSchema);
