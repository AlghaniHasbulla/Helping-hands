import { useSelector, useDispatch } from 'react-redux';
import { fetchApprovedRequests, resetApprovalChangeFlag, makeDonation } from '../../store/donationsSlice';
import { useEffect, useState } from 'react';
import { formatDate } from '../../lib/utils';


const categories = [
  { id: '', name: 'All' },
  { id: '1', name: 'Food' },
  { id: '2', name: 'Clothing' },
  { id: '3', name: 'Education' },
  { id: '4', name: 'Medical' },
];

const DonorCausesPage = () => {
  const dispatch = useDispatch();
  const approvedRequests = useSelector(state => state.donations.approvedRequests) || { items: [], total: 0 };
  const approvalChangeFlag = useSelector(state => state.donations.approvalChangeFlag);
  const makeDonationStatus = useSelector(state => state.donations.makeDonationStatus);
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [donationAmount, setDonationAmount] = useState('');
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [showDonationForm, setShowDonationForm] = useState(false);
  const limit = 10;

  useEffect(() => {
    dispatch(fetchApprovedRequests({ page, limit }));
  }, [dispatch, page]);

  useEffect(() => {
    if (approvalChangeFlag) {
      console.log('approvalChangeFlag detected, refetching approved requests...');
      dispatch(fetchApprovedRequests({ page, limit }));
      dispatch(resetApprovalChangeFlag());
    }
  }, [approvalChangeFlag, dispatch, page, limit]);

  // Filter requests by category client-side
  const filteredRequests = selectedCategory
    ? (approvedRequests.items || []).filter(req => req.category_id.toString() === selectedCategory)
    : (approvedRequests.items || []);

  const totalPages = Math.ceil((approvedRequests.total || 0) / limit);

  const openDonationForm = (requestId) => {
    setSelectedRequestId(requestId);
    setDonationAmount('');
    setShowDonationForm(true);
  };

  const closeDonationForm = () => {
    setSelectedRequestId(null);
    setDonationAmount('');
    setShowDonationForm(false);
  };

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    if (!donationAmount || isNaN(donationAmount) || Number(donationAmount) <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }
    try {
      await dispatch(makeDonation({ donation_request_id: selectedRequestId, amount: Number(donationAmount) })).unwrap();
      alert('Donation successful!');
      closeDonationForm();
    } catch (error) {
      alert(`Donation failed: ${error.message || 'Unknown error'}`);
    }
  };

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
        {approvedRequests.error && (
          <p className="text-red-600">
            {typeof approvedRequests.error === 'string'
              ? approvedRequests.error
              : approvedRequests.error.msg || JSON.stringify(approvedRequests.error)}
          </p>
        )}
        {!approvedRequests.loading && filteredRequests.length === 0 && <p>No donation requests found.</p>}

        <ul className="space-y-4">
          {filteredRequests.map(req => (
            <li key={req.id} className="border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-blue-900">{req.title}</h3>
              <p className="text-blue-700 mb-1">{req.description}</p>
              <p className="text-blue-800 font-medium">Category: {req.category?.name || 'N/A'}</p>
              <p className="text-blue-800 font-medium">Amount Requested: ${req.amount_requested.toFixed(2)}</p>
              <p className="text-blue-600 text-sm">Created: {formatDate(req.created_at)}</p>
              <button
                onClick={() => openDonationForm(req.id)}
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-300"
              >
                Donate
              </button>
            </li>
          ))}
        </ul>

        {showDonationForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Make a Donation</h3>
              <form onSubmit={handleDonationSubmit}>
                <div className="mb-4">
                  <label htmlFor="donationAmount" className="block mb-1 font-medium">Amount</label>
                  <input
                    type="number"
                    id="donationAmount"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    min="0.01"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={closeDonationForm}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={makeDonationStatus.loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {makeDonationStatus.loading ? 'Donating...' : 'Donate'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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

export default DonorCausesPage;
