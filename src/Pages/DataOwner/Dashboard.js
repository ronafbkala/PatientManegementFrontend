import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles.css';

const Dashboard = () => {
    return (
        <div>
            <h1 className="heading">DataOwner Dashboard</h1>
            <nav>
                <ul>
                    <li><Link to="/dataowner/patient" className="nav-link">Go To Patients And Medical Records</Link></li>
                    <li><Link to="/dataowner/policy" className="nav-link">Policy Management</Link></li>
                    <li><Link to="/evaluate-role" className="nav-link">Evaluate Role</Link></li>
                    <li><Link to="/evaluate-permission" className="nav-link">Evaluate Permission</Link></li>
                    <li><Link to="/dataowner/user" className="nav-link">User Management</Link></li>
                    <li><Link to="/dataowner/role" className="nav-link">Roles</Link></li>
                </ul>
            </nav>
        </div>
    );
};

export default Dashboard;
