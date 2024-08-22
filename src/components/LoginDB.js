import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticateUser } from '../api';

const LoginDB = ({ onLogin }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem('access_token');  // Use the correct key here
        console.log('Auth Token:', token);

        if (!token) {
            setError('No access token found, please log in.');
            return;
        }

        const credentials = {
            username: username.trim(),
            password: password.trim(),
        };


        try {
            const response = await authenticateUser(credentials);
            localStorage.setItem('access_token', token);
            onLogin(username);
            navigate('/');
            if(!token) {
                setError('Authentication failed. Please check your credentials and try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Authentication failed. Please check your credentials and try again.');
        }
    };

    return (
        <div className="container">
            <h2>Login</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    );
};

export default LoginDB;

