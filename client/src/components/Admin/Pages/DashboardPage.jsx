import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import StatCard from '../UI/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import api from '../../../lib/api';

// Mock data for the chart. data is supposed to come from an API.
const chartData = [
  { name: 'Education', Raised: 40000, Requests: 24 },
  { name: 'Healthcare', Raised: 30000, Requests: 13 },
  { name: 'Environment', Raised: 20000, Requests: 8 },
  { name: 'Animals', Raised: 27800, Requests: 18 },
  { name: 'Community', Raised: 18900, Requests: 11 },
];

const DashboardPage = () => {
    // Get the logged-in user's name from the auth slice
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [causes, setCauses] = useState([]);
    const [donations, setDonations] = useState([]);
    const [loadingCauses, setLoadingCauses] = useState(false);
    const [loadingDonations, setLoadingDonations] = useState(false);
    const [errorCauses, setErrorCauses] = useState(null);
    const [errorDonations, setErrorDonations] = useState(null);

    useEffect(() => {
        if (user?.role === 'ngo') {
            setLoadingCauses(true);
            api.get('/ngo/my-requests')
                .then(res => {
                    setCauses(res.data);
                    setLoadingCauses(false);
                })
                .catch(err => {
                    setErrorCauses(err.message || 'Failed to load causes');
                    setLoadingCauses(false);
                });

            setLoadingDonations(true);
            api.get('/ngo/donations-received')
                .then(res => {
                    setDonations(res.data);
                    setLoadingDonations(false);
                })
                .catch(err => {
                    setErrorDonations(err.message || 'Failed to load donations');
                    setLoadingDonations(false);
                });
        }
    }, [user]);

    return (
        <div>
            <h1 className="admin-h1">Welcome, {user?.email || 'Admin'}!</h1>
            <p style={{ marginTop: '-2rem', color: 'var(--text-secondary)', marginBottom: '2rem'}}>
                Here's a summary of the platform's activity.
            </p>

            {user?.role === 'ngo' && (
              <div className="mb-6">
                <button
                  onClick={() => navigate('/donation-request')}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Create Donation Request
                </button>
              </div>
            )}

            {user?.role === 'ngo' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Your Causes</h2>
                {loadingCauses && <p>Loading causes...</p>}
                {errorCauses && <p className="text-red-600">{errorCauses}</p>}
                {!loadingCauses && !errorCauses && causes.length === 0 && <p>No causes found.</p>}
                {!loadingCauses && !errorCauses && causes.length > 0 && (
                  <table className="w-full table-auto border-collapse border border-gray-300 mb-8">
                    <thead>
                      <tr className="bg-blue-100 text-blue-800">
                        <th className="border border-gray-300 px-4 py-2 text-left">Title</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Amount Requested</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Approved</th>
                      </tr>
                    </thead>
                    <tbody>
                      {causes.map(cause => (
                        <tr key={cause.id} className="hover:bg-blue-50">
                          <td className="border border-gray-300 px-4 py-2">{cause.title}</td>
                          <td className="border border-gray-300 px-4 py-2">{cause.category?.name || 'N/A'}</td>
                          <td className="border border-gray-300 px-4 py-2">${cause.amount_requested.toFixed(2)}</td>
                          <td className="border border-gray-300 px-4 py-2">{cause.is_approved ? 'Yes' : 'No'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                <h2 className="text-xl font-semibold mb-4">Donations to Your Causes</h2>
                {loadingDonations && <p>Loading donations...</p>}
                {errorDonations && <p className="text-red-600">{errorDonations}</p>}
                {!loadingDonations && !errorDonations && donations.length === 0 && <p>No donations found.</p>}
                {!loadingDonations && !errorDonations && donations.length > 0 && (
                  <table className="w-full table-auto border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-blue-100 text-blue-800">
                        <th className="border border-gray-300 px-4 py-2 text-left">Donor Username</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Amount</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Donation Request</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donations.map(donation => (
                        <tr key={donation.id} className="hover:bg-blue-50">
                          <td className="border border-gray-300 px-4 py-2">{donation.donor_username}</td>
                          <td className="border border-gray-300 px-4 py-2">${donation.amount.toFixed(2)}</td>
                          <td className="border border-gray-300 px-4 py-2">{donation.donation_request?.title || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* --- Stat Cards Section --- */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                <StatCard title="Total Users" value="1,284" icon="👥" color="#3b82f6" />
                <StatCard title="Pending Requests" value="12" icon="⏳" color="#f97316" />
                <StatCard title="Total Raised" value="$1.2M" icon="💰" color="#22c55e" />
                <StatCard title="Active NGOs" value="78" icon="🏢" color="#8b5cf6" />
            </div>

            {/* --- Chart Section --- */}
            <div className="card">
                <h2>Donations by Category</h2>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                            <Tooltip />
                            <Legend />
                            <Bar yAxisId="left" dataKey="Raised" fill="#8884d8" name="Amount Raised ($)"/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
