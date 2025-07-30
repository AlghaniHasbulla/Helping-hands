import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '@/assets/helpinghandsliogo.jpeg';
import { dispatchAuthEvent } from '@/lib/utils';
import ProfileDropdown from '../Profile/ProfileDropdown';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Listen for authentication changes
  useEffect(() => {
    const updateUserFromStorage = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      } else {
        setUser(null);
      }
    };

    // Initial read
    updateUserFromStorage();

    const handleAuthChange = () => {
      updateUserFromStorage();
    };
    
    window.addEventListener('auth-change', handleAuthChange);
    
    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
    dispatchAuthEvent();
    navigate('/');
    setIsProfileMenuOpen(false);
  };

  // Redirect causes tab for NGO users
  const handleCausesClick = (e) => {
    if (user && user.role === 'ngo') {
      e.preventDefault();
      navigate('/ngo-causes');
      setIsMenuOpen(false);
    }
  };

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
          <Link to="/" className="py-2 px-4 hover:text-blue-600 hover:bg-blue-50 rounded md:hover:bg-transparent" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/causes" onClick={(e) => { handleCausesClick(e); setIsMenuOpen(false); }} className="py-2 px-4 hover:text-blue-600 hover:bg-blue-50 rounded md:hover:bg-transparent">Causes</Link>
          <Link to="/events" className="py-2 px-4 hover:text-blue-600 hover:bg-blue-50 rounded md:hover:bg-transparent" onClick={() => setIsMenuOpen(false)}>Events</Link>
          <Link to="/about" className="py-2 px-4 hover:text-blue-600 hover:bg-blue-50 rounded md:hover:bg-transparent" onClick={() => setIsMenuOpen(false)}>About</Link>
          <Link to="/contacts" className="py-2 px-4 hover:text-blue-600 hover:bg-blue-50 rounded md:hover:bg-transparent" onClick={() => setIsMenuOpen(false)}>Contact</Link>
        </div>
      </div>

      <div className={`${isMenuOpen ? 'hidden' : 'flex'} md:flex items-center gap-4`}>
        {user ? (
          <ProfileDropdown user={user} />
        ) : (
          <>
            <Link
              to="/sign-up"
              className="border border-blue-600 text-blue-600 px-3 py-1.5 md:px-4 md:py-2 rounded-md hover:bg-blue-50 text-xs md:text-sm font-medium"
            >
              Create Account
            </Link>
            <Link
              to="/sign-in"
              className="border border-blue-600 text-blue-600 px-3 py-1.5 md:px-4 md:py-2 rounded-md hover:bg-blue-50 text-xs md:text-sm font-medium"
            >
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
