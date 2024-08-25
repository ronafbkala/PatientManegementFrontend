import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ConditionVerification = ({ keycloak, policies, onConditionsVerified }) => {
    const [location, setLocation] = useState('');
    const [department, setDepartment] = useState('');
    const [patientId, setPatientId] = useState('');
    const [requiredFields, setRequiredFields] = useState([]);

    const navigate = useNavigate();

    // Get the current user's username and normalize it to lowercase
    const username = keycloak.tokenParsed?.preferred_username?.trim().toLowerCase();

    useEffect(() => {
        console.log('Policies received:', policies); // Log the policies
        console.log('Logged in user:', username); // Log the current username

        // Initialize userPolicies array to collect matching policies
        let userPolicies = [];

        // Iterate through each policy
        policies.forEach(policy => {
            const conditions = policy.condition.split(' AND ').map(cond => cond.trim().toLowerCase());
            console.log('Checking policy:', policy);

            conditions.forEach(cond => {
                let [key, value] = cond.split('=').map(s => s.trim());

                // Remove all whitespace characters for the value comparison
                value = value.replace(/\s+/g, '');

                console.log(`Checking condition - Key: ${key}, Value: ${value}, Length: ${value.length}`);

                if (key === 'user') {
                    // Compare each character one by one
                    for (let i = 0; i < Math.max(username.length, value.length); i++) {
                        console.log(`Comparing character ${i + 1}: username: ${username.charCodeAt(i)}, value: ${value.charCodeAt(i)}`);
                    }

                    if (value.toLowerCase() === username.replace(/\s+/g, '')) {
                        console.log('Match found for user:', username, 'with value:', value);
                        userPolicies.push(policy);
                    } else {
                        console.log('No match found for user:', username, 'with value:', value);
                    }
                }
            });
        });


        console.log('Matching policies for user:', userPolicies); // Log the matching policies

        // Determine which fields are required based on the user's policies
        const fields = new Set();
        userPolicies.forEach(policy => {
            const conditions = policy.condition.split(' AND ').map(cond => cond.trim().toLowerCase());
            conditions.forEach(cond => {
                const [key] = cond.split('=').map(s => s.trim().toLowerCase());
                if (key !== 'user') {
                    fields.add(key);
                }
            });
        });

        console.log('Required fields:', Array.from(fields)); // Log the required fields
        setRequiredFields(Array.from(fields));
    }, [policies, username]);

    const handleVerification = () => {
        const userAttributes = {
            name: username,
        };

        const environmentAttributes = {
            location: location.trim().toLowerCase(),
            department: department.trim().toLowerCase(),
            patientId: patientId.trim().toLowerCase(),
        };

        console.log('Environment attributes:', environmentAttributes); // Log the environment attributes

        const matchingPolicy = policies.find(policy => {
            const conditions = policy.condition.split(' AND ').map(cond => cond.trim().toLowerCase());

            const allConditionsMet = conditions.every(cond => {
                const [key, value] = cond.split('=').map(s => s.trim().toLowerCase().replace(/\s+/g, ''));
                if (key === 'user') {
                    console.log(`Matching user condition - expected: ${value}, actual: ${userAttributes.name}`);
                    return userAttributes.name === value;
                }
                console.log(`Matching ${key} condition - expected: ${value}, actual: ${environmentAttributes[key]}`);
                return environmentAttributes[key] === value;
            });

            console.log(`All conditions met for policy ${policy.id}:`, allConditionsMet);
            return allConditionsMet;
        });

        console.log('Matching policy found:', matchingPolicy); // Log the matching policy

        if (matchingPolicy) {
            console.log('Conditions verified, policy action:', matchingPolicy.action);
            onConditionsVerified(matchingPolicy.action);
            navigate('/'); // Navigate to the main page after successful verification
        } else {
            console.log('No matching policy found.');
            onConditionsVerified(null); // No matching policy found, handle accordingly
        }
    };

    return (
        <div className="container">
            <h1>Verify Conditions</h1>
            {requiredFields.includes('location') && (
                <div className="form-group">
                    <label>Location:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>
            )}
            {requiredFields.includes('department') && (
                <div className="form-group">
                    <label>Department:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                    />
                </div>
            )}
            {requiredFields.includes('patient_id') && (
                <div className="form-group">
                    <label>Patient ID:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={patientId}
                        onChange={(e) => setPatientId(e.target.value)}
                    />
                </div>
            )}
            <button className="btn btn-primary" onClick={handleVerification}>
                Verify
            </button>
        </div>
    );
};

export default ConditionVerification;


