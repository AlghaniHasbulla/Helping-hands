import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'https://helping-hands-backend-w4pu.onrender.com/login',
        {
          email: formData.email,
          password: formData.password
        }
      );

      if (response.status === 200) {
        // Save token and user data to local storage
        localStorage.setItem('accessToken', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Redirect to dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.response?.data?.msg === "Email is not verified") {
        navigate('/verify-email', { state: { email: formData.email } });
      } else {
        setError(err.response?.data?.msg || 'Login failed. Please try again.');
      }
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-600 p-4">
      <div className="w-full max-w-md p-6 md:p-8 space-y-4 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-1 md:mb-2">Welcome Back</h1>
          <p className="text-blue-600 text-sm md:text-base">Sign in to continue your charitable journey</p>
        </div>
  
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <form className="space-y-3 md:space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-blue-800">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 md:px-4 md:py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-blue-800">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 md:px-4 md:py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
              required
            />
            <div className="text-right mt-1">
              <Link to="/forgot-password" className="text-xs md:text-sm text-blue-600 hover:text-blue-800 hover:underline">Forgot password?</Link>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full px-4 py-2.5 md:py-3 font-semibold text-white rounded-lg transition-colors duration-300 ${
              isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="flex flex-col items-center gap-1 pt-3 text-center">
          <span className="text-xs md:text-sm text-blue-800">Don't have an account?</span>
          <Link to="/Sign-Up" className="text-xs md:text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignIn;