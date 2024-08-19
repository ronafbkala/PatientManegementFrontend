/*import React, { useState } from 'react';
import { createRole } from '../api';

const AddRole = ({ selectedRoles, setSelectedRoles }) => {
    const [roleName, setRoleName] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null); // State to track success message


    const handleRoleAdd = async () => {  // Changed to handleRoleAdd
        console.log('Role name entered:', roleName); // Log the role name entered by the user


        if (roleName.trim() === '') {
            console.log('Error: Role name is empty'); // Log if the role name is empty
            setError('Role name cannot be empty');
            setSuccess(null); // Clear any previous success message
            return;
        }

        try {
            const newRole = { name: roleName };
            console.log('Creating role with data:', newRole); // Log the role data being sent to the API

            const response = await createRole(newRole);
            console.log('Role created successfully:', response.data); // Log the response from the API
            // Add the new role to the selectedRoles array
            setSelectedRoles([...selectedRoles, response.data.name]);
            console.log('Updated selected roles:', [...selectedRoles, response.data.name]);

            setSuccess('Role created successfully!');

            setError(null); // Clear any previous error

            setRoleName('');  // Clear the input field
        } catch (err) {
            console.error('Failed to create role:', err); // Log any error that occurs during role creation
            setError('Failed to create role');
            setSuccess(null); // Clear any previous success message
        }
    };

    return (
        <div>
            <h3>Add a New Role</h3>
            <div>
                <label>
                    Role Name:
                    <input
                        type="text"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                    />
                </label>
                <button type="button" onClick={handleRoleAdd}>Add Role</button>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}


            <div>
                <h4>Selected Roles:</h4>
                <ul>
                    {selectedRoles.map((role, index) => (
                        <li key={index}>{role}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AddRole;

 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRole } from '../api';
import '../styles.css';

const AddRole = () => {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const newRole = { name };

        createRole(newRole)
            .then(() => {
                navigate('/roles');
            })
            .catch(error => {
                console.error('Error creating role:', error);
            });
    };

    return (
        <>
            <div className="overlay"></div>
            <div className="container">
                <h1>Add New Role</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        Name:
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </label>
                    <button type="submit" className="btn btn-primary">Add Role</button>
                </form>
            </div>
        </>
    );
};

export default AddRole;

