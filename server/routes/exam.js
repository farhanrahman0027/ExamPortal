import express from 'express';
import Question from '../models/Question.js';
import User from '../models/User.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Get randomized questions for exam
router.get('/questions', authMiddleware, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    // Get random questions
    const questions = await Question.aggregate([
      { $sample: { size: limit } }
    ]);

    // Remove correct answers from response
    const questionsForExam = questions.map(q => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options.map(opt => ({
        _id: opt._id,
        text: opt.text
      })),
      category: q.category,
      difficulty: q.difficulty
    }));

    res.json({ questions: questionsForExam });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Error fetching questions' });
  }
});

// Submit exam and calculate score
router.post('/submit', authMiddleware, async (req, res) => {
  try {
    const { answers } = req.body; // Array of { questionId, selectedOptionId }
    
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Invalid answers format' });
    }

    // Get all questions with correct answers
    const questionIds = answers.map(a => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });
    
    let score = 0;
    const results = [];

    // Calculate score
    answers.forEach(answer => {
      const question = questions.find(q => q._id.toString() === answer.questionId);
      if (question) {
        const correctOption = question.options.find(opt => opt.isCorrect);
        const selectedOption = question.options.find(opt => opt._id.toString() === answer.selectedOptionId);
        
        const isCorrect = correctOption && correctOption._id.toString() === answer.selectedOptionId;
        
        if (isCorrect) score++;
        
        results.push({
          questionId: question._id,
          questionText: question.questionText,
          selectedOption: selectedOption ? selectedOption.text : 'Not answered',
          correctOption: correctOption ? correctOption.text : 'Unknown',
          isCorrect
        });
      }
    });

    const totalQuestions = questions.length;
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    // Save exam attempt to user record
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        examAttempts: {
          examId: `exam_${Date.now()}`,
          score,
          totalQuestions,
          completedAt: new Date()
        }
      }
    });

    res.json({
      score,
      totalQuestions,
      percentage,
      passed: percentage >= 60, // 60% passing grade
      results
    });
  } catch (error) {
    console.error('Error submitting exam:', error);
    res.status(500).json({ message: 'Error submitting exam' });
  }
});

// Seed questions (for development)
router.post('/seed-questions', async (req, res) => {
  try {
    // Check if questions already exist
    const existingQuestions = await Question.countDocuments();
    if (existingQuestions > 0) {
      return res.json({ message: 'Questions already seeded', count: existingQuestions });
    }

    const sampleQuestions = [
      {
        questionText: "What is the time complexity of accessing an element in an array by index?",
        options: [
          { text: "O(1)", isCorrect: true },
          { text: "O(n)", isCorrect: false },
          { text: "O(log n)", isCorrect: false },
          { text: "O(n²)", isCorrect: false }
        ],
        category: "Data Structures",
        difficulty: "Easy"
      },
      {
        questionText: "Which of the following is NOT a JavaScript data type?",
        options: [
          { text: "String", isCorrect: false },
          { text: "Boolean", isCorrect: false },
          { text: "Integer", isCorrect: true },
          { text: "Object", isCorrect: false }
        ],
        category: "JavaScript",
        difficulty: "Easy"
      },
      {
        questionText: "What does REST stand for in web development?",
        options: [
          { text: "Representational State Transfer", isCorrect: true },
          { text: "Remote State Transfer", isCorrect: false },
          { text: "Relational State Transfer", isCorrect: false },
          { text: "Request State Transfer", isCorrect: false }
        ],
        category: "Web Development",
        difficulty: "Medium"
      },
      {
        questionText: "In React, what is the purpose of the useEffect hook?",
        options: [
          { text: "To manage component state", isCorrect: false },
          { text: "To perform side effects in functional components", isCorrect: true },
          { text: "To create custom hooks", isCorrect: false },
          { text: "To handle user events", isCorrect: false }
        ],
        category: "React",
        difficulty: "Medium"
      },
      {
        questionText: "Which SQL command is used to retrieve data from a database?",
        options: [
          { text: "GET", isCorrect: false },
          { text: "FETCH", isCorrect: false },
          { text: "SELECT", isCorrect: true },
          { text: "RETRIEVE", isCorrect: false }
        ],
        category: "Database",
        difficulty: "Easy"
      },
      {
        questionText: "What is the primary purpose of version control systems like Git?",
        options: [
          { text: "To compile code", isCorrect: false },
          { text: "To track changes in source code", isCorrect: true },
          { text: "To deploy applications", isCorrect: false },
          { text: "To debug applications", isCorrect: false }
        ],
        category: "Version Control",
        difficulty: "Easy"
      },
      {
        questionText: "Which of the following is a NoSQL database?",
        options: [
          { text: "MySQL", isCorrect: false },
          { text: "PostgreSQL", isCorrect: false },
          { text: "MongoDB", isCorrect: true },
          { text: "SQLite", isCorrect: false }
        ],
        category: "Database",
        difficulty: "Medium"
      },
      {
        questionText: "What does API stand for?",
        options: [
          { text: "Application Programming Interface", isCorrect: true },
          { text: "Advanced Programming Interface", isCorrect: false },
          { text: "Application Process Interface", isCorrect: false },
          { text: "Automated Programming Interface", isCorrect: false }
        ],
        category: "General",
        difficulty: "Easy"
      },
      {
        questionText: "In object-oriented programming, what is encapsulation?",
        options: [
          { text: "Creating multiple instances of a class", isCorrect: false },
          { text: "Hiding internal implementation details", isCorrect: true },
          { text: "Inheriting from a parent class", isCorrect: false },
          { text: "Overriding methods", isCorrect: false }
        ],
        category: "OOP",
        difficulty: "Medium"
      },
      {
        questionText: "Which HTTP status code indicates a successful request?",
        options: [
          { text: "404", isCorrect: false },
          { text: "500", isCorrect: false },
          { text: "200", isCorrect: true },
          { text: "302", isCorrect: false }
        ],
        category: "HTTP",
        difficulty: "Easy"
      },
      {
        questionText: "What is the difference between let and var in JavaScript?",
        options: [
          { text: "No difference", isCorrect: false },
          { text: "let has block scope, var has function scope", isCorrect: true },
          { text: "var is newer than let", isCorrect: false },
          { text: "let is faster than var", isCorrect: false }
        ],
        category: "JavaScript",
        difficulty: "Medium"
      },
      {
        questionText: "Which design pattern is commonly used for creating objects?",
        options: [
          { text: "Observer", isCorrect: false },
          { text: "Factory", isCorrect: true },
          { text: "Strategy", isCorrect: false },
          { text: "Decorator", isCorrect: false }
        ],
        category: "Design Patterns",
        difficulty: "Hard"
      }
    ];

    await Question.insertMany(sampleQuestions);
    
    res.json({ message: 'Questions seeded successfully', count: sampleQuestions.length });
  } catch (error) {
    console.error('Error seeding questions:', error);
    res.status(500).json({ message: 'Error seeding questions' });
  }
});

export default router;