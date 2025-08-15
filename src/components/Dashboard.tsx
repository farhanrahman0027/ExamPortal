import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Clock, User, LogOut, Play } from 'lucide-react';

interface DashboardProps {
  onStartExam: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStartExam }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 gap-4 sm:gap-0">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 mr-2" style={{ color: '#C5ADC5' }} />
              <h1 className="text-2xl font-bold text-gray-900">ExamPortal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <User className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-gray-700 font-medium truncate max-w-[120px] sm:max-w-none">
                  {user?.username}
                </span>
              </div>
              <button
                onClick={logout}
                className="flex items-center text-gray-600 hover:text-gray-800 transition duration-200"
              >
                <LogOut className="w-5 h-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Welcome */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Welcome, {user?.username}!
          </h2>
          <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            Ready to test your knowledge? Start your exam when you're prepared.
            You'll have 30 minutes to complete the assessment.
          </p>
        </div>

        {/* Exam Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {[
            {
              icon: <BookOpen className="w-6 h-6 text-white" />,
              bg: '#C5ADC5',
              title: 'Questions',
              desc: '10 carefully selected multiple-choice questions covering various programming concepts'
            },
            {
              icon: <Clock className="w-6 h-6 text-white" />,
              bg: '#B2B5E0',
              title: 'Duration',
              desc: '30 minutes to complete the exam. Timer will automatically submit when time expires'
            },
            {
              icon: <User className="w-6 h-6 text-white" />,
              bg: '#C5ADC5',
              title: 'Passing Score',
              desc: 'Score 60% or higher to pass the assessment. Results shown immediately after submission'
            }
          ].map((card, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6 text-center sm:text-left">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto sm:mx-0"
                style={{ backgroundColor: card.bg }}
              >
                {card.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-gray-600">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Exam Instructions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Before You Start:</h4>
              <ul className="space-y-2 text-gray-600">
                {[
                  'Ensure you have a stable internet connection',
                  'Find a quiet environment without distractions',
                  'You cannot pause or restart the exam once started'
                ].map((text, i) => (
                  <li key={i} className="flex items-start">
                    <div
                      className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                      style={{ backgroundColor: '#C5ADC5' }}
                    ></div>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">During the Exam:</h4>
              <ul className="space-y-2 text-gray-600">
                {[
                  'Read each question carefully before selecting',
                  'Use Next/Previous buttons to navigate',
                  'Submit manually or wait for auto-submission'
                ].map((text, i) => (
                  <li key={i} className="flex items-start">
                    <div
                      className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                      style={{ backgroundColor: '#B2B5E0' }}
                    ></div>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Start Exam Button */}
        <div className="text-center">
          <button
            onClick={onStartExam}
            className="w-full sm:w-auto text-white px-8 py-4 rounded-xl font-semibold text-lg transform hover:scale-105 transition duration-200 shadow-lg flex items-center justify-center mx-auto"
            style={{
              background: `linear-gradient(to right, #C5ADC5, #B2B5E0)`
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = 'linear-gradient(to right, #B19CB1, #9CA3DB)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = 'linear-gradient(to right, #C5ADC5, #B2B5E0)')
            }
          >
            <Play className="w-6 h-6 mr-3" />
            Start Exam
          </button>
          <p className="text-gray-500 mt-4 text-sm sm:text-base">
            Click the button above when you're ready to begin
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
