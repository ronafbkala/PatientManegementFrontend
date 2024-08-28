
import React from 'react';
import { Link } from 'react-router-dom';

const StaffDashboard = ({ userRole }) => {
    return (
        <div>
            <h1 className="heading">Staff Dashboard</h1>
            <nav>
                <ul>
                    <li><Link to="/staff/patients" className="nav-link">View Patients</Link></li>
                </ul>
            </nav>
        </div>
    );
};

export default StaffDashboard;
