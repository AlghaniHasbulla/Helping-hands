import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../lib/api';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setApprovalChangeFlag } from '../../../store/donationsSlice';

const AdminCausesPage = () => {
  const dispatch = useDispatch();
  const [donationRequests, setDonationRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUnapprovedRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch all donation requests with is_approved = false
      const response = await api.get('/requests', {
        params: {
          is_approved: false,
          page: 1,
          limit: 100, // adjust as needed
        },
      });
      // Filter unapproved requests from response
      const items = response.data.items || response.data;
      const unapproved = items.filter(req => req.is_approved === false);
      setDonationRequests(unapproved);
    } catch (err) {
      console.error('Failed to fetch unapproved donation requests:', err);
      setError(err.message || 'Failed to load donation requests');
      toast.error(`Error fetching requests: ${err.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnapprovedRequests();
  }, [fetchUnapprovedRequests]);

  const handleApproveRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to approve this request?')) {
      setIsLoading(true);
      try {
        await api.patch(`/requests/${requestId}`, { is_approved: true });
        toast.success(`Request #${requestId} approved successfully!`);
        fetchUnapprovedRequests();
        dispatch(setApprovalChangeFlag()); // Notify approval change
      } catch (e) {
        console.error("Error approving request: ", e);
        toast.error(`Failed to approve request #${requestId}: ${e.response?.data?.error || e.message || 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRejectRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to reject this request?')) {
      setIsLoading(true);
      try {
        await api.patch(`/requests/${requestId}`, { is_approved: false });
        toast.info(`Request #${requestId} has been rejected.`);
        fetchUnapprovedRequests();
      } catch (e) {
        console.error("Error rejecting request: ", e);
        toast.error(`Failed to reject request #${requestId}: ${e.response?.data?.error || e.message || 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="ml-4 text-lg text-gray-700">Loading donation requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-100 text-red-700 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-2">Error Loading Requests</h2>
        <p>{error}</p>
        <button
          onClick={fetchUnapprovedRequests}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Causes - Unapproved Donation Requests</h1>

      {donationRequests.length === 0 ? (
        <p className="text-gray-600 text-center py-8">No unapproved donation requests to display.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b">ID</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b">Title</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b">NGO Name</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b">Category</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b">Amount</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b">Status</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {donationRequests.map(req => (
                <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-700">{String(req.id).substring(0, 8)}...</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{req.title}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{req.ngoName || 'N/A'}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{req.category?.name || 'N/A'}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {typeof req.amount === 'number' ? `$${req.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApproveRequest(req.id)}
                        className="px-3 py-1 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectRequest(req.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCausesPage;
