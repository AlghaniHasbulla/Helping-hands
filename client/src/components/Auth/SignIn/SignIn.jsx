import React from 'react'
import { Link } from 'react-router-dom'

const SignIn = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-600">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">Welcome Back</h1>
          <p className="text-blue-600">Sign in to continue your charitable journey</p>
        </div>

        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-blue-800">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-blue-800">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
            />
            <div className="text-right mt-1">
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">Forgot password?</Link>
            </div>
          </div>

          <button className="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300">
            Sign In
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 pt-4">
          <span className="text-sm text-blue-800">Don't have an account?</span>
          <Link to="/Sign-Up" className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

export default SignIn