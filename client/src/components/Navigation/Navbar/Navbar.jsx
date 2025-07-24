import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import logo from '@/assets/helpinghandsliogo.jpeg';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userRole = useSelector(state => state.auth.user?.role);

  return (
    <nav className="bg-white shadow px-4 py-4 md:px-8 md:py-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <img src={logo} alt="Helping Hands Logo" className="h-7 w-7 md:h-8 md:w-8 object-contain" />
        <span className="text-lg md:text-xl font-semibold text-blue-700">Helping Hands</span>
      </div>

      <button 
        className="md:hidden p-2 rounded-md text-blue-700 hover:bg-blue-50 focus:outline-none"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          {isMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:flex absolute top-16 left-0 w-full bg-white shadow-lg z-10 md:static md:shadow-none md:space-x-6 md:w-auto`}>
        <div className="flex flex-col md:flex-row md:space-x-6 text-sm font-medium text-gray-600 px-4 py-4 md:py-0">
          <Link to="/" className="py-2 px-4 hover:text-blue-600 hover:bg-blue-50 rounded md:hover:bg-transparent">Home</Link>
          <Link to="/causes" className="py-2 px-4 hover:text-blue-600 hover:bg-blue-50 rounded md:hover:bg-transparent">Causes</Link>
          <Link to="/events" className="py-2 px-4 hover:text-blue-600 hover:bg-blue-50 rounded md:hover:bg-transparent">Events</Link>
          <Link to="/blog" className="py-2 px-4 hover:text-blue-600 hover:bg-blue-50 rounded md:hover:bg-transparent">Blog</Link>
          <Link to="/about" className="py-2 px-4 hover:text-blue-600 hover:bg-blue-50 rounded md:hover:bg-transparent">About</Link>
          <Link to="/contact" className="py-2 px-4 hover:text-blue-600 hover:bg-blue-50 rounded md:hover:bg-transparent">Contact</Link>
          {userRole === 'donor' && (
            <>
              <Link to="/donor/home" className="py-2 px-4 hover:text-blue-600 hover:bg-blue-50 rounded md:hover:bg-transparent">Donor Home</Link>
              <Link to="/donor/history" className="py-2 px-4 hover:text-blue-600 hover:bg-blue-50 rounded md:hover:bg-transparent">Donation History</Link>
              <Link to="/donor/receipts" className="py-2 px-4 hover:text-blue-600 hover:bg-blue-50 rounded md:hover:bg-transparent">Receipts</Link>
              <Link to="/donor/goals" className="py-2 px-4 hover:text-blue-600 hover:bg-blue-50 rounded md:hover:bg-transparent">Goals</Link>
            </>
          )}
        </div>
      </div>

      <div className={`${isMenuOpen ? 'hidden' : 'flex'} md:flex items-center gap-2`}>
        {!userRole ? (
          <>
            <span className="text-gray-600 mr-4">Welcome to Helping Hands</span>
          </>
        ) : (
          <>
            <Link
              to="/donation-request"
              className="hidden md:block bg-blue-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-md hover:bg-blue-700 text-xs md:text-sm font-medium"
            >
              Donate Now
            </Link>
            <Link
              to="/sign-in"
              className="border border-blue-600 text-blue-600 px-3 py-1.5 md:px-4 md:py-2 rounded-md hover:bg-blue-50 text-xs md:text-sm font-medium"
            >
              Logout
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
