import React, { useEffect, useState, useCallback } from 'react';
import api from '../../../lib/api'; 
import { toast } from 'react-toastify'; 

const UserManagerPage = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    
    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            
            const response = await api.get('/superadmin/users');
            setUsers(response.data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
            setError(err.message || 'Failed to load users');
            toast.error(`Error fetching users: ${err.response?.data?.error || err.message || 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const formatRole = (role) => {
        if (!role) return 'N/A';
        return role.charAt(0).toUpperCase() + role.slice(1);
    };

    
    const handleAddUser = () => {
        toast.info("Add New User functionality to be implemented (e.g., a modal form).");
        
    };

    
    const handleEditUser = (userId) => {
        toast.info(`Edit User functionality for ID: ${userId} to be implemented (e.g., a modal form).`);
    
    };

    
    const handleDeleteUser = async (userId) => {
        if (window.confirm(`Are you sure you want to delete user ID: ${userId}? This action cannot be undone.`)) {
            setIsLoading(true); 
            try {
                
                await api.delete(`/superadmin/users/${userId}`);
                toast.success(`User ID: ${userId} deleted successfully!`);
                fetchUsers(); 
            } catch (e) {
                console.error("Error deleting user: ", e);
                toast.error(`Failed to delete user ID: ${userId}: ${e.response?.data?.error || e.message || 'Unknown error'}`);
            } finally {
                setIsLoading(false); 
            }
        }
    };


    
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                <p className="ml-4 text-lg text-gray-700">Loading users...</p>
            </div>
        );
    }

    
    if (error) {
        return (
            <div className="p-6 bg-red-100 text-red-700 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-2">Error Loading Users</h2>
                <p>{error}</p>
                <button
                    onClick={fetchUsers}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md font-sans">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">User Management</h1>

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-700">All System Users</h2>
                    <button
                        onClick={handleAddUser}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Add New User
                    </button>
                </div>

                {users.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">No users found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b">ID</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b">Full Name</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b">Email</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b">Role</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b">Verified</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b">Status</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 border-b">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm text-gray-700">{user.id}</td>
                                        <td className="py-3 px-4 text-sm text-gray-700">{user.full_name || 'N/A'}</td>
                                        <td className="py-3 px-4 text-sm text-gray-700">{user.email}</td>
                                        <td className="py-3 px-4 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                user.role === 'ngo' ? 'bg-blue-100 text-blue-800' :
                                                user.role === 'donor' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {formatRole(user.role)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-center">
                                            {user.is_verified ? '✔️ Yes' : '❌ No'}
                                        </td>
                                        <td className="py-3 px-4 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEditUser(user.id)}
                                                    className="px-3 py-1 bg-yellow-500 text-white rounded-md shadow-sm hover:bg-yellow-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="px-3 py-1 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                                >
                                                    Delete
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
        </div>
    );
};

export default UserManagerPage;
