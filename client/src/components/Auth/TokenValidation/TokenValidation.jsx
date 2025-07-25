import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TokenValidation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [email, setEmail] = useState(location.state?.email || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // First, get a token by logging in (since backend requires JWT for verification)
      const loginResponse = await axios.post(
        'https://helping-hands-backend-w4pu.onrender.com/login',
        {
          email,
          password: "temporary_password" // This won't work - need a different approach
        }
      );

      // This approach won't work because we don't know the password
      // Alternative: Backend needs to provide a non-JWT verification endpoint
      
      // Since the current backend requires JWT for verification, we need a different solution
      // For now, I'll show an error message indicating this limitation
      setError("Backend verification requires JWT. Please contact support.");
      
      // Ideally, the backend should provide a public verification endpoint
      // The following code is for illustration if such an endpoint existed:
      /*
      const response = await axios.post(
        'https://helping-hands-backend-w4pu.onrender.com/verify-email',
        { token },
        {
          headers: {
            Authorization: `Bearer ${loginResponse.data.access_token}`
          }
        }
      );

      if (response.status === 200) {
        navigate('/dashboard');
      }
      */
    } catch (err) {
      setError(err.response?.data?.msg || 'Verification failed. Please try again.');
      console.error('Verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-md shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center text-blue-800">
          Verify Your Account
        </h2>
        <p className="text-sm text-center text-blue-500">
          Enter the 6-digit code sent to your email
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block mb-1 text-sm font-medium text-blue-800">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="your@email.com"
          />
        </div>

        <input
          type="text"
          placeholder="6-digit code"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full ${
            isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
          } text-white font-semibold py-2 rounded-md`}
        >
          {isLoading ? 'Verifying...' : 'Verify'}
        </button>

        <p className="text-sm text-center text-blue-500 mt-4">
          Didn't receive the code? <button 
            type="button" 
            className="text-blue-700 hover:underline"
            onClick={() => console.log('Resend code functionality')}
          >
            Resend code
          </button>
        </p>
      </form>
    </div>
  );
}

export default TokenValidation;