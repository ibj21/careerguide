const Quiz = require('../models/Quiz');
const User = require('../models/User');

exports.getAllQuestions = (req, res) => {
  const questions = [
  {
    question: "When you wake up in the morning, what feeling do you hope to carry through your day?",
    options: ["Focus", "Adventure", "Compassion", "Curiosity", "Ambition"]
  },
  {
    question: "Imagine your perfect work environment — what’s the atmosphere like?",
    options: ["Structured", "Dynamic", "Supportive", "Quiet", "Fast-paced"]
  },
  {
    question: "If you had to pick one, what motivates you more: solving complex problems or helping others grow?",
    options: ["Problems", "Growth", "Both", "Neither", "Depends"]
  },
  {
    question: "When facing a challenge, what’s your natural approach?",
    options: ["Analyze", "Collaborate", "Intuit", "Debate", "Experiment"]
  },
  {
    question: "What kind of legacy do you want your work to leave behind?",
    options: ["Innovative", "Inspirational", "Helpful", "Thoughtful", "Impactful"]
  },
  {
    question: "Which feels most rewarding after a long project: mastering a new skill, making a connection, or seeing positive change?",
    options: ["Mastery", "Connection", "Change", "Recognition", "Satisfaction"]
  },

  {
    question: "If you could choose one superpower to help your work, what would it be?",
    options: ["Precision", "Empathy", "Creativity", "Wisdom", "Influence"]
  },
  {
    question: "Which domain excites you the most?",
    options: ["Technology", "Art", "Science", "Business", "Social Impact"]
  },
  {
    question: "What do you like doing most?",
    options: ["Problem-solving", "Designing", "Researching", "Communicating", "Leading"]
  },
  
  {
    question: "How do you prefer to make decisions: relying on data, gut feeling, or advice from others?",
    options: ["Data", "Gut", "Advice", "Research", "Instinct"]
  },
  {
    question: "What excites you most when you think about your career’s future?",
    options: ["Creating", "Exploring", "Caring", "Understanding", "Leading"]
  },

  // New questions inserted here, as 9 to 15
  {
    question: "When you think about success, what comes to mind first?",
    options: [
      "Creating something useful or lasting",
      "Experiencing something new and exciting",
      "Making a positive difference for others",
      "Being respected for your knowledge or wisdom",
      "Leading a bold new venture or idea"
    ]
  },
  {
    question: "What kind of problem would you prefer to tackle?",
    options: [
      "Technical challenges that need a clear solution",
      "Social puzzles involving people and culture",
      "Emotional struggles that require empathy",
      "Ethical dilemmas with no easy answers",
      "Market gaps waiting for a fresh approach"
    ]
  },
  {
    question: "If you could spend a day doing anything, you would:",
    options: [
      "Experiment with tools, machines, or code",
      "Wander through a museum or new city",
      "Volunteer or mentor someone",
      "Write or debate about a topic you care about",
      "Brainstorm ideas with a group"
    ]
  },
  {
    question: "When learning something new, you prefer:",
    options: [
      "Hands-on practice and trial-and-error",
      "Stories, experiences, and examples",
      "One-on-one guidance or discussion",
      "Reading, researching, and reflection",
      "Collaborative projects and group work"
    ]
  },
  {
    question: "Which phrase resonates with you the most?",
    options: [
      "Precision is power.",
      "Adventure fuels the soul.",
      "Compassion changes the world.",
      "Knowledge is freedom.",
      "Innovation drives progress."
    ]
  },
  {
    question: "When faced with a big decision, you:",
    options: [
      "List pros and cons carefully",
      "Follow your gut feeling",
      "Ask trusted friends for advice",
      "Research and gather facts",
      "Consider the impact on your goals"
    ]
  },
  {
    question: "When you wake up in the morning, what feeling do you hope to carry through your day?",
    options: [
      "Focus","Adventure", "Compassion", "Curiosity", "Ambition"
    ]
  }
];

  res.json(questions);
};
const { spawn } = require('child_process');
const path = require('path');

exports.submitQuiz = async (req, res) => {
  try {
    const userId = req.user.id; // From JWT
    const answers = req.body.answers;

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ error: 'Answers missing or invalid format' });
    }

    const sanitizedAnswers = Object.values(answers).map(a => Number(a));
    if (sanitizedAnswers.length !== 18 || sanitizedAnswers.some(a => isNaN(a))) {
      return res.status(400).json({ error: 'Each answer must be an integer between 0 and 4.' });
    }

    const { spawn } = require('child_process');
    const path = require('path');
    const pythonProcess = spawn('python', [path.join(__dirname, '../../ml-model/predict.py')]);

    let result = '', error = '';

    pythonProcess.stdout.on('data', (data) => result += data.toString());
    pythonProcess.stderr.on('data', (data) => error += data.toString());

    pythonProcess.on('close', async (code) => {
      if (code !== 0) {
        console.error('Python error:', error);
        return res.status(500).json({ error: 'Prediction failed' });
      }

      const predictedCareer = result.trim();

      // 🔐 Save result to user document
     await User.findByIdAndUpdate(userId, {
  $push: {
    quizResults: { result: predictedCareer }
  },
  $set: {
    predictedCareer: predictedCareer
  }
});

      res.json({ message: `You should consider a career in: ${predictedCareer}` });

      
    });

    pythonProcess.stdin.write(JSON.stringify(sanitizedAnswers));
    pythonProcess.stdin.end();

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Server error occurred' });
  }
};
