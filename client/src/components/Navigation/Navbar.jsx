import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '@/assets/helpinghandsliogo.jpeg';
import { User, LogOut } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check for logged-in user on initial load and when storage changes
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    
    // Listen for login/logout events from other components
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem('user');
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
    setIsProfileMenuOpen(false);
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
          <Link to="/causes" className="py-2 px-4 hover:text-blue-600 hover:bg-blue-50 rounded md:hover:bg-transparent" onClick={() => setIsMenuOpen(false)}>Causes</Link>
          <Link to="/events" className="py-2 px-4 hover:text-blue-600 hover:bg-blue-50 rounded md:hover:bg-transparent" onClick={() => setIsMenuOpen(false)}>Events</Link>
          <Link to="/about" className="py-2 px-4 hover:text-blue-600 hover:bg-blue-50 rounded md:hover:bg-transparent" onClick={() => setIsMenuOpen(false)}>About</Link>
          <Link to="/contacts" className="py-2 px-4 hover:text-blue-600 hover:bg-blue-50 rounded md:hover:bg-transparent" onClick={() => setIsMenuOpen(false)}>Contact</Link>
        </div>
      </div>

      <div className={`${isMenuOpen ? 'hidden' : 'flex'} md:flex items-center gap-4`}>
        {user ? (
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              {user.avatar_url ? (
                <img 
                  src={user.avatar_url} 
                  alt={user.full_name || "User"} 
                  className="w-9 h-9 rounded-full object-cover border-2 border-blue-200"
                />
              ) : (
                <div className="bg-blue-100 text-blue-800 w-9 h-9 rounded-full flex items-center justify-center font-medium">
                  {user.full_name ? user.full_name.charAt(0) : "U"}
                </div>
              )}
              <span className="hidden md:inline text-blue-800 font-medium">{user.full_name || "User"}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 text-blue-600 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-20 border border-blue-100">
                <Link 
                  to="/profile" 
                  className="flex items-center px-4 py-3 text-blue-800 hover:bg-blue-50 rounded-t-lg"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  <span>My Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 text-blue-800 hover:bg-blue-50 rounded-b-lg"
                >
                  <LogOut className="h-5 w-5 mr-2 text-blue-600" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
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
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;