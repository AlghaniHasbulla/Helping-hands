import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDonationsToMyRequests } from '../../store/donationsSlice';
import { formatDate } from '../../lib/utils';

const NGOReceivedDonations = () => {
  const dispatch = useDispatch();
  const donations = useSelector(state => state.donations.donationsToMyRequests) || [];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(fetchDonationsToMyRequests()).unwrap();
      } catch (err) {
        setError(err.message || 'Failed to load donations');
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-semibold text-blue-800 mb-6">Donations Received</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && donations.length === 0 && <p>No donations received yet.</p>}

        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-100 text-blue-800">
              <th className="border border-gray-300 px-4 py-2 text-left">Request Title</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Amount</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Donated At</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation.id} className="hover:bg-blue-50">
                <td className="border border-gray-300 px-4 py-2">{donation.donation_request?.title || 'N/A'}</td>
                <td className="border border-gray-300 px-4 py-2">${donation.amount.toFixed(2)}</td>
                <td className="border border-gray-300 px-4 py-2">{formatDate(donation.donated_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NGOReceivedDonations;
