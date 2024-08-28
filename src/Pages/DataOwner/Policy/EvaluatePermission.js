import React, {useEffect, useState} from 'react';
import { getUserById, getAllPolicies, getPatientById } from '../../../api';
import '../../../styles.css';

const EvaluatePermission = ({onPermissionEvaluated}) => {
    const [userId, setUserId] = useState('');
    const [user, setUser] = useState(null);
    const [patient, setPatient] = useState(null); // State to store patient information
    const [userAttributes, setUserAttributes] = useState({
        name: '',
        institution: '',
        position: '',
        rank: '',
    });
    const [resourceAttributes, setResourceAttributes] = useState({
        resourceType: '',
        resourceOwner: '',
        patientId: '',
    });
    const [environmentAttributes, setEnvironmentAttributes] = useState({
        location: '',
        department: '',
        date: '',
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
        // Fetch patient information when patientId is available
        if (resourceAttributes.patientId) {
            getPatientById(resourceAttributes.patientId)
                .then(response => {
                    setPatient(response.data); // Store patient data in state
                    console.log('Patient data:', response.data);
                })
                .catch(error => {
                    console.error('Error fetching patient data:', error);
                    setError('Error fetching patient data');
                });
        }
    }, [resourceAttributes.patientId]); // Trigger this useEffect when patientId changes

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

            // Separate match variables for each condition
            let isMatchUser = true;
            let isMatchInstitution = true;
            let isMatchPosition = true;
            let isMatchRank = true;
            let isMatchDepartment = true;
            let isMatchResourceType = true;
            let isMatchLocation = true;
            let isMatchPatientId = true;

            conditions.forEach(cond => {
                const [key, value] = cond.split('=').map(s => s.trim().toLowerCase()); // Normalize case and trim whitespace
                console.log(`Checking condition: ${key}=${value}`);

                switch (key) {
                    case 'user':
                        isMatchUser = (userAttributes.name || '').trim().toLowerCase() === value;
                        break;
                    case 'institution':
                        isMatchInstitution = (userAttributes.institution || '').trim().toLowerCase() === value;
                        break;
                    case 'position':
                        isMatchPosition = (userAttributes.position || '').trim().toLowerCase() === value;
                        break;
                    case 'rank':
                        isMatchRank = (userAttributes.rank || '').trim().toLowerCase() === value;
                        break;
                    case 'department':
                        const departmentValue = (environmentAttributes.department || '').trim().toLowerCase();
                        console.log(`Comparing department values: '${departmentValue}' vs '${value}'`);
                        console.log(`Length of departmentValue: ${departmentValue.length}, Length of value: ${value.length}`);
                        isMatchDepartment = departmentValue === value;
                        if (!isMatchDepartment) {
                            console.log(`Character codes (departmentValue): ${Array.from(departmentValue).map(c => c.charCodeAt(0))}`);
                            console.log(`Character codes (value): ${Array.from(value).map(c => c.charCodeAt(0))}`);
                        }
                        break;
                    case 'resource_type':
                        isMatchResourceType = (resourceAttributes.resourceType || '').trim().toLowerCase() === value;
                        break;
                    case 'location':
                        isMatchLocation = (environmentAttributes.location || '').trim().toLowerCase() === value;
                        break;
                    case 'patient_id':
                        isMatchPatientId = resourceAttributes.patientId === parseInt(value, 10);
                        break;
                    default:
                        console.log(`Unknown condition key: ${key}`);
                        return false;
                }

                console.log(`Condition ${key}=${value} matched:`,
                    key === 'user' ? isMatchUser :
                        key === 'institution' ? isMatchInstitution :
                            key === 'position' ? isMatchPosition :
                                key === 'rank' ? isMatchRank :
                                    key === 'department' ? isMatchDepartment :
                                        key === 'resource_type' ? isMatchResourceType :
                                            key === 'location' ? isMatchLocation :
                                                key === 'patient_id' ? isMatchPatientId : false);
            });

            // Evaluate if all conditions matched
            const allConditionsMatch = isMatchUser && isMatchInstitution && isMatchPosition &&
                isMatchRank && isMatchDepartment && isMatchResourceType &&
                isMatchLocation && isMatchPatientId;

            if (allConditionsMatch) {
                console.log("All conditions matched, returning policy:", policy);
                return true;
            } else {
                console.log("Not all conditions matched, skipping policy:", policy);
                return false;
            }
        });
    };


    const handleSubmit  = async (event) => {
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
                name: userData.username,
                institution: userData.institution,
                position: userData.position,
                rank: userData.rank,

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

            const matchingPolicy = findMatchingPolicy(
                policies,
                'UserToPermission',
                {

                    name: userData.username,
                    institution: userData.institution,
                    position: userData.position,
                    rank: userData.rank

                },
                {
                    ...resourceAttributes,
                    patientId: patient ? patient.id : resourceAttributes.patientId, // Use patient ID from fetched data
                },
                environmentAttributes
            );

            console.log("Matching policy object:", matchingPolicy);

            if (matchingPolicy) {
                console.log("Matching policy found:", matchingPolicy);
                console.log("Action from matching policy:", matchingPolicy.action);

                setPermission(matchingPolicy.action);
                setError(null);
                if (onPermissionEvaluated) {
                    console.log("Calling onPermissionEvaluated with:", matchingPolicy.action);
                    onPermissionEvaluated(matchingPolicy.action);
                    console.log("Calling onPermissionEvaluated with:", onPermissionEvaluated(matchingPolicy.action));
                }

            } else {
                console.log("No matching policy found");
                setError("No matching policy found");
                setPermission(null);
                onPermissionEvaluated(null);
            }
        } catch (error) {
            console.error('Error in processing:', error.response?.data || error.message || error);
            setError('No matching permission found' || error.message);
            setPermission(null);
            onPermissionEvaluated(null);
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
                            readOnly  //  The field read-only since it should be populated automatically
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
                    <label>
                        Department:
                        <input type="text" name="department" value={environmentAttributes.department}
                               onChange={handleEnvironmentAttributeChange} className="input"/>
                    </label>
                    <label>
                        Patient ID:
                        <input type="text" name="patientId" value={resourceAttributes.patientId}
                               onChange={handleResourceAttributeChange} className="input"/>
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

