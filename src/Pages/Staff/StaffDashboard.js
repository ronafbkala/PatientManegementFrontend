import React from 'react';
import { Link } from 'react-router-dom';

const PatientDashboard = ({ patientId }) => {
    return (
        <div className="container">
            <h1 className="heading">My Dashboard</h1>
            <nav>
                <div className="card">
                    <div className="card-header">My Information</div>
                    <div className="card-body">
                        <ul>
                            <li>
                                <Link to={`/patient/details`} className="nav-link">
                                    View My Details
                                </Link>
                            </li>
                            <li>
                                <Link to={`/patient/edit/${patientId}`} className="nav-link">
                                    Edit My Information
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default PatientDashboard;
