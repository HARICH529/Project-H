const Feedback = require('../../models/Feedback');
const User = require('../../models/User');

const submitFeedback = async (req, res) => {
  try {
    const { sessionId, ratings, message, toUserId } = req.body;
    const from = req.user.role === 'instructor' ? 'instructor' : 'student';
    
    const feedback = await Feedback.create({
      sessionId,
      from,
      toUserId,
      ratings,
      message
    });

    // Update instructor rating if feedback is from student
    if (from === 'student') {
      const instructor = await User.findById(toUserId);
      const avgRating = (ratings.clarity + ratings.interaction + ratings.satisfaction) / 3;
      
      const newTotalRatings = instructor.totalRatings + 1;
      const newRating = ((instructor.rating * instructor.totalRatings) + avgRating) / newTotalRatings;
      
      await User.findByIdAndUpdate(toUserId, {
        rating: newRating,
        totalRatings: newTotalRatings
      });
    }
    
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getFeedback = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const feedback = await Feedback.find({ sessionId })
      .populate('toUserId', 'name');
    
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = { submitFeedback, getFeedback };