import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDonationHistory } from '../../store/donationsSlice';
import { formatDate } from '../../lib/utils';

const DonationHistory = () => {
  const dispatch = useDispatch();
  const donationHistory = useSelector(state => state.donations.donationHistory) || { items: [], total: 0 };
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    dispatch(fetchDonationHistory({ page, limit }));
  }, [dispatch, page]);

  const totalPages = Math.ceil((donationHistory.total || 0) / limit);

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-semibold text-blue-800 mb-6">Your Donation History</h2>
        {donationHistory.loading && <p>Loading...</p>}
        {donationHistory.error && <p className="text-red-600">{donationHistory.error}</p>}
        {!donationHistory.loading && donationHistory.items.length === 0 && <p>No donations found.</p>}

        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-100 text-blue-800">
              <th className="border border-gray-300 px-4 py-2 text-left">Request Title</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Amount</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Donated At</th>
            </tr>
          </thead>
          <tbody>
            {donationHistory.items.map((donation) => (
              <tr key={donation.id} className="hover:bg-blue-50">
                <td className="border border-gray-300 px-4 py-2">{donation.donation_request?.title || 'N/A'}</td>
                <td className="border border-gray-300 px-4 py-2">${donation.amount.toFixed(2)}</td>
                <td className="border border-gray-300 px-4 py-2">{formatDate(donation.donated_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="mt-4 flex justify-center space-x-2">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-blue-800 font-semibold">{page} / {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationHistory;
