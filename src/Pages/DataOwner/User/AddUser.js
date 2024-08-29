import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser, getUsers, getRoles, getRoleById } from '../../../api';

import '../../../styles.css';


// Function to check username existence
const checkUsernameExistsLocally = async (username) => {
    try {
        const response = await getUsers();
        const users = response.data;

        return users.some(user => user.username === username);
    } catch (error) {
        console.error('Error checking username:', error);
        return false;
    }
};

const AddUser = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [institution, setInstitution] = useState('');
    const [position, setPosition] = useState('');
    const [rank, setRank] = useState('');
    const [address, setAddress] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [fatherName, setFatherName] = useState('');
    const [motherName, setMotherName] = useState('');
    const [roles, setRoles] = useState([]);
    const [selectedRoleId, setSelectedRoleId] = useState('');

    const [error, setError] = useState('');

    const navigate = useNavigate();

    // Fetch all roles when the component mounts
    useEffect(() => {
        getRoles()
            .then(response => {
                setRoles(response.data);
            })
            .catch(error => {
                console.error('Error fetching roles:', error);
            });
    }, []);



    const handleSubmit = async (event) => {
        event.preventDefault();

        // Retrieve the token from local storage
        const token = localStorage.getItem('access_token');
        console.log('Auth Token:', token);


        // Check if the username is unique
        const usernameExists = await checkUsernameExistsLocally(username);
        if (usernameExists) {
            setError('This username is already taken. Please choose a different one.');
            return;
        }


        const roleResponse = await getRoleById(selectedRoleId);
        const selectedRole = roleResponse.data;



        console.log('Selected Role:', selectedRole);

        if (!selectedRole) {
            setError('Please select a role.');
            return;
        }

        const newUser = {
            username,
            email,
            password,
            institution,
            position,
            rank,
            address,
            birthdate,
            fatherName,
            motherName,
            //roles: selectedRoles,
            roles: [{ id: selectedRole.id, name: selectedRole.name }],

        };
        console.log('Creating new user with data:', JSON.stringify(newUser, null, 2));

        try {
            const response = await createUser(newUser);
            console.log('User created successfully:', response.data);

            navigate('/dataowner/user');
        } catch (error) {
            if (error.response) {
                console.error('Server Error:', error.response.data);
                console.error('Status Code:', error.response.status);
                console.error('Headers:', error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error setting up the request:', error.message);
            }
            setError('Error creating user. Please try again.');
        }

    };

    return (
        <>
            <div className="overlay"></div>
            <div className="container">
                <h1>Add New User</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        Username:
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </label>
                    <label>
                        Email:
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </label>
                    <label>
                        Password:
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </label>
                    <label>
                        Institution:
                        <input type="text" value={institution} onChange={(e) => setInstitution(e.target.value)} />
                    </label>
                    <label>
                        Position:
                        <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} />
                    </label>
                    <label>
                        Rank:
                        <input type="text" value={rank} onChange={(e) => setRank(e.target.value)} />
                    </label>
                    <label>
                        Address:
                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </label>
                    <label>
                        Birthdate:
                        <input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
                    </label>
                    <label>
                        Father's Name:
                        <input type="text" value={fatherName} onChange={(e) => setFatherName(e.target.value)} />
                    </label>
                    <label>
                        Mother's Name:
                        <input type="text" value={motherName} onChange={(e) => setMotherName(e.target.value)} />
                    </label>


                    <h2>Role</h2>
                    <label>
                        Select Role:
                        <select
                            value={selectedRoleId}
                            onChange={(e) => setSelectedRoleId(e.target.value)}
                            required
                            className="select"
                        >
                            <option value="">Select Role</option>
                            {roles.map((roleOption) => (
                                <option key={roleOption.id} value={roleOption.id}>
                                    {roleOption.name}
                                </option>
                            ))}
                        </select>
                    </label>



                    {error && <div className="alert alert-danger">{error}</div>}


                    <button type="submit" className="btn btn-primary">Add User</button>
                </form>
            </div>
        </>
    );
};

export default AddUser;
