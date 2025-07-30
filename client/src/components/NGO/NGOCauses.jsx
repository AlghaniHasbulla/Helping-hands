import React, { useState, useEffect } from 'react';
import api from '../../lib/api';

const NGOCauses = () => {
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDonorsFor, setShowDonorsFor] = useState(null);
  const [donors, setDonors] = useState([]);
  const [donorsLoading, setDonorsLoading] = useState(false);
  const [donorsError, setDonorsError] = useState(null);

  const fetchCauses = () => {
    setLoading(true);
    api.get('/ngo/my-requests')
      .then(res => {
        setCauses(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load causes');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCauses();
  }, []);

  const fetchDonors = (causeId) => {
    setDonorsLoading(true);
    setDonorsError(null);
    api.get('/ngo/donations-received')
      .then(res => {
        // Filter donations for the selected cause
        const filteredDonors = res.data.filter(donation => donation.donation_request_id === causeId);
        setDonors(filteredDonors);
        setDonorsLoading(false);
      })
      .catch(err => {
        setDonorsError(err.message || 'Failed to load donors');
        setDonorsLoading(false);
      });
  };

  const handleViewDonors = (causeId) => {
    setShowDonorsFor(causeId);
    fetchDonors(causeId);
  };

  const handleCloseDonors = () => {
    setShowDonorsFor(null);
    setDonors([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-blue-800 mb-4">Your Causes</h2>

      <button
        onClick={() => window.location.href = '/donation-request'}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Create Donation Request
      </button>

      {loading && <p>Loading causes...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && causes.length === 0 && <p>You have not created any causes yet.</p>}

      {!loading && !error && causes.length > 0 && (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-100 text-blue-800">
              <th className="border border-gray-300 px-4 py-2 text-left">Title</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Amount Requested</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Approved</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {causes.filter(cause => cause.is_approved).map(cause => (
              <tr key={cause.id} className="hover:bg-blue-50">
                <td className="border border-gray-300 px-4 py-2">{cause.title}</td>
                <td className="border border-gray-300 px-4 py-2">{cause.category?.name || 'N/A'}</td>
                <td className="border border-gray-300 px-4 py-2">${cause.amount_requested.toFixed(2)}</td>
                <td className="border border-gray-300 px-4 py-2">{cause.is_approved ? 'Yes' : 'No'}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleViewDonors(cause.id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    View Cause
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showDonorsFor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full relative">
            <h3 className="text-xl font-semibold mb-4">Donors for Cause</h3>
            <button
              onClick={handleCloseDonors}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              &times;
            </button>

            {donorsLoading && <p>Loading donors...</p>}
            {donorsError && <p className="text-red-600">{donorsError}</p>}
            {!donorsLoading && !donorsError && donors.length === 0 && <p>No donors found for this cause.</p>}

            {!donorsLoading && !donorsError && donors.length > 0 && (
              <table className="w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-blue-100 text-blue-800">
                    <th className="border border-gray-300 px-4 py-2 text-left">Donor Username</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {donors.map(donor => (
                    <tr key={donor.id} className="hover:bg-blue-50">
                      <td className="border border-gray-300 px-4 py-2">{donor.donor_username}</td>
                      <td className="border border-gray-300 px-4 py-2">${donor.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NGOCauses;
