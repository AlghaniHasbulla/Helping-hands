import React from 'react';
import './StatCard.css';

const StatCard = ({ title, value, icon, color = '#3b82f6' }) => {
    return (
        <div className="stat-card">
            <div className="stat-card-icon" style={{ backgroundColor: color }}>
                {icon}
            </div>
            <div className="stat-card-info">
                <span className="stat-card-title">{title}</span>
                <span className="stat-card-value">{value}</span>
            </div>
        </div>
    );
};

export default StatCard;