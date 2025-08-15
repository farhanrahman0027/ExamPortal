import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface Question {
  _id: string;
  questionText: string;
  options: { _id: string; text: string }[];
  category?: string;
  difficulty?: string;
}

interface Answer {
  questionId: string;
  selectedOptionId: string;
}

interface ExamInterfaceProps {
  onExamComplete: (result: any) => void;
}

const ExamInterface: React.FC<ExamInterfaceProps> = ({ onExamComplete }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmitExam();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const loadQuestions = async () => {
    try {
      const res = await axios.get(
        'http://localhost:5000/api/exam/questions?limit=10'
      );
      setQuestions(res.data.questions || []);
    } catch (err) {
      setError('Failed to load questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s
      .toString()
      .padStart(2, '0')}`;
  };

  const handleAnswerSelect = (optionId: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;
    setAnswers((prev) => {
      const exists = prev.findIndex(
        (a) => a.questionId === currentQuestion._id
      );
      if (exists >= 0) {
        const updated = [...prev];
        updated[exists] = {
          questionId: currentQuestion._id,
          selectedOptionId: optionId,
        };
        return updated;
      }
      return [
        ...prev,
        { questionId: currentQuestion._id, selectedOptionId: optionId },
      ];
    });
  };

  const getCurrentAnswer = () => {
    const q = questions[currentQuestionIndex];
    return q ? answers.find((a) => a.questionId === q._id) : undefined;
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1)
      setCurrentQuestionIndex((i) => i + 1);
  };
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex((i) => i - 1);
  };

  const handleSubmitExam = async () => {
    setIsSubmitting(true);
    try {
      const res = await axios.post(
        'http://localhost:5000/api/exam/submit',
        { answers }
      );
      onExamComplete(res.data);
    } catch (err) {
      setError('Failed to submit exam. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-purple-500 rounded-full mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading your exam...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-center mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 text-center">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex] || null;
  const currentAnswer = getCurrentAnswer();
  const progress =
    questions.length > 0
      ? ((currentQuestionIndex + 1) / questions.length) * 100
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold">Programming Assessment</h1>
            <p className="text-sm text-gray-500">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
          <div
            className={`px-4 py-2 rounded-full shadow-md flex items-center gap-2 font-medium ${
              timeLeft < 300
                ? 'bg-red-100 text-red-700'
                : 'bg-purple-100 text-purple-700'
            }`}
          >
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
        </div>
        <div className="h-2 bg-gray-200">
          <div
            className="h-2 bg-purple-400 transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </header>

      {/* Question */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {currentQuestion?.category || 'General'} •{' '}
              {currentQuestion?.difficulty || 'Medium'}
            </span>
            <h2 className="mt-4 text-lg font-semibold">
              {currentQuestion?.questionText || 'No question available'}
            </h2>
          </div>

          {/* Options */}
          <div className="p-6 space-y-3">
            {currentQuestion?.options?.map((opt, idx) => {
              const isSelected = currentAnswer?.selectedOptionId === opt._id;
              return (
                <label
                  key={opt._id}
                  className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-purple-400 bg-purple-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${currentQuestion._id}`}
                    checked={isSelected}
                    onChange={() => handleAnswerSelect(opt._id)}
                    className="hidden"
                  />
                  <div
                    className={`w-6 h-6 flex items-center justify-center rounded-full border ${
                      isSelected
                        ? 'bg-purple-400 text-white border-purple-400'
                        : 'border-gray-300 text-gray-500'
                    }`}
                  >
                    {isSelected ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      String.fromCharCode(65 + idx)
                    )}
                  </div>
                  <span>{opt.text}</span>
                </label>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="p-6 bg-gray-50 flex justify-between items-center">
            <button
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-1 px-4 py-2 rounded-lg text-gray-600 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmitExam}
                disabled={isSubmitting}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Exam'}
              </button>
            ) : (
              <button
                onClick={goToNextQuestion}
                className="bg-purple-400 hover:bg-purple-500 text-white px-4 py-2 rounded-lg flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Overview */}
        <div className="mt-6 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Question Overview
          </h3>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {questions.map((_, idx) => {
              const isAnswered = answers.some(
                (a) => a.questionId === questions[idx]?._id
              );
              const isCurrent = idx === currentQuestionIndex;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                    isCurrent
                      ? 'bg-purple-500 text-white'
                      : isAnswered
                      ? 'bg-purple-300 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExamInterface;
