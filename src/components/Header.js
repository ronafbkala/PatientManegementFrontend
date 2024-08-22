import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles.css';

const Header = ({ username, onLogout }) => {
    const navigate = useNavigate(); // Initialize the navigate function

    const handleLogout = () => {
        onLogout(); // Call the passed onLogout function
        navigate('/logindb'); // Navigate to the login page
    };

    return (
        <header className="header">
            <div className="header-right">
                <Link to="/" className="nav-link">Health System</Link>
            </div>
            <div className="header-left">
                Welcome, {username}!
                <button className="logout-button" onClick={handleLogout}>
                    Log Out
                </button>
            </div>
        </header>
    );
};

export default Header;
