import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, XCircle, Trophy, RotateCcw, Home } from 'lucide-react';

interface Result {
  questionId: string;
  questionText: string;
  selectedOption: string;
  correctOption: string;
  isCorrect: boolean;
}

interface ExamResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  results: Result[];
}

interface ResultPageProps {
  result: ExamResult;
  onReturnHome: () => void;
}

const ResultPage: React.FC<ResultPageProps> = ({ result, onReturnHome }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Exam Results</h1>
            <p className="text-gray-600 mt-2">Here's how you performed, {user?.username}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Score Summary */}
        <div className={`bg-white rounded-xl shadow-md p-8 mb-8 border-l-4 ${result.passed ? '' : 'border-red-500'
          }`}>
          {result.passed && (
            <div
              className="absolute left-0 top-0 bottom-0 w-1"
              style={{ backgroundColor: '#C5ADC5' }}
            ></div>
          )}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                {result.passed ? (
                  <Trophy className="w-8 h-8 text-yellow-500 mr-3" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-500 mr-3" />
                )}
                <h2 className="text-2xl font-bold text-gray-900">
                  {result.passed ? 'Congratulations!' : 'Keep Learning!'}
                </h2>
              </div>
              <p className="text-gray-600">
                {result.passed
                  ? 'You have successfully passed the exam.'
                  : 'You need 60% or higher to pass. Better luck next time!'}
              </p>
            </div>
            <div className="text-right">
              <div className={`text-4xl font-bold ${result.passed ? '' : 'text-red-600'
                }`}>
                <span style={result.passed ? { color: '#C5ADC5' } : {}}>
                  {result.percentage}%
                </span>
              </div>
              <div className="text-gray-600">
                {result.score} / {result.totalQuestions} correct
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Detailed Results</h3>
            <p className="text-gray-600 mt-1">Review your answers below</p>
          </div>

          <div className="divide-y divide-gray-200">
            {result.results.map((item, index) => (
              <div key={item.questionId} className="p-6">
                <div className="flex items-start">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 flex-shrink-0 ${item.isCorrect ? '' : 'bg-red-100'
                    }`}>
                    {item.isCorrect && (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#C5ADC5' }}
                      >
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    )}
                    {!item.isCorrect && (
                      item.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )
                    )}
                  </div>

                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Question {index + 1}: {item.questionText}
                    </h4>

                    <div className="space-y-2">
                      <div className={`p-3 rounded-lg ${item.isCorrect ? 'border' : 'bg-red-50 border border-red-200'
                        }`}>
                        {item.isCorrect && (
                          <div
                            className="p-3 rounded-lg border"
                            style={{ backgroundColor: '#F3F0F3', borderColor: '#C5ADC5' }}
                          >
                            <span className="text-sm font-medium text-gray-700">Your answer: </span>
                            <span style={{ color: '#8B5A8B' }}>
                              {item.selectedOption}
                            </span>
                          </div>
                        )}
                        {!item.isCorrect && (
                          <>
                            <span className="text-sm font-medium text-gray-700">Your answer: </span>
                            <span className={`${item.isCorrect ? 'text-green-700' : 'text-red-700'
                              }`}>
                              {item.selectedOption}
                            </span>
                          </>
                        )}
                      </div>

                      {!item.isCorrect && (
                        <div className="p-3 rounded-lg border" style={{ backgroundColor: '#F3F0F3', borderColor: '#C5ADC5' }}>
                          <span className="text-sm font-medium text-gray-700">Correct answer: </span>
                          <span style={{ color: '#8B5A8B' }}>{item.correctOption}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={onReturnHome}
            className="text-white px-6 py-3 rounded-lg transition duration-200 font-medium flex items-center"
            style={{ backgroundColor: '#B2B5E0' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9CA3DB'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#B2B5E0'}
          >
            <Home className="w-5 h-5 mr-2" />
            Return to Dashboard
          </button>
        </div>

        {/* Performance Summary */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#B2B5E0' }}>{result.totalQuestions}</div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#C5ADC5' }}>{result.score}</div>
              <div className="text-sm text-gray-600">Correct Answers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {result.totalQuestions - result.score}
              </div>
              <div className="text-sm text-gray-600">Incorrect Answers</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${result.passed ? '' : 'text-red-600'
                }`}>
                <span style={result.passed ? { color: '#C5ADC5' } : {}}>
                  {result.passed ? 'PASS' : 'FAIL'}
                </span>
              </div>
              <div className="text-sm text-gray-600">Result</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResultPage;