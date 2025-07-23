import React from 'react';
import logo from '@/assets/helpinghandsliogo.jpeg'; // Adjust path if needed
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow px-10 py-8 flex items-center justify-between">
      {/* Left: Logo + Brand */}
      <div className="flex items-center gap-3">
        <img src={logo} alt="Helping Hands Logo" className="h-8 w-8 object-contain" />
        <span className="text-xl font-semibold text-blue-700">Helping Hands</span>
      </div>

      {/* Center: Navigation Links */}
      <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-600">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <Link to="/causes" className="hover:text-blue-600">Causes</Link>
        <Link to="/events" className="hover:text-blue-600">Events</Link>
        <Link to="/blog" className="hover:text-blue-600">Blog</Link>
        <Link to="/about" className="hover:text-blue-600">About</Link>
        <Link to="/contact" className="hover:text-blue-600">Contact</Link>
      </div>

      {/* Right: Buttons */}
      <div className="flex items-center gap-3">
        <Link
          to="/donate"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
        >
          Donate Now
        </Link>
        <Link
          to="/sign-in"
          className="border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 text-sm font-medium"
        >
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
