import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPendingRequests } from '../../../store/requestsSlice';

const RequestQueuePage = () => {
    const dispatch = useDispatch();
    const { items: requests, status } = useSelector((state) => state.requests);

    useEffect(() => {
        dispatch(fetchPendingRequests());
    }, [dispatch]);

    return (
        <div>
            <h1 className="admin-h1">Approve Donation Requests</h1>
            <div className="card">
                {status === 'loading' && <p>Loading...</p>}
                <table>
                    <thead>
                        <tr><th>ID</th><th>Title</th><th>NGO</th><th>Target</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {requests.map(req => (
                            <tr key={req.id}>
                                <td>{req.id}</td><td>{req.title}</td><td>{req.ngo?.full_name || 'N/A'}</td><td>${req.target_amount}</td>
                                <td>{/* Buttons will go here */}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {status === 'succeeded' && requests.length === 0 && <p>No pending requests.</p>}
            </div>
        </div>
    );
};
export default RequestQueuePage;