import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNGORequests } from '../../store/donationsSlice';
import { formatDate } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

const EmptyState = ({ onCreate }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center text-blue-700">
    <svg
      className="w-24 h-24 mb-4 mx-auto text-blue-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h5l5 5v9a2 2 0 01-2 2z"
      ></path>
    </svg>
    <h3 className="mb-2 text-xl font-semibold">No Donation Requests Found</h3>
    <p className="mb-6 text-blue-600 max-w-xs">
      You haven't created any donation requests yet. Start by creating a new request to help your cause.
    </p>
    <button
      onClick={onCreate}
      className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
    >
      Create Donation Request
    </button>
  </div>
);

const NGORequestsHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ngoRequests } = useSelector(state => state.donations);
  const [page, setPage] = useState(1);
  const limit = 10;

  const ngoId = useSelector(state => state.auth.user?.id);

  useEffect(() => {
    dispatch(fetchNGORequests({ page, limit }));
  }, [dispatch, page]);

  const totalPages = Math.ceil(ngoRequests.total / limit);

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-blue-800">Your Donation Requests</h2>
          <button
            onClick={() => navigate('/donation-request')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Create Donation Request
          </button>
        </div>
        {ngoRequests.loading && <p>Loading...</p>}
        {ngoRequests.error && <p className="text-red-600">{ngoRequests.error}</p>}
        {!ngoRequests.loading && ngoRequests.items.length === 0 && (
          <EmptyState onCreate={() => navigate('/donation-request')} />
        )}

        {ngoRequests.items.length > 0 && (
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
        )}

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
