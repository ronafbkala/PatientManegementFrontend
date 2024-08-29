import React from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';

const Home = ({ userRole }) => {
    return (
        <div className="container">
            <h1 className="heading">Patient Management System</h1>
            <nav>
                <div className="card">
                    <div className="card-header">Main Links</div>
                    <div className="card-body">
                        <ul>
                            <li>
                                <Link to="/patients" className="nav-link">
                                    Go To Patients And Medical Records
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Conditionally render the following links based on the userRole */}
                {userRole === 'DataOwner' && (
                    <div className="card">
                        <div className="card-header">Data Owner Links</div>
                        <div className="card-body">
                            <ul>
                                <li>
                                    <Link to="/policies" className="nav-link">
                                        Policy Management
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/evaluate-role" className="nav-link">
                                        Evaluate Role
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/evaluate-permission" className="nav-link">
                                        Evaluate Permission
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/users" className="nav-link">
                                        User Management
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/roles" className="nav-link">
                                        Roles
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </nav>
        </div>
    );
};

export default Home;
