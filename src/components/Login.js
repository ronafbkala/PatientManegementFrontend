/*import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticateUser } from '../api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        // Clear any existing token
        localStorage.removeItem('access_token');



        try {
            const response = await authenticateUser({ email, password });
            console.log('Token received:', response.data.access_token);
            localStorage.setItem('access_token', response.data.access_token);
            navigate('/');
        } catch (err) {
            console.error('Login failed:', err.response ? err.response.data : err.message);
            setError('Invalid email or password. Please try again.');
        }




    };


    return (
        <div className="container">
            <h2>Login</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
---------------------------------------------------


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Keycloak from 'keycloak-js';

const keycloakConfig = {
    url: 'http://localhost:8180',  // Your Keycloak server URL
    realm: 'healthSystem',              // Your Keycloak realm
    clientId: 'healthSystemClient',     // Your Keycloak client ID
};

const Login = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleLogin = () => {
        const keycloak = new Keycloak(keycloakConfig);
        keycloak.init({
            onLoad: 'login-required',  // Changed from 'login-required'
            checkLoginIframe: false
        }).then(authenticated => {
            if (authenticated) {
                localStorage.setItem('access_token', keycloak.token);
                navigate('/');
            } else {
                // If not authenticated, navigate to a login page or show an error
                navigate('/login');  // Adjust this to your login route
            }
        }).catch(error => {
            console.error('Failed to initialize Keycloak:', error);
            setError('Login failed. Please try again.');
        });

    };

    return (
        <div className="container">
            <h2>Login</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <button onClick={handleLogin} className="btn btn-primary">
                Login with Keycloak
            </button>
        </div>
    );
};

export default Login;
*/

import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/'); // Simply navigate to the home route; authentication is handled in App.js
    };

    return (
        <div className="container">
            <h2>Login</h2>
            <button onClick={handleLogin} className="btn btn-primary">
                Proceed to Home
            </button>
        </div>
    );
};

export default Login;



