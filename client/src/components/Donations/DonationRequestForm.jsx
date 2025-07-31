import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createDonationRequest } from '../../store/donationsSlice';
import api from '../../lib/api';
import { useNavigate } from 'react-router-dom';

const DonationRequestForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { createRequestStatus } = useSelector(state => state.donations);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    amount_requested: '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!createRequestStatus.loading && !createRequestStatus.error) {
      // Clear form inputs on successful submission
      setFormData({
        title: '',
        description: '',
        category_id: '',
        amount_requested: '',
      });
      // Navigate to NGORequestsHistory page
      navigate('/ngo-requests-history');
    }
  }, [createRequestStatus, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(createDonationRequest(formData));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-semibold text-blue-800 mb-4">Create Donation Request</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title" className="block mb-1 text-sm font-medium text-blue-800">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter request title"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block mb-1 text-sm font-medium text-blue-800">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe your needs"
              rows="4"
              required
            />
          </div>

          <div>
            <label htmlFor="category_id" className="block mb-1 text-sm font-medium text-blue-800">Category</label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              required
            >
              <option value="">Select category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="amount_requested" className="block mb-1 text-sm font-medium text-blue-800">Amount Requested</label>
            <input
              type="number"
              id="amount_requested"
              name="amount_requested"
              value={formData.amount_requested}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter amount"
              min="0"
              step="0.01"
              required
            />
          </div>

          <button
            type="submit"
            disabled={createRequestStatus.loading}
            className="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50"
          >
            {createRequestStatus.loading ? 'Submitting...' : 'Submit Request'}
          </button>

          {createRequestStatus.error && (
            <p className="text-red-600 mt-2">{createRequestStatus.error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default DonationRequestForm;
