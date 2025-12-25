const Roadmap = require('../../models/Roadmap');
const UserProgress = require('../../models/UserProgress');

const getRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ isActive: true });
    res.json(roadmaps);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const selectRoadmap = async (req, res) => {
  try {
    const { roadmapId } = req.body;
    
    const progress = await UserProgress.findOneAndUpdate(
      { userId: req.user._id, roadmapId },
      { userId: req.user._id, roadmapId },
      { upsert: true, new: true }
    );
    
    res.json(progress);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const updateProgress = async (req, res) => {
  try {
    const { roadmapId, milestoneId } = req.body;
    
    const progress = await UserProgress.findOne({ userId: req.user._id, roadmapId });
    const roadmap = await Roadmap.findById(roadmapId);
    
    if (!progress.completedMilestones.some(m => m.milestoneId.equals(milestoneId))) {
      progress.completedMilestones.push({ milestoneId });
      progress.progressPercentage = (progress.completedMilestones.length / roadmap.milestones.length) * 100;
      await progress.save();
    }
    
    res.json(progress);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getUserProgress = async (req, res) => {
  try {
    const progress = await UserProgress.find({ userId: req.user._id })
      .populate('roadmapId', 'name domain milestones');
    
    res.json(progress);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = { getRoadmaps, selectRoadmap, updateProgress, getUserProgress };