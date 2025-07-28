import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { 
    fetchPendingRequests, 
    processApproveRequest, 
    processRejectRequest 
} from '../../../store/requestsSlice';

const RequestQueuePage = () => {
    const dispatch = useDispatch();
    const { items: requests, status } = useSelector((state) => state.requests);

    useEffect(() => {
        
        if (status === 'idle') {
            dispatch(fetchPendingRequests());
        }
    }, [status, dispatch]);


    const handleApprove = (id) => {
        dispatch(processApproveRequest(id))
            .unwrap() 
            .then(() => {
                toast.success(`Request #${id} approved successfully!`);
            })
            .catch((error) => {
                toast.error(`Failed to approve request #${id}: ${error.message}`);
            });
    };


    const handleReject = (id) => {
        dispatch(processRejectRequest(id))
            .unwrap()
            .then(() => {
                toast.info(`Request #${id} has been rejected.`);
            })
            .catch((error) => {
                toast.error(`Failed to reject request #${id}: ${error.message}`);
            });
    };

    return (
        <div>
            <h1 className="admin-h1">Approve Donation Requests</h1>
            <div className="card">
                <h2>Pending Requests</h2>
                {status === 'loading' && <p>Loading requests...</p>}
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>NGO</th>
                            <th>Target Amount</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(req => (
                            <tr key={req.id}>
                                <td>{req.id}</td>
                                <td>{req.title}</td>
                                <td>{req.ngo?.full_name || 'N/A'}</td>
                                <td>${req.target_amount.toLocaleString()}</td>
                                <td style={{ textAlign: 'center' }}>
                                
                                    <button 
                                        className="btn btn-primary" 
                                        style={{ backgroundColor: 'var(--success)', marginRight: '8px' }}
                                        onClick={() => handleApprove(req.id)}
                                    >
                                        Approve
                                    </button>
                                    <button 
                                        className="btn btn-secondary" 
                                        style={{ backgroundColor: 'var(--info)' }}
                                        onClick={() => handleReject(req.id)}
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {status === 'succeeded' && requests.length === 0 && <p style={{ textAlign: 'center', padding: '2rem' }}>No pending requests to review.</p>}
            </div>
        </div>
    );
};

export default RequestQueuePage;