const express = require('express');
const { getRoadmaps, selectRoadmap, updateProgress, getUserProgress } = require('../controllers/roadmapController');
const verifyToken = require('../../middlewares/verifyToken');
const roleAccess = require('../../middlewares/roleAccess');
const router = express.Router();

router.get('/', verifyToken, getRoadmaps);
router.post('/select', verifyToken, roleAccess('student'), selectRoadmap);
router.put('/progress', verifyToken, roleAccess('student'), updateProgress);
router.get('/my-progress', verifyToken, roleAccess('student'), getUserProgress);

module.exports = router;