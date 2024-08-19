import React, {useEffect, useState} from 'react';
import { getUserById, getAllPolicies } from '../api';
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
    const [policies, setPolicies] = useState([]);

    useEffect(() => {
        // Fetch all policies when the component mounts
        getAllPolicies()
            .then(response => {
                setPolicies(response.data);
            })
            .catch(error => {
                console.error('Error fetching policies:', error);
                setError('Error fetching policies');
            });
    }, []);

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

    const findMatchingPolicy = (policies, policyType, userAttributes, resourceAttributes, environmentAttributes) => {
        console.log("Evaluating policies:", policies);

        return policies.find(policy => {
            console.log("Evaluating policy:", policy);

            // Check if the policy type matches
            if (policy.type !== policyType) {
                console.log("Skipping policy due to type mismatch:", policy.type);
                return false;
            }

            const conditions = policy.condition.split(' AND ');
            let usernameMatched = false;

            // Check if any condition matches
            const allConditionsMatch = conditions.every(cond => {
                const [key, value] = cond.split('=').map(s => s.trim());
                console.log(`Checking condition: ${key}=${value}`);

                let isMatch = false;
                switch (key) {
                    case 'user':
                        isMatch = userAttributes.name === value;
                        if (isMatch) {
                            usernameMatched = true; // Track if username matched
                        }
                        break;
                    case 'institution':
                        isMatch = userAttributes.institution === value;
                        break;
                    case 'position':
                        isMatch = userAttributes.position === value;
                        break;
                    case 'rank':
                        isMatch = userAttributes.rank === value;
                        break;
                    case 'resource_type':
                        isMatch = resourceAttributes.resourceType === value;
                        break;
                    case 'location':
                        isMatch = environmentAttributes.location === value;
                        break;
                    default:
                        console.log(`Unknown condition key: ${key}`);
                        return false;
                }
                console.log(`Condition ${key}=${value} matched: ${isMatch}`);
                return isMatch;
            });

            // Return true if username matched, regardless of other conditions
            if (usernameMatched) {
                console.log("Username matched, returning policy:", policy);
                return true;
            }

            // Otherwise, return based on all conditions matching
            return allConditionsMatch;
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

        try {
            const userResponse = await getUserById(userId, token);  // Pass token to the API call
            console.log("User data received: ", userResponse.data);

            const userData = userResponse.data;
            console.log("User data received: ", userData);

            // Check if the name exists in the user data
            if (!userData.username) {
                setError('User name not found');
                return;
            }

            // Set the user state with the fetched user data
            setUser(userData);

            // Automatically populate the name field in userAttributes
            setUserAttributes((prevAttributes) => ({
                ...prevAttributes,
                name: userData.username,  // Set the name from the user data
                institution: userData.institution,
                position: userData.position,
                rank: userData.rank
            }));

            console.log('Sending Request to Evaluate Permission:', {
                userAttributes,
                resourceAttributes,
                environmentAttributes
            });

            // Prepare the request payload
            const request = {
                userAttributes: {
                    ...userAttributes,
                    name: userData.username // Ensure the name is included
                },
                resourceAttributes,
                environmentAttributes
            };


            // Log the request payload
            console.log('Sending Request to Evaluate Permission:', request);


            // Ensure that we are only matching policies of type 'UserToPermission'
            console.log("Evaluating for policy type: UserToPermission");
            //const matchingPolicy = findMatchingPolicy(policies, 'UserToPermission', userAttributes, resourceAttributes, environmentAttributes);




            const matchingPolicy = findMatchingPolicy(
                policies,
                'UserToPermission',
                {

                    name: userData.username,
                    institution: userData.institution,
                    position: userData.position,
                    rank: userData.rank
                },
                resourceAttributes,
                environmentAttributes
            );

            console.log("Matching policy object:", matchingPolicy);

            if (matchingPolicy) {
                console.log("Matching policy found:", matchingPolicy);
                console.log("Action from matching policy:", matchingPolicy.action);

                setPermission(matchingPolicy.action);
                setError(null);
            } else {
                console.log("No matching policy found");
                setError("No matching policy found");
                setPermission(null);
            }
        } catch (error) {
            console.error('Error in processing:', error.response?.data || error.message || error);
            setError('No matching permission found' || error.message);
            setPermission(null);
        }
    };
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
                            <input
                                type="text"
                                name="name"
                                value={userAttributes.name}
                                onChange={handleUserAttributeChange}
                                className="input"
                                readOnly  // Make the field read-only since it should be populated automatically
                            />
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
                        <h3>Environment Attributes</h3>
                        <label>
                            Location:
                            <input type="text" name="location" value={environmentAttributes.location}
                                   onChange={handleEnvironmentAttributeChange} className="input"/>
                        </label>


                        <button type="submit" className="btn btn-primary">Evaluate Permission</button>
                    </form>
                    {user && (
                        <div className="card">
                            <div className="card-header">User Information</div>
                            <div className="card-body">
                                <p><strong>Name:</strong> {user.username}</p>
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

