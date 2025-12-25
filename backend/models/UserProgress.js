const mongoose = require('mongoose');
const { Schema } = mongoose;

const userProgressSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  roadmapId: {
    type: Schema.Types.ObjectId,
    ref: 'Roadmap',
    required: true
  },
  
  completedMilestones: [{
    milestoneId: Schema.Types.ObjectId,
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  progressPercentage: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

userProgressSchema.index({ userId: 1, roadmapId: 1 }, { unique: true });

module.exports = mongoose.model('UserProgress', userProgressSchema);