/*
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ConditionVerification = ({ keycloak, policies, onConditionsVerified }) => {
    const [location, setLocation] = useState('');
    const [department, setDepartment] = useState('');
    const [patientId, setPatientId] = useState('');
    const [institution, setInstitution] = useState('');
    const [position, setPosition] = useState('');
    const [rank, setRank] = useState('');
    const [resourceType, setResourceType] = useState('');
    const [resourceOwner, setResourceOwner] = useState('');
    const [date, setDate] = useState('');
    const [requiredFields, setRequiredFields] = useState([]);

    const navigate = useNavigate();

    // Get the current user's username and normalize it to lowercase
    const username = keycloak.tokenParsed?.preferred_username?.trim().toLowerCase();

    useEffect(() => {
        console.log('Policies received:', policies); // Log the policies
        console.log('Logged in user:', username); // Log the current username

        // Initialize userPolicies array to collect matching policies
        let userPolicies = [];

        // Iterate through each policy
        policies.forEach(policy => {
            const conditions = policy.condition.split(' AND ').map(cond => cond.trim().toLowerCase());
            console.log('Checking policy:', policy);

            conditions.forEach(cond => {
                let [key, value] = cond.split('=').map(s => s.trim());

                // Remove all whitespace characters for the value comparison
                value = value.replace(/\s+/g, '');

                console.log(`Checking condition - Key: ${key}, Value: ${value}, Length: ${value.length}`);

                if (key === 'user') {
                    // Compare each character one by one
                    for (let i = 0; i < Math.max(username.length, value.length); i++) {
                        console.log(`Comparing character ${i + 1}: username: ${username.charCodeAt(i)}, value: ${value.charCodeAt(i)}`);
                    }

                    if (value.toLowerCase() === username.replace(/\s+/g, '')) {
                        console.log('Match found for user:', username, 'with value:', value);
                        userPolicies.push(policy);
                    } else {
                        console.log('No match found for user:', username, 'with value:', value);
                    }
                }
            });
        });

        console.log('Matching policies for user:', userPolicies); // Log the matching policies

        // Determine which fields are required based on the user's policies
        const fields = new Set();
        userPolicies.forEach(policy => {
            const conditions = policy.condition.split(' AND ').map(cond => cond.trim().toLowerCase());
            conditions.forEach(cond => {
                const [key] = cond.split('=').map(s => s.trim().toLowerCase());
                if (key !== 'user') {
                    fields.add(key);
                }
            });
        });

        console.log('Required fields:', Array.from(fields)); // Log the required fields
        setRequiredFields(Array.from(fields));
    }, [policies, username]);

    const handleVerification = () => {
        const userAttributes = {
            name: username,
            institution: institution.trim().toLowerCase(),
            position: position.trim().toLowerCase(),
            rank: rank.trim().toLowerCase(),
        };

        const resourceAttributes = {
            resourceType: resourceType.trim().toLowerCase(),
            resourceOwner: resourceOwner.trim().toLowerCase(),
            patientId: patientId.trim().toLowerCase(),
        };

        const environmentAttributes = {
            location: location.trim().toLowerCase(),
            department: department.trim().toLowerCase(),
            date: date.trim().toLowerCase(),
        };

        console.log('User attributes:', userAttributes); // Log the user attributes
        console.log('Resource attributes:', resourceAttributes); // Log the resource attributes
        console.log('Environment attributes:', environmentAttributes); // Log the environment attributes

        const matchingPolicy = policies.find(policy => {
            const conditions = policy.condition.split(' AND ').map(cond => cond.trim().toLowerCase());

            const allConditionsMet = conditions.every(cond => {
                const [key, value] = cond.split('=').map(s => s.trim().toLowerCase().replace(/\s+/g, ''));
                if (key === 'user') {
                    console.log(`Matching user condition - expected: ${value}, actual: ${userAttributes.name}`);
                    return userAttributes.name === value;
                }
                if (userAttributes.hasOwnProperty(key)) {
                    console.log(`Matching user attribute - expected: ${value}, actual: ${userAttributes[key]}`);
                    return userAttributes[key] === value;
                }
                if (resourceAttributes.hasOwnProperty(key)) {
                    console.log(`Matching resource attribute - expected: ${value}, actual: ${resourceAttributes[key]}`);
                    return resourceAttributes[key] === value;
                }
                if (environmentAttributes.hasOwnProperty(key)) {
                    console.log(`Matching environment attribute - expected: ${value}, actual: ${environmentAttributes[key]}`);
                    return environmentAttributes[key] === value;
                }
                return false;
            });

            console.log(`All conditions met for policy ${policy.id}:`, allConditionsMet);
            return allConditionsMet;
        });

        console.log('Matching policy found:', matchingPolicy); // Log the matching policy

        if (matchingPolicy) {
            console.log('Conditions verified, policy action:', matchingPolicy.action);
            onConditionsVerified(matchingPolicy.action);
            navigate('/'); // Navigate to the main page after successful verification
        } else {
            console.log('No matching policy found.');
            onConditionsVerified(null); // No matching policy found, handle accordingly
        }
    };

    return (
        <div className="container">
            <h1>Verify Conditions</h1>
            {requiredFields.includes('location') && (
                <div className="form-group">
                    <label>Location:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>
            )}
            {requiredFields.includes('department') && (
                <div className="form-group">
                    <label>Department:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                    />
                </div>
            )}
            {requiredFields.includes('patient_id') && (
                <div className="form-group">
                    <label>Patient ID:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={patientId}
                        onChange={(e) => setPatientId(e.target.value)}
                    />
                </div>
            )}
            {requiredFields.includes('institution') && (
                <div className="form-group">
                    <label>Institution:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                    />
                </div>
            )}
            {requiredFields.includes('position') && (
                <div className="form-group">
                    <label>Position:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                    />
                </div>
            )}
            {requiredFields.includes('rank') && (
                <div className="form-group">
                    <label>Rank:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={rank}
                        onChange={(e) => setRank(e.target.value)}
                    />
                </div>
            )}
            {requiredFields.includes('resource_type') && (
                <div className="form-group">
                    <label>Resource Type:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={resourceType}
                        onChange={(e) => setResourceType(e.target.value)}
                    />
                </div>
            )}
            {requiredFields.includes('resource_owner') && (
                <div className="form-group">
                    <label>Resource Owner:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={resourceOwner}
                        onChange={(e) => setResourceOwner(e.target.value)}
                    />
                </div>
            )}
            {requiredFields.includes('date') && (
                <div className="form-group">
                    <label>Date:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
            )}
            <button className="btn btn-primary" onClick={handleVerification}>
                Verify
            </button>
        </div>
    );
};

export default ConditionVerification;

 */

