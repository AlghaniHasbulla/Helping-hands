import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActionLogs } from '../../../store/logsSlice'; // Ensure this thunk is created in logsSlice.js

const ActionLogViewer = () => {
    const dispatch = useDispatch();
    const { items: logs, status } = useSelector((state) => state.logs);

    // Fetch the action logs when the component mounts
    useEffect(() => {
        // Only fetch if the data isn't already loaded or loading
        if (status === 'idle') {
            dispatch(fetchActionLogs());
        }
    }, [status, dispatch]);

    // Helper to format the timestamp for better readability
    const formatTimestamp = (isoString) => {
        if (!isoString) return 'N/A';
        return new Date(isoString).toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    };

    return (
        <div>
            <h1 className="admin-h1">Administrator Action Logs</h1>
            <div className="card">
                <h2>Audit Trail</h2>
                <p style={{ marginTop: '-1rem', color: 'var(--text-secondary)'}}>
                    A record of all significant actions performed by administrators.
                </p>

                {status === 'loading' && <p>Loading logs...</p>}
                {status === 'failed' && <p style={{ color: 'var(--error)'}}>Failed to load action logs.</p>}
                
                <table>
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Actor</th>
                            <th>Action</th>
                            <th>Target User</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map(log => (
                            <tr key={log.id}>
                                <td>{formatTimestamp(log.timestamp)}</td>
                                <td>
                                    {log.actor_name || 'N/A'}
                                    <span style={{ color: 'var(--text-secondary)'}}> (ID: {log.actor_id})</span>
                                </td>
                                <td style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{log.action}</td>
                                <td>
                                    {log.target_name || 'N/A'}
                                    {log.target_user_id && <span style={{ color: 'var(--text-secondary)'}}> (ID: {log.target_user_id})</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {status === 'succeeded' && logs.length === 0 && <p style={{ textAlign: 'center', padding: '2rem' }}>No administrative actions have been logged yet.</p>}
            </div>
        </div>
    );
};

export default ActionLogViewer;