import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Shield, Calendar, LogOut } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    password: '',
    confirmPassword: ''
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch user data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          navigate('/sign-in');
          return;
        }

        const response = await axios.get(
          'https://helping-hands-backend-w4pu.onrender.com/profile',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.status === 200) {
          setUser(response.data);
          setFormData({
            full_name: response.data.full_name,
            password: '',
            confirmPassword: ''
          });
          if (response.data.avatar_url) {
            setAvatarPreview(response.data.avatar_url);
          }
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError('Failed to load profile data');
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Password confirmation check
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const formDataToSend = new FormData();
      
      // Append text fields
      formDataToSend.append('full_name', formData.full_name);
      if (formData.password) {
        formDataToSend.append('password', formData.password);
      }
      
      // Append avatar if selected
      if (avatar) {
        formDataToSend.append('avatar', avatar);
      }

      const response = await axios.put(
        'https://helping-hands-backend-w4pu.onrender.com/profile',
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 200) {
        setSuccess('Profile updated successfully!');
        
        // Update local storage with new user data
        const updatedUser = { ...user, full_name: formData.full_name };
        if (response.data.avatar_url) {
          updatedUser.avatar_url = response.data.avatar_url;
          setAvatarPreview(response.data.avatar_url);
        }
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('storage')); // Trigger storage event
        
        // Reset password fields
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Profile update failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-800">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 md:p-8 text-white">
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-6 md:mb-0 md:mr-8 relative">
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt={user.full_name} 
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="bg-blue-100 text-blue-800 w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold border-4 border-white shadow-lg">
                    {user.full_name.charAt(0)}
                  </div>
                )}
                <label 
                  htmlFor="avatar-upload"
                  className="absolute bottom-2 right-2 bg-white text-blue-600 rounded-full p-2 shadow-md cursor-pointer hover:bg-blue-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </label>
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold">{user.full_name}</h1>
                <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    <span className="capitalize">{user.role}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Profile Form */}
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">Edit Profile</h2>
            
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="full_name" className="block mb-1 text-sm font-medium text-blue-800">
                  Full Name
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block mb-1 text-sm font-medium text-blue-800">
                  New Password (leave blank to keep current)
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter new password"
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-blue-800">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirm new password"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-3 font-semibold text-white rounded-lg transition-colors ${
                    isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center justify-center px-6 py-3 font-semibold text-red-600 border border-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Sign Out
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;