import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sign in submitted:', formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-600 p-4">
      <div className="w-full max-w-md p-6 md:p-8 space-y-4 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-1 md:mb-2">Welcome Back</h1>
          <p className="text-blue-600 text-sm md:text-base">Sign in to continue your charitable journey</p>
        </div>
  
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
            className="w-full px-4 py-2.5 md:py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Sign In
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