import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNGORequests } from '../../store/donationsSlice';
import { formatDate } from '../../lib/utils';

const NGORequestsHistory = () => {
  const dispatch = useDispatch();
  const { ngoRequests } = useSelector(state => state.donations);
  const [page, setPage] = useState(1);
  const limit = 10;

  // TODO: Replace with actual logged-in NGO ID from auth state
  const ngoId = 1;

  useEffect(() => {
    dispatch(fetchNGORequests({ ngoId, page, limit }));
  }, [dispatch, ngoId, page]);

  const totalPages = Math.ceil(ngoRequests.total / limit);

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-semibold text-blue-800 mb-6">Your Donation Requests</h2>
        {ngoRequests.loading && <p>Loading...</p>}
        {ngoRequests.error && <p className="text-red-600">{ngoRequests.error}</p>}
        {!ngoRequests.loading && ngoRequests.items.length === 0 && <p>No donation requests found.</p>}

        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-100 text-blue-800">
              <th className="border border-gray-300 px-4 py-2 text-left">Title</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Amount Requested</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Approved</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {ngoRequests.items.map((req) => (
              <tr key={req.id} className="hover:bg-blue-50">
                <td className="border border-gray-300 px-4 py-2">{req.title}</td>
                <td className="border border-gray-300 px-4 py-2">{req.category?.name || 'N/A'}</td>
                <td className="border border-gray-300 px-4 py-2">${req.amount_requested.toFixed(2)}</td>
                <td className="border border-gray-300 px-4 py-2">{req.is_approved ? 'Yes' : 'No'}</td>
                <td className="border border-gray-300 px-4 py-2">{formatDate(req.created_at)}</td>
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

export default NGORequestsHistory;
