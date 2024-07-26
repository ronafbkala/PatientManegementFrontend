/*
import React, { useState } from 'react';
import { evaluateUserToRole, getUserById } from '../api';
import '../styles.css';

const EvaluateRole = () => {
    const [userId, setUserId] = useState('');
    const [user, setUser] = useState(null);
    const [environmentAttributes, setEnvironmentAttributes] = useState({
        location: '',
        time: '',
    });
    const [role, setRole] = useState(null);
    const [error, setError] = useState(null);

    const handleAttributeChange = (event) => {
        const { name, value } = event.target;
        setEnvironmentAttributes({
            ...environmentAttributes,
            [name]: value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        getUserById(userId)
            .then(response => {
                setUser(response.data);
                evaluateUserToRole(userId, environmentAttributes)
                    .then(response => {
                        setRole(response.data);
                        setError(null);
                    })
                    .catch(error => {
                        console.error('Error evaluating role:', error);
                        setError('No matching role found');
                        setRole(null);
                    });
            })
            .catch(error => {
                console.error('Error fetching user:', error);
                setError('User not found');
                setUser(null);
                setRole(null);
            });
    };

    return (
        <>
            <div className="overlay"></div>
            <div className="container">
                <h1>Evaluate User to Role</h1>
                <form onSubmit={handleSubmit} className="form">
                    <label>
                        User ID:
                        <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} required />
                    </label>
                    <h3>Environment Attributes</h3>
                    <label>
                        Location:
                        <input type="text" name="location" value={environmentAttributes.location} onChange={handleAttributeChange} />
                    </label>
                    <label>
                        Time:
                        <input type="text" name="time" value={environmentAttributes.time} onChange={handleAttributeChange} />
                    </label>
                    <button type="submit" className="btn btn-primary">Evaluate Role</button>
                </form>
                {user && (
                    <div className="card">
                        <div className="card-header">User Information</div>
                        <div className="card-body">
                            <p><strong>Name:</strong> {user.name}</p>
                            <p><strong>Institution:</strong> {user.institution}</p>
                            <p><strong>Position:</strong> {user.position}</p>
                            <p><strong>Rank:</strong> {user.rank}</p>
                        </div>
                    </div>
                )}
                {role && <div className="alert alert-success">Role: {role}</div>}
                {error && <div className="alert alert-danger">{error}</div>}
            </div>
        </>
    );
};

export default EvaluateRole;
*/

import React, { useState } from 'react';
import { evaluateUserToRole, getUserById } from '../api';
import '../styles.css';

const EvaluateRole = () => {
    const [userId, setUserId] = useState('');
    const [user, setUser] = useState(null);
    const [environmentAttributes, setEnvironmentAttributes] = useState({
        location: '',
        time: '',
        deviceType: '',
        ipAddress: ''
    });
    const [role, setRole] = useState(null);
    const [error, setError] = useState(null);

    const handleAttributeChange = (event) => {
        const { name, value } = event.target;
        setEnvironmentAttributes({
            ...environmentAttributes,
            [name]: value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        getUserById(userId)
            .then(response => {
                setUser(response.data);
                evaluateUserToRole(userId, environmentAttributes)
                    .then(response => {
                        setRole(response.data);
                        setError(null);
                    })
                    .catch(error => {
                        console.error('Error evaluating role:', error);
                        setError('No matching role found');
                        setRole(null);
                    });
            })
            .catch(error => {
                console.error('Error fetching user:', error);
                setError('User not found');
                setUser(null);
                setRole(null);
            });
    };

    return (
        <>
            <div className="overlay"></div>
            <div className="container">
                <h1>Evaluate User to Role</h1>
                <form onSubmit={handleSubmit} className="form">
                    <label>
                        User ID:
                        <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} required className="input"/>
                    </label>
                    <h3>Environment Attributes</h3>
                    <label>
                        Location:
                        <input type="text" name="location" value={environmentAttributes.location} onChange={handleAttributeChange} className="input"/>
                    </label>
                    <label>
                        Time:
                        <input type="text" name="time" value={environmentAttributes.time} onChange={handleAttributeChange} className="input"/>
                    </label>
                    <label>
                        Device Type:
                        <input type="text" name="deviceType" value={environmentAttributes.deviceType} onChange={handleAttributeChange} className="input"/>
                    </label>
                    <label>
                        IP Address:
                        <input type="text" name="ipAddress" value={environmentAttributes.ipAddress} onChange={handleAttributeChange} className="input"/>
                    </label>
                    <button type="submit" className="btn btn-primary">Evaluate Role</button>
                </form>
                {user && (
                    <div className="card">
                        <div className="card-header">User Information</div>
                        <div className="card-body">
                            <p><strong>Name:</strong> {user.name}</p>
                            <p><strong>Institution:</strong> {user.institution}</p>
                            <p><strong>Position:</strong> {user.position}</p>
                            <p><strong>Rank:</strong> {user.rank}</p>
                        </div>
                    </div>
                )}
                {role && <div className="alert alert-success">Role: {role}</div>}
                {error && <div className="alert alert-danger">{error}</div>}
            </div>
        </>
    );
};

export default EvaluateRole;
