import React from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';

const Header = ({ username, onLogout  }) => {
    return (
        <header className="header">
            <div className="header-right">
                <Link to="/" className="nav-link">Health System</Link>
            </div>
            <div className="header-left">
                Welcome, {username}!
                <button className="logout-button" onClick={onLogout}>
                    Log Out
                </button>
            </div>
        </header>
    );
};

export default Header;
