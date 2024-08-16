
import React, {useEffect, useState} from 'react';
import { evaluateUserToPermission, getUserById } from '../api';
import '../styles.css';

const EvaluatePermission = () => {
    const [userId, setUserId] = useState('');
    const [user, setUser] = useState(null);
    const [userAttributes, setUserAttributes] = useState({
        name: '',
        institution: '',
        position: '',
        rank: '',
    });
    const [resourceAttributes, setResourceAttributes] = useState({
        resourceType: '',
        resourceOwner: '',
    });
    const [environmentAttributes, setEnvironmentAttributes] = useState({
        location: '',
        time: '',
        deviceType: '',
        ipAddress: ''
    });
    const [permission, setPermission] = useState(null);
    const [error, setError] = useState(null);


    useEffect(() => {
        // Ensure the access token is available and fresh before making API calls
        const token = localStorage.getItem('access_token');
        if (!token) {
            setError('No access token found, please log in.');
        }
    }, []);

    const handleUserAttributeChange = (event) => {
        const { name, value } = event.target;
        setUserAttributes({
            ...userAttributes,
            [name]: value
        });
    };

    const handleResourceAttributeChange = (event) => {
        const { name, value } = event.target;
        setResourceAttributes({
            ...resourceAttributes,
            [name]: value
        });
    };

    const handleEnvironmentAttributeChange = (event) => {
        const { name, value } = event.target;
        setEnvironmentAttributes({
            ...environmentAttributes,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault()

        // Retrieve the token from local storage
        const token = localStorage.getItem('access_token');  // Use the correct key here
        console.log('Auth Token:', token);

        if (!token) {
            setError('No access token found, please log in.');
            return;
        }
        const request = {
            userAttributes,
            resourceAttributes,
            environmentAttributes
        };
        // Log the request payload
        console.log('Sending Request to Evaluate Permission:', request);


        try {
            const userResponse = await getUserById(userId, token);  // Pass token to the API call
            console.log("User data received: ", userResponse.data);
            setUser(userResponse.data);


            const permissionResponse = await evaluateUserToPermission(userId, request);
            console.log("Permission response: ", permissionResponse);
            setPermission(permissionResponse);
            setError(null);
        } catch (error) {
            console.error('Error in processing:', error);
            setError('No matching permission found' || error.message);
            setPermission(null);
        }
    };

            /*getUserById(userId)
                .then(response => {
                    console.log("User data received: ", response.data);
                    setUser(response.data);
                    const request = {
                        userAttributes,
                        resourceAttributes,
                        environmentAttributes
                    };
                    return evaluateUserToPermission(userId, request);
                })
                .then(response => {
                    console.log("Permission response: ", response.data);
                    setPermission(response.data);
                    setError(null);
                })
                .catch(error => {
                    console.error('Error in processing:', error);
                    setError('No matching permission found' || error.message);
                    setPermission(null);
                });

        }
        ;
*/
        return (
            <>
                <div className="overlay"></div>
                <div className="container">
                    <h1>Evaluate User to Permission</h1>
                    <form onSubmit={handleSubmit} className="form">
                        <label>
                            User ID:
                            <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} required
                                   className="input"/>
                        </label>
                        <h3>User Attributes</h3>
                        <label>
                            Name:
                            <input type="text" name="name" value={userAttributes.name}
                                   onChange={handleUserAttributeChange} className="input"/>
                        </label>
                        <label>
                            Institution:
                            <input type="text" name="institution" value={userAttributes.institution}
                                   onChange={handleUserAttributeChange} className="input"/>
                        </label>
                        <label>
                            Position:
                            <input type="text" name="position" value={userAttributes.position}
                                   onChange={handleUserAttributeChange} className="input"/>
                        </label>
                        <label>
                            Rank:
                            <input type="text" name="rank" value={userAttributes.rank}
                                   onChange={handleUserAttributeChange} className="input"/>
                        </label>
                        <h3>Resource Attributes</h3>
                        <label>
                            Resource Type:
                            <input type="text" name="resourceType" value={resourceAttributes.resourceType}
                                   onChange={handleResourceAttributeChange} className="input"/>
                        </label>
                        <label>
                            Resource Owner:
                            <input type="text" name="resourceOwner" value={resourceAttributes.resourceOwner}
                                   onChange={handleResourceAttributeChange} className="input"/>
                        </label>
                        <h3>Environment Attributes</h3>
                        <label>
                            Location:
                            <input type="text" name="location" value={environmentAttributes.location}
                                   onChange={handleEnvironmentAttributeChange} className="input"/>
                        </label>
                        <label>
                            Time:
                            <input type="text" name="time" value={environmentAttributes.time}
                                   onChange={handleEnvironmentAttributeChange} className="input"/>
                        </label>
                        <label>
                            Device Type:
                            <input type="text" name="deviceType" value={environmentAttributes.deviceType}
                                   onChange={handleEnvironmentAttributeChange} className="input"/>
                        </label>
                        <label>
                            IP Address:
                            <input type="text" name="ipAddress" value={environmentAttributes.ipAddress}
                                   onChange={handleEnvironmentAttributeChange} className="input"/>
                        </label>
                        <button type="submit" className="btn btn-primary">Evaluate Permission</button>
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
                    {permission && <div className="alert alert-success">Permission: {permission}</div>}
                    {error && <div className="alert alert-danger">{error}</div>}
                </div>
            </>
        );
    };

export default EvaluatePermission;

