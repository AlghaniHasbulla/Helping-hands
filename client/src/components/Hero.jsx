import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="bg-blue-600 text-white py-20 px-6 text-center">
      <h1 className="text-5xl font-bold mb-4">Welcome to Helping Hands</h1>
      <p className="text-xl mb-8">Join us in making a difference in the lives of those in need.</p>
      <p className="text-xl mb-8">To have access to more features, you have to first sign up/ sign in below.</p>
      <div className="space-x-4">
        <Link
          to="/sign-up"
          className="bg-white text-blue-600 font-semibold px-6 py-3 rounded shadow hover:bg-gray-100"
        >
          Sign Up
        </Link>
        <Link
          to="/about"
          className="bg-blue-500 bg-opacity-30 text-white font-semibold px-6 py-3 rounded shadow hover:bg-opacity-50"
        >
          Learn More
        </Link>
      </div>
    </section>
  );
};

export default Hero;
