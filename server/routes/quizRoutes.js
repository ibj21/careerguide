const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getAllQuestions, submitQuiz } = require('../controllers/quizController');

router.get('/questions', getAllQuestions);
router.post('/submit', authMiddleware, submitQuiz);

// In quizRoutes.js
router.get('/results', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('quizResults');
    res.json(user.quizResults || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});



module.exports = router;

