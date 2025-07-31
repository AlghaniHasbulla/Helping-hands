import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { makeDonation } from '../../store/donationsSlice';

const DonationForm = ({ donationRequestId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { makeDonationStatus } = useSelector(state => state.donations);
  const userRole = useSelector(state => state.auth.user?.role);

  const [formData, setFormData] = useState({
    amount: '',
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(makeDonation({ donation_request_id: donationRequestId, amount: parseFloat(formData.amount), notes: formData.notes }));
  };

  useEffect(() => {
    if (!makeDonationStatus.loading && !makeDonationStatus.error && makeDonationStatus.loading !== null) {
      // Navigate to donation history after successful donation
      navigate('/donation-history');
    }
  }, [makeDonationStatus.loading, makeDonationStatus.error, navigate]);

  return (
    <div className="max-w-md p-6 bg-white rounded-xl shadow-lg">
      <h3 className="text-2xl font-semibold text-blue-800 mb-4">Make a Donation</h3>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="amount" className="block mb-1 text-sm font-medium text-blue-800">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter amount"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <label htmlFor="notes" className="block mb-1 text-sm font-medium text-blue-800">Notes (optional)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add any notes"
            rows="3"
          />
        </div>

        {userRole === 'ngo' && (
          <div className="p-4 bg-blue-100 rounded-lg text-blue-800">
            <p>This is an NGO-specific feature or message.</p>
          </div>
        )}

        <button
          type="submit"
          disabled={makeDonationStatus.loading}
          className="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50"
        >
          {makeDonationStatus.loading ? 'Processing...' : 'Donate'}
        </button>

        {makeDonationStatus.error && (
          <p className="text-red-600 mt-2">
            {typeof makeDonationStatus.error === 'object' ? makeDonationStatus.error.msg : makeDonationStatus.error}
          </p>
        )}
      </form>
    </div>
  );
};

export default DonationForm;
