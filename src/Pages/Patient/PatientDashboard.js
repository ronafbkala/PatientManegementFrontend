import React from 'react';
import { Link } from 'react-router-dom';

const PatientDashboard = ({ patientId }) => {
    return (
        <div>
            <h1 className="heading">My Dashboard</h1>
            <nav>
                <ul>
                    <li><Link to={`/patient/details`} className="nav-link">View My Details</Link></li>
                    <li><Link to={`/patient/edit/${patientId}`} className="nav-link">Edit My Information</Link></li>
                </ul>
            </nav>
        </div>
    );
};

export default PatientDashboard;
