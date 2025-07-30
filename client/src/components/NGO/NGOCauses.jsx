import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Search, Star } from 'lucide-react';

const NGOCauses = () => {
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDonorsFor, setShowDonorsFor] = useState(null);
  const [donors, setDonors] = useState([]);
  const [donorsLoading, setDonorsLoading] = useState(false);
  const [donorsError, setDonorsError] = useState(null);

  useEffect(() => {
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
  }, []);

  const fetchDonors = (causeId) => {
    setDonorsLoading(true);
    setDonorsError(null);
    api.get('/ngo/donations-received')
      .then(res => {
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
    <div className="bg-blue-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Manage Your Causes</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 opacity-90">
            Create and manage your donation requests, and view donors who support your causes.
          </p>
          <button
            onClick={() => window.location.href = '/donation-request'}
            className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-full hover:bg-blue-100 transition-colors"
          >
            Create Donation Request
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading && <p>Loading your causes...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && causes.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-blue-300 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-blue-900 mb-2">No causes created yet</h3>
            <p className="text-blue-700 max-w-md mx-auto">
              You have not created any causes yet. Click the button above to create your first donation request.
            </p>
          </div>
        )}

        {!loading && !error && causes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {causes.filter(cause => cause.is_approved).map(cause => (
              <div 
                key={cause.id} 
                className="bg-white rounded-xl shadow-sm overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-bold text-blue-900">{cause.title}</h3>
                    {cause.featured && (
                      <div className="bg-yellow-400 text-blue-900 px-3 py-1 rounded-lg text-xs font-bold flex items-center">
                        <Star className="h-4 w-4 mr-1" fill="currentColor" /> FEATURED
                      </div>
                    )}
                  </div>
                  <p className="text-blue-700 mb-4 line-clamp-3">{cause.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-blue-900 font-medium">
                      Amount Requested: ${cause.amount_requested.toFixed(2)}
                    </div>
                    <div className="text-blue-900 font-medium">
                      Approved: {cause.is_approved ? 'Yes' : 'No'}
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewDonors(cause.id)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Cause
                  </button>
                </div>
              </div>
            ))}
          </div>
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
    </div>
  );
};

export default NGOCauses;
