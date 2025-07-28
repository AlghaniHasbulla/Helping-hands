import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '../../../store/usersSlice'; 

const UserManagerPage = () => {
    const dispatch = useDispatch();
    const { items: users, status } = useSelector((state) => state.users);


    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchAllUsers());
        }
    }, [status, dispatch]);
    
    const formatRole = (role) => {
        if (!role) return 'N/A';
        return role.charAt(0).toUpperCase() + role.slice(1);
    };

    return (
        <div>
            <h1 className="admin-h1">User Management</h1>
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2>All System Users</h2>
                    <button className="btn btn-primary">Add New User</button>
                </div>
                
                {status === 'loading' && <p>Loading users...</p>}
                {status === 'failed' && <p style={{ color: 'var(--error)'}}>Failed to load users.</p>}

                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Verified</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.full_name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`role-badge role-${user.role}`}>
                                        {formatRole(user.role)}
                                    </span>
                                </td>
                                <td>{user.is_verified ? '✔️ Yes' : '❌ No'}</td>
                                <td>
                                    <span style={{ color: user.is_active ? 'var(--success)' : 'var(--error)' }}>
                                        {user.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn btn-secondary">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {status === 'succeeded' && users.length === 0 && <p style={{ textAlign: 'center', padding: '2rem' }}>No users found.</p>}
            </div>
        </div>
    );
};

export default UserManagerPage;