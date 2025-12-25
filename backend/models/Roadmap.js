const mongoose = require('mongoose');
const { Schema } = mongoose;

const roadmapSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  
  domain: {
    type: String,
    required: true
  },
  
  milestones: [{
    title: String,
    description: String,
    order: Number
  }],
  
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Roadmap', roadmapSchema);