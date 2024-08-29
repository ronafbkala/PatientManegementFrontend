import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles.css';

const Dashboard = () => {
    return (
        <div className="container">
            <h1 className="heading">DataOwner Dashboard</h1>
            <nav>
                <div className="card">
                    <div className="card-header">Patient Management</div>
                    <div className="card-body">
                        <ul>
                            <li>
                                <Link to="/dataowner/patient" className="nav-link">
                                    Go To Patients And Medical Records
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">Policy Management</div>
                    <div className="card-body">
                        <ul>
                            <li>
                                <Link to="/dataowner/policy" className="nav-link">
                                    Policy Management
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">Role Evaluation</div>
                    <div className="card-body">
                        <ul>
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
                        </ul>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">User & Role Management</div>
                    <div className="card-body">
                        <ul>
                            <li>
                                <Link to="/dataowner/user" className="nav-link">
                                    User Management
                                </Link>
                            </li>
                            <li>
                                <Link to="/dataowner/role" className="nav-link">
                                    Roles
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Dashboard;
