import React, { useEffect, useState, useCallback } from 'react';
import api from '../../../lib/api'; 
import { toast } from 'react-toastify'; 

const ActionLogViewer = () => {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    
    const fetchLogs = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            
            const response = await api.get('/superadmin/logs');
            setLogs(response.data);
        } catch (err) {
            console.error('Failed to fetch action logs:', err);
            setError(err.message || 'Failed to load action logs');
            toast.error(`Error fetching logs: ${err.response?.data?.error || err.message || 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    
    const formatTimestamp = (isoString) => {
        if (!isoString) return 'N/A';
        const date = new Date(isoString);
        return date.toLocaleString(); 
    };

    
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                <p className="ml-4 text-lg text-gray-700">Loading action logs...</p>
            </div>
        );
    }

    
    if (error) {
        return (
            <div className="p-6 bg-red-100 text-red-700 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-2">Error Loading Action Logs</h2>
                <p>{error}</p>
                <button
                    onClick={fetchLogs}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md font-sans">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Action Log</h1>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Admin Actions</h2>

                {logs.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">No admin actions logged yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b">Log ID</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b">Actor (Admin)</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b">Action</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b">Target User</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map(log => (
                                    <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm text-gray-700">{log.id}</td>
                                        <td className="py-3 px-4 text-sm text-gray-700">{log.actor_name || log.actor_id}</td>
                                        <td className="py-3 px-4 text-sm text-gray-700">{log.action}</td>
                                        <td className="py-3 px-4 text-sm text-gray-700">{log.target_name || log.target_user_id || 'N/A'}</td>
                                        <td className="py-3 px-4 text-sm text-gray-700">{formatTimestamp(log.timestamp)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActionLogViewer;
