import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'donor',
  });
  
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('full_name', formData.full_name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('role', formData.role);
    if (avatarFile) formDataToSend.append('avatar', avatarFile);
    console.log('Form submitted:', formDataToSend);
  };

  const triggerFileInput = () => fileInputRef.current.click();

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-600 p-4">
      <div className="w-full max-w-md p-6 md:p-8 space-y-4 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-1 md:mb-2">Create Account</h1>
          <p className="text-blue-600 text-sm md:text-base">Start your charitable journey today</p>
        </div>

        <form className="space-y-3 md:space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center">
            <div className="relative mb-3">
              <div 
                className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden"
                onClick={triggerFileInput}
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Profile preview" className="w-full h-full object-cover" />
                ) : (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-8 w-8 md:h-10 md:w-10 text-gray-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                )}
              </div>
              
              <button
                type="button"
                className="mt-1 text-xs md:text-sm text-blue-600 hover:text-blue-800"
                onClick={triggerFileInput}
              >
                {avatarFile ? 'Change Photo' : 'Upload Photo'}
              </button>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <p className="text-xs text-gray-500 text-center">
              Upload a profile picture (optional, max 2MB)
            </p>
          </div>

          <div>
            <label htmlFor="full_name" className="block mb-1 text-sm font-medium text-blue-800">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full px-3 py-2 md:px-4 md:py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-blue-800">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 md:px-4 md:py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-blue-800">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 md:px-4 md:py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="At least 8 characters"
              minLength="8"
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="block mb-1 text-sm font-medium text-blue-800">
              I am signing up as <span className="text-red-500">*</span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 md:px-4 md:py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              required
            >
              <option value="donor">Donor (Individual)</option>
              <option value="charity">Charity Organization</option>
              <option value="admin">Admin (Special Access)</option>
            </select>
            <p className="mt-1 text-xs text-blue-600">
              * Admins need separate approval
            </p>
          </div>

          <div className="flex items-start">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-xs md:text-sm text-blue-800">
              I agree to the <a href="#" className="text-blue-600 hover:underline">Terms</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
            </label>
          </div>

          <button 
            type="submit"
            className="w-full px-4 py-2.5 md:py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Create Account
          </button>
        </form>

        <div className="flex flex-col items-center gap-1 pt-3 text-center">
          <span className="text-xs md:text-sm text-blue-800">Already have an account?</span>
          <Link to="/Sign-In" className="text-xs md:text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;