import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ExamInterface from './components/ExamInterface';
import ResultPage from './components/ResultPage';

type AppState = 'auth' | 'dashboard' | 'exam' | 'results';
type AuthMode = 'login' | 'register';

const AppContent: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('auth');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [examResult, setExamResult] = useState(null);
  
  const { user, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show auth forms
  if (!user) {
    if (authMode === 'login') {
      return <Login onToggleMode={() => setAuthMode('register')} />;
    } else {
      return <Register onToggleMode={() => setAuthMode('login')} />;
    }
  }

  // User is authenticated, show appropriate screen based on app state
  switch (appState) {
    case 'dashboard':
      return (
        <Dashboard 
          onStartExam={() => setAppState('exam')} 
        />
      );
    
    case 'exam':
      return (
        <ExamInterface 
          onExamComplete={(result) => {
            setExamResult(result);
            setAppState('results');
          }} 
        />
      );
    
    case 'results':
      return (
        <ResultPage 
          result={examResult}
          onReturnHome={() => setAppState('dashboard')} 
        />
      );
    
    default:
      return (
        <Dashboard 
          onStartExam={() => setAppState('exam')} 
        />
      );
  }
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;