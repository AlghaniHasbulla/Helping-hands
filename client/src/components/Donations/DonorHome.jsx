import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApprovedRequests } from '../../store/donationsSlice';
import { formatDate } from '../../lib/utils';

const categories = [
  { id: '', name: 'All' },
  { id: '1', name: 'Food' },
  { id: '2', name: 'Clothing' },
  { id: '3', name: 'Education' },
  { id: '4', name: 'Medical' },
];

const DonorHome = () => {
  const dispatch = useDispatch();
  const approvedRequests = useSelector(state => state.donations.approvedRequests) || { items: [], total: 0 };
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const limit = 10;

  useEffect(() => {
    dispatch(fetchApprovedRequests({ page, limit }));
  }, [dispatch, page]);

  // Filter requests by category client-side
  const filteredRequests = selectedCategory
    ? (approvedRequests.items || []).filter(req => req.category_id.toString() === selectedCategory)
    : (approvedRequests.items || []);

  const totalPages = Math.ceil((approvedRequests.total || 0) / limit);

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-semibold text-blue-800 mb-6">Donation Requests</h2>

        <div className="mb-4">
          <label htmlFor="categoryFilter" className="block mb-1 text-sm font-medium text-blue-800">Filter by Category</label>
          <select
            id="categoryFilter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-48 px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {approvedRequests.loading && <p>Loading...</p>}
        {approvedRequests.error && <p className="text-red-600">{approvedRequests.error}</p>}
        {!approvedRequests.loading && filteredRequests.length === 0 && <p>No donation requests found.</p>}

        <ul className="space-y-4">
          {filteredRequests.map(req => (
            <li key={req.id} className="border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-blue-900">{req.title}</h3>
              <p className="text-blue-700 mb-1">{req.description}</p>
              <p className="text-blue-800 font-medium">Category: {req.category?.name || 'N/A'}</p>
              <p className="text-blue-800 font-medium">Amount Requested: ${req.amount_requested.toFixed(2)}</p>
              <p className="text-blue-800 font-medium">Amount Raised: ${req.amount_raised ? req.amount_raised.toFixed(2) : '0.00'}</p>
              <p className="text-blue-600 text-sm">Created: {formatDate(req.created_at)}</p>
            </li>
          ))}
        </ul>

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center space-x-2">
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

export default DonorHome;
