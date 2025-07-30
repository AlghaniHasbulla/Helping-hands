import React, { useEffect, useState, useCallback } from 'react';
import api from '../../../lib/api';
import StatCard from '../UI/StatCard'; 


import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'react-toastify'; 

const DashboardPage = () => {
    const [categories, setCategories] = useState([]);
    const [donationRequests, setDonationRequests] = useState([]); // Will only contain APPROVED requests from backend
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [categoriesRes, requestsRes] = await Promise.all([
                api.get('/admin/categories'),
                
                api.get('/requests')
            ]);
            setCategories(categoriesRes.data);
          
            setDonationRequests(requestsRes.data.items || requestsRes.data);
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
            setError(err.message || 'Failed to load dashboard data');
            toast.error(`Error loading dashboard: ${err.message || 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    
    const totalCategories = categories.length;
    
    const pendingRequests = donationRequests.filter(req => req.status === 'Pending').length;
    const totalRaised = donationRequests
        .reduce((sum, req) => sum + req.amount, 0);

    
    const chartData = Object.values(
        donationRequests.reduce((acc, request) => {
            
            const categoryName = request.category?.name || 'N/A';
            if (!acc[categoryName]) {
                acc[categoryName] = { name: categoryName, Raised: 0, Requests: 0 };
            }
            
            acc[categoryName].Raised += request.amount;
            acc[categoryName].Requests += 1;
            return acc;
        }, {})
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                <p className="ml-4 text-lg text-gray-700">Loading dashboard data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-100 text-red-700 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-2">Error Loading Dashboard</h2>
                <p>{error}</p>
                <button
                    onClick={fetchData}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen font-sans">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, Admin!</h1>
            <p className="text-gray-600 mb-6">
                Here's a summary of the platform's activity.
            </p>

            
            <div className="flex flex-wrap gap-6 mb-8 justify-center">
                <StatCard title="Total Categories" value={totalCategories} icon="🏷️" color="#3b82f6" />
               
                <StatCard title="Pending Requests" value={pendingRequests} icon="⏳" color="#f97316" />
                <StatCard title="Total Raised" value={`$${totalRaised.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon="💰" color="#22c55e" />
                {/* Placeholder for Total Users and Active NGOs as backend endpoints were not provided */}
                <StatCard title="Total Users" value="1,284" icon="👥" color="#8b5cf6" />
                <StatCard title="Active NGOs" value="78" icon="🏢" color="#6366f1" />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Donations by Category (Approved Only)</h2>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
                            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" tickLine={false} axisLine={false} />
                            <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                            <Legend wrapperStyle={{ paddingTop: '10px' }} />
                            <Bar yAxisId="left" dataKey="Raised" fill="#8884d8" name="Amount Raised ($)" barSize={40} radius={[10, 10, 0, 0]}/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;