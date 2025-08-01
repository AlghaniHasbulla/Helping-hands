import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, Home, Globe, Calendar, CreditCard, 
  MapPin, BookOpen, Link, Twitter, Facebook, Linkedin, Instagram, 
  LogOut, Trash2, Lock, Award, PieChart
} from 'lucide-react';

const Profile = () => {
  const BASE_URL = '/api';
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    bio: '',
    website: '',
    twitter: '',
    facebook: '',
    linkedin: '',
    instagram: '',
    password: '',
    confirmPassword: '',
    current_password: ''
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('personal');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [donationStats, setDonationStats] = useState(null);

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Helper function to handle API responses
  const handleResponse = async (response) => {
    console.log(`API Response: ${response.status} ${response.statusText} for ${response.url}`);
    
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        navigate('/sign-in');
        throw new Error('Session expired. Please sign in again.');
      }
      
      let errorData = {};
      try {
        errorData = await response.json();
        console.log('Error response data:', errorData);
      } catch (e) {
        console.log('Could not parse error response as JSON');
      }
      
      throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  };

  // Fetch user profile data
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      console.log('Token exists:', !!token);
      console.log('Token length:', token?.length);
      
      if (!token) {
        console.log('No token found, redirecting to sign-in');
        navigate('/sign-in');
        return;
      }

      console.log('Making request to:', 'https://helping-hands-backend-w4pu.onrender.com/profile');
      const response = await fetch('https://helping-hands-backend-w4pu.onrender.com/profile', {
        method: 'GET',
        headers: getAuthHeaders()
      });

      const userData = await handleResponse(response);
      console.log('Profile data received:', userData);
      
      setUser(userData);
      setFormData({
        full_name: userData.full_name || '',
        phone: userData.phone || '',
        address: userData.address || '',
        city: userData.city || '',
        state: userData.state || '',
        country: userData.country || '',
        postal_code: userData.postal_code || '',
        bio: userData.bio || '',
        website: userData.website || '',
        twitter: userData.twitter || '',
        facebook: userData.facebook || '',
        linkedin: userData.linkedin || '',
        instagram: userData.instagram || '',
        password: '',
        confirmPassword: '',
        current_password: ''
      });
      
      if (userData.avatar_url) {
        setAvatarPreview(userData.avatar_url);
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError(err.message || 'Failed to load profile data');
    }
  };

  // Fetch donation statistics
  const fetchDonationStats = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const response = await fetch('https://helping-hands-backend-w4pu.onrender.com/donations/stats', {
        method: 'GET',
        headers: getAuthHeaders()
      });

      const stats = await handleResponse(response);
      setDonationStats(stats);
    } catch (err) {
      console.error('Donation stats error:', err);
      // Don't show error for donation stats as it's not critical
    }
  };

  // Initialize component
  useEffect(() => {
    fetchProfile();
    fetchDonationStats();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        setError('Please upload an image file (JPEG, PNG)');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size too large (max 5MB)');
        return;
      }
      
      setAvatar(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      setError(''); // Clear any previous errors
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
      if (!token) {
        navigate('/sign-in');
        return;
      }

      const formDataToSend = new FormData();
      
      // Append text fields (only if they have values)
      Object.entries(formData).forEach(([key, value]) => {
        if (value && key !== 'confirmPassword') {
          formDataToSend.append(key, value);
        }
      });
      
      // Append avatar if selected
      if (avatar) {
        formDataToSend.append('avatar', avatar);
      }

      const response = await fetch('https://helping-hands-backend-w4pu.onrender.com/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type for FormData, let the browser set it
        },
        body: formDataToSend
      });

      await handleResponse(response);
      setSuccess('Profile updated successfully!');
      
      // Refetch updated profile
      await fetchProfile();
      
      // Update localStorage and trigger auth change event
      const updatedUser = await fetch('https://helping-hands-backend-w4pu.onrender.com/profile', {
        method: 'GET',
        headers: getAuthHeaders()
      }).then(handleResponse);
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('auth-change'));
      
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'Profile update failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/sign-in');
        return;
      }

      const response = await fetch('https://helping-hands-backend-w4pu.onrender.com/profile/delete', {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      await handleResponse(response);
      
      // Logout user
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.dispatchEvent(new CustomEvent('auth-change', { detail: { user: null } }));
      navigate('/');
      
    } catch (err) {
      console.error('Delete account error:', err);
      setError(err.message || 'Failed to delete account. Please try again.');
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.dispatchEvent(new CustomEvent('auth-change', { detail: { user: null } }));
    navigate('/');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Loading state
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
    <div className="min-h-screen bg-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 md:p-8 text-white">
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-6 md:mb-0 md:mr-8 relative group">
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt={user.full_name || 'Profile'} 
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="bg-blue-100 text-blue-800 w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold border-4 border-white shadow-lg">
                    {(user.full_name || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <label 
                  htmlFor="avatar-upload"
                  className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              
              <div className="flex-1 w-full">
                <h1 className="text-3xl font-bold mb-2 text-center md:text-left">{user.full_name || 'User'}</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm text-blue-100">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-white" />
                    <span>{user.email}</span>
                  </div>

                  {user.phone && (
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 mr-2 text-white" />
                      <span>{user.phone}</span>
                    </div>
                  )}

                  {(user.city || user.country) && (
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-white" />
                      <span>{user.city}, {user.country}</span>
                    </div>
                  )}

                  {user.address && (
                    <div className="flex items-center">
                      <Home className="h-5 w-5 mr-2 text-white" />
                      <span>{user.address}</span>
                    </div>
                  )}

                  {user.bio && (
                    <div className="md:col-span-2 flex items-start">
                      <BookOpen className="h-5 w-5 mr-2 mt-0.5 text-white" />
                      <p>{user.bio}</p>
                    </div>
                  )}
                </div>

                {user.role && (
                  <div className="mt-4 inline-block bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab('personal')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'personal' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-blue-800 hover:bg-blue-50'
            }`}
          >
            Personal Information
          </button>
          {user.role !== 'ngo' && (
            <button
              onClick={() => setActiveTab('donations')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'donations' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-blue-800 hover:bg-blue-50'
              }`}
            >
              Donation History
            </button>
          )}
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'security' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-blue-800 hover:bg-blue-50'
            }`}
          >
            Security
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'account' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-blue-800 hover:bg-blue-50'
            }`}
          >
            Account Settings
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          {activeTab === 'personal' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">Personal Information</h2>
              
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <label htmlFor="phone" className="block mb-1 text-sm font-medium text-blue-800">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div>
                  <label htmlFor="address" className="block mb-1 text-sm font-medium text-blue-800">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your street address"
                  />
                </div>
                
                <div>
                  <label htmlFor="city" className="block mb-1 text-sm font-medium text-blue-800">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your city"
                  />
                </div>
                
                <div>
                  <label htmlFor="state" className="block mb-1 text-sm font-medium text-blue-800">
                    State/Province
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your state or province"
                  />
                </div>
                
                <div>
                  <label htmlFor="country" className="block mb-1 text-sm font-medium text-blue-800">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your country"
                  />
                </div>
                
                <div>
                  <label htmlFor="postal_code" className="block mb-1 text-sm font-medium text-blue-800">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="postal_code"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your postal code"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="bio" className="block mb-1 text-sm font-medium text-blue-800">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell us about yourself..."
                  rows="4"
                />
              </div>
              
              <h3 className="text-xl font-semibold text-blue-900 mt-8 mb-4">Social Profiles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="website" className="block mb-1 text-sm font-medium text-blue-800">
                    Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="twitter" className="block mb-1 text-sm font-medium text-blue-800">
                    Twitter
                  </label>
                  <input
                    type="text"
                    id="twitter"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="@yourusername"
                  />
                </div>
                
                <div>
                  <label htmlFor="facebook" className="block mb-1 text-sm font-medium text-blue-800">
                    Facebook
                  </label>
                  <input
                    type="text"
                    id="facebook"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="yourusername"
                  />
                </div>
                
                <div>
                  <label htmlFor="linkedin" className="block mb-1 text-sm font-medium text-blue-800">
                    LinkedIn
                  </label>
                  <input
                    type="text"
                    id="linkedin"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="yourusername"
                  />
                </div>
                
                <div>
                  <label htmlFor="instagram" className="block mb-1 text-sm font-medium text-blue-800">
                    Instagram
                  </label>
                  <input
                    type="text"
                    id="instagram"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="@yourusername"
                  />
                </div>
              </div>
              
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-3 font-semibold text-white rounded-lg transition-colors ${
                    isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
          
          {activeTab === 'donations' && (
            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-6">Your Donations</h2>
              
              {donationStats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-50 p-6 rounded-xl">
                    <div className="flex items-center mb-4">
                      <CreditCard className="h-8 w-8 text-blue-600 mr-3" />
                      <h3 className="text-xl font-semibold text-blue-900">Total Donated</h3>
                    </div>
                    <p className="text-3xl font-bold text-blue-800">
                      {formatCurrency(donationStats.total_donations)}
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 p-6 rounded-xl">
                    <div className="flex items-center mb-4">
                      <Award className="h-8 w-8 text-blue-600 mr-3" />
                      <h3 className="text-xl font-semibold text-blue-900">Donation Count</h3>
                    </div>
                    <p className="text-3xl font-bold text-blue-800">
                      {donationStats.donation_count || 0}
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 p-6 rounded-xl">
                    <div className="flex items-center mb-4">
                      <PieChart className="h-8 w-8 text-blue-600 mr-3" />
                      <h3 className="text-xl font-semibold text-blue-900">Top Category</h3>
                    </div>
                    <p className="text-xl font-bold text-blue-800 mb-1">
                      {donationStats.top_category || 'N/A'}
                    </p>
                    <p className="text-blue-700">
                      {formatCurrency(donationStats.top_category_amount)}
                    </p>
                  </div>
                </div>
              )}
              
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Recent Donations</h3>
              
              {user.donation_history && user.donation_history.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-blue-100 text-blue-800">
                        <th className="p-4 text-left">Cause</th>
                        <th className="p-4 text-left">Amount</th>
                        <th className="p-4 text-left">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {user.donation_history.map((donation) => (
                        <tr key={donation.id} className="border-b border-blue-100 hover:bg-blue-50">
                          <td className="p-4">
                            <div className="flex items-center">
                              {donation.image_url ? (
                                <img 
                                  src={donation.image_url} 
                                  alt={donation.title} 
                                  className="w-16 h-16 rounded-lg object-cover mr-4"
                                />
                              ) : (
                                <div className="bg-blue-200 w-16 h-16 rounded-lg mr-4 flex items-center justify-center">
                                  <CreditCard className="h-8 w-8 text-blue-600" />
                                </div>
                              )}
                              <div>
                                <div className="font-medium text-blue-900">{donation.title}</div>
                                {donation.description && (
                                  <div className="text-blue-700 text-sm mt-1 line-clamp-1">
                                    {donation.description}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-semibold text-blue-900">
                            {formatCurrency(donation.amount)}
                          </td>
                          <td className="p-4 text-blue-700">
                            {formatDate(donation.donated_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-blue-50 rounded-xl p-8 text-center">
                  <div className="text-blue-300 mb-4">
                    <CreditCard className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">No donations yet</h3>
                  <p className="text-blue-700 max-w-md mx-auto">
                    Your donation history will appear here when you make your first contribution.
                  </p>
                  <button
                    onClick={() => navigate('/causes')}
                    className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors"
                  >
                    Explore Causes
                  </button>
                </div>
              )}
              
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => navigate('/donation-history')}
                  className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  View Full Donation History
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'security' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">Security Settings</h2>
              
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
              
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
                  <Lock className="h-6 w-6 mr-2" />
                  Change Password
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="current_password" className="block mb-1 text-sm font-medium text-blue-800">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="current_password"
                      name="current_password"
                      value={formData.current_password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your current password"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block mb-1 text-sm font-medium text-blue-800">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your new password"
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
                      placeholder="Confirm your new password"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-3 font-semibold text-white rounded-lg transition-colors ${
                    isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          )}
          
          {activeTab === 'account' && (
            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-6">Account Settings</h2>
              
              <div className="space-y-8">
                <div className="bg-blue-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-blue-900 mb-4">Account Information</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <p className="text-sm text-blue-700">Email</p>
                        <p className="font-medium text-blue-900">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <p className="text-sm text-blue-700">Account Created</p>
                        <p className="font-medium text-blue-900">{formatDate(user.created_at)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <p className="text-sm text-blue-700">Total Donations</p>
                        <p className="font-medium text-blue-900">{formatCurrency(user.total_donations)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-yellow-900 mb-4 flex items-center">
                    <LogOut className="h-6 w-6 mr-2" />
                    Logout
                  </h3>
                  
                  <p className="text-yellow-700 mb-4">
                    Sign out of your account on this device.
                  </p>
                  
                  <button
                    onClick={handleLogout}
                    className="px-6 py-3 font-semibold text-white bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
                
                <div className="bg-red-50 border border-red-200 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-red-900 mb-4 flex items-center">
                    <Trash2 className="h-6 w-6 mr-2" />
                    Delete Account
                  </h3>
                  
                  <p className="text-red-700 mb-4">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="px-6 py-3 font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    Delete My Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="text-center">
              <Trash2 className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Your Account?</h3>
              <p className="text-gray-600 mb-6">
                This will permanently delete your account and all associated data. 
                You will lose access to all your donation history and account information.
              </p>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isLoading}
                  className="px-6 py-3 font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                  className={`px-6 py-3 font-semibold text-white rounded-lg transition-colors ${
                    isLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isLoading ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;