import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, User, Lock, AlertCircle } from 'lucide-react';

interface LoginProps {
  onToggleMode: () => void;
}

const Login: React.FC<LoginProps> = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#C5ADC5' }}>
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to start your exam</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition duration-200"
                style={{ '--tw-ring-color': '#B2B5E0' } as React.CSSProperties}
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition duration-200"
                style={{ '--tw-ring-color': '#B2B5E0' } as React.CSSProperties}
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full text-white py-3 px-4 rounded-lg focus:ring-2 focus:ring-offset-2 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: '#B2B5E0',
              '--tw-ring-color': '#C5ADC5'
            } as React.CSSProperties}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9CA3DB'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#B2B5E0'}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={onToggleMode}
              className="font-medium transition duration-200"
              style={{ color: '#C5ADC5' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#B19CB1'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#C5ADC5'}
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;