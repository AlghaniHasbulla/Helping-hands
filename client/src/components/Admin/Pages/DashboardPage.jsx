import React from 'react';
import { useSelector } from 'react-redux';
import StatCard from '../UI/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

    return (
        <div>
            <h1 className="admin-h1">Welcome, {user?.email || 'Admin'}!</h1>
            <p style={{ marginTop: '-2rem', color: 'var(--text-secondary)', marginBottom: '2rem'}}>
                Here's a summary of the platform's activity.
            </p>

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