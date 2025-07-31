import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { dispatchAuthEvent } from '@/lib/utils';

const ProfileDropdown = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userAvatarUrl = user?.avatar_url;
    setAvatarUrl(userAvatarUrl || null);
    setImageError(false);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    dispatchAuthEvent();
    navigate('/');
    setIsOpen(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const renderAvatar = () => {
    if (avatarUrl && !imageError) {
      return (
        <img 
          src={avatarUrl} 
          alt={user?.full_name || "User"} 
          className="w-9 h-9 rounded-full object-cover border-2 border-blue-200"
          onError={handleImageError}
        />
      );
    } else {
      const initials = user?.full_name ? user.full_name.charAt(0).toUpperCase() : "U";
      return (
        <div className="bg-blue-100 text-blue-800 w-9 h-9 rounded-full flex items-center justify-center font-medium">
          {initials}
        </div>
      );
    }
  };

  // Determine link and label based on role
  const getRoleLink = () => {
    switch (user?.role) {
      case 'ngo':
        return { path: '/ngo-dashboard', label: 'NGO Dashboard' };
      case 'admin':
        return { path: '/admin', label: 'Admin Dashboard' };
      default:
        return { path: '/profile', label: 'My Profile' };
    }
  };

  const { path, label } = getRoleLink();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        {renderAvatar()}
        <span className="hidden md:inline text-blue-800 font-medium">
          {user?.full_name || "User"}
        </span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-4 w-4 text-blue-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-20 border border-blue-100">
          <Link 
            to={path} 
            className="flex items-center px-4 py-3 text-blue-800 hover:bg-blue-50 rounded-t-lg"
            onClick={() => setIsOpen(false)}
          >
            <User className="h-5 w-5 mr-2 text-blue-600" />
            <span>{label}</span>
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
  );
};

export default ProfileDropdown;
