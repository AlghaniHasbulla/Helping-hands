import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'donor',
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
    instagram: ''
  });
  
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        setError('Please upload an image file (JPEG, PNG)');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError('File size too large (max 5MB)');
        return;
      }
      
      setAvatarFile(file);
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    // Validate step 1 fields before proceeding
    if (!formData.full_name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    setError('');
    setStep(2);
  };

  const prevStep = () => {
    setError('');
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      
      // Append all form data
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      
      if (avatarFile) {
        formDataToSend.append('avatar', avatarFile);
      }

      const response = await axios.post(
      'https://helping-hands-backend-w4pu.onrender.com/register',
      formDataToSend,
      {
        headers: {
          'Content-Type': 'application/json' 
        }
      }
    );

      if (response.status === 201) {
        setSuccess(response.data.msg);
        navigate('/verify-email', { state: { email: formData.email } });
      }
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 
                      err.response?.data?.message || 
                      'Registration failed. Please try again.';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Render step 1: Account Information
  const renderStep1 = () => (
    <>
      <div className="flex flex-col items-center">
        <div className="relative mb-3">
          <div 
            className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden"
            onClick={triggerFileInput}
          >
            {avatarPreview ? (
              <img 
                src={avatarPreview} 
                alt="Profile preview" 
                className="w-full h-full object-cover"
              />
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
            className="mt-1 text-xs md:text-sm text-blue-600 hover:text-blue-800 font-medium"
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
        <p className="mt-1 text-xs text-gray-500">
          Must contain at least 8 characters
        </p>
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
            <option value="ngo">NGO</option>
            <option value="admin">Admin (Special Access)</option>
          </select>
          <p className="mt-1 text-xs text-blue-600">
            * Admins need separate approval
          </p>
      </div>

      <div className="flex justify-between pt-2">
        <div></div> {/* Spacer */}
        <button
          type="button"
          onClick={nextStep}
          className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continue
        </button>
      </div>
    </>
  );

  // Render step 2: Profile Details
  const renderStep2 = () => (
    <>
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-blue-900">Profile Information</h2>
        <p className="text-blue-600 text-sm">Complete your profile (all fields optional)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="block mb-1 text-sm font-medium text-blue-800">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="+1 (555) 123-4567"
          />
        </div>

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
            className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com"
          />
        </div>
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
          className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="123 Main St"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="New York"
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
            className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="New York"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="United States"
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
            className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="10001"
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
          className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Tell us about yourself or your organization..."
          rows="3"
        ></textarea>
      </div>

      <div className="pt-2">
        <h3 className="text-md font-medium text-blue-800 mb-2">Social Media Profiles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="@username"
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
              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="username"
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
              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="linkedin.com/in/username"
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
              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="@username"
            />
          </div>
        </div>
      </div>

      <div className="flex items-start pt-2">
        <input
          type="checkbox"
          id="terms"
          className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          required
        />
        <label htmlFor="terms" className="ml-2 block text-xs md:text-sm text-blue-800">
          I agree to the <a href="/terms" className="text-blue-600 hover:underline">Terms</a> and <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
        </label>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={prevStep}
          className="px-6 py-2.5 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 transition-colors"
        >
          Back
        </button>
        <button 
          type="submit"
          disabled={isLoading}
          className={`px-6 py-2.5 font-semibold text-white rounded-lg transition-colors duration-300 ${
            isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Account...
            </div>
          ) : (
            'Create Account'
          )}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-700 p-4">
      <div className="w-full max-w-2xl p-6 md:p-8 space-y-4 bg-white rounded-xl shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-1 md:mb-2">Create Account</h1>
          <p className="text-blue-600 text-sm md:text-base">Start your charitable journey today</p>          <p className="text-blue-600 text-sm md:text-base">Step {step} of 2</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md">
            {success}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {step === 1 ? renderStep1() : renderStep2()}
        </form>

        <div className="flex flex-col items-center gap-1 pt-3 text-center">
          <span className="text-xs md:text-sm text-blue-800">Already have an account?</span>
          <Link to="/sign-in" className="text-xs md:text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;