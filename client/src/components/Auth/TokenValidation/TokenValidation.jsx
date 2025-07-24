import React, { useState } from 'react'

const TokenValidation = () => {
  const [token, setToken] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Token submitted:", token);
    // POST to Flask backend here
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md"
        >
          Verify
        </button>
      </form>
    </div>
  );
}

export default TokenValidation