import React from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';

const Home = ({ userRole }) => {
    return (
        <div>
            <h1 className="heading">Patient Management System</h1>
            <nav>
                <ul>
                    <li><Link to="/patients" className="nav-link">Go To Patients And Medical Records</Link></li>

                    {/* Conditionally render the following links based on the userRole */}
                    {userRole === 'DataOwner' && (
                        <>
                            <li><Link to="/policies" className="nav-link">Policy Management</Link></li>
                            <li><Link to="/evaluate-role" className="nav-link">Evaluate Role</Link></li>
                            <li><Link to="/evaluate-permission" className="nav-link">Evaluate Permission</Link></li>
                            <li><Link to="/users" className="nav-link">User Management</Link></li>
                            <li><Link to="/roles" className="nav-link">Roles</Link></li>
                        </>
                    )}
                </ul>
            </nav>
        </div>
    );
};

export default Home;
