import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserById, updateUser, getRoles } from '../../../api';

const EditUser = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const response = await getUserById(id);
            const userData = response.data;
            userData.roles = userData.roles.map(role => role.id); // Map roles to their IDs
            setUser(userData);
        };

        const fetchRoles = async () => {
            const response = await getRoles();
            setRoles(response.data);
        };

        fetchUser();
        fetchRoles();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleRoleChange = (e) => {
        const selectedRoles = Array.from(e.target.selectedOptions, option => option.value);
        setUser({ ...user, roles: selectedRoles });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedUser = {
            id: user.id,
            username: user.username,
            password: user.password, // Ensure the backend accepts the password in this form
            email: user.email,
            institution: user.institution || "",
            position: user.position || "",
            rank: user.rank || "",
            address: user.address || "",
            birthdate: user.birthdate,
            fatherName: user.fatherName || "",
            motherName: user.motherName || "",
            // Send roles as an array of objects with IDs
            roles: user.roles.map(roleId => ({ id: roleId }))
        };

        console.log('Payload being sent to update user:', JSON.stringify(updatedUser, null, 2));

        try {
            const response = await updateUser(id, updatedUser);
            console.log('Update successful:', response.data);
            navigate('/dataowner/user');
        } catch (error) {
            if (error.response) {
                console.error('Server responded with an error:', error.response.data);
                console.error('Status code:', error.response.status);
                console.error('Headers:', error.response.headers);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up request:', error.message);
            }
        }
    };


    if (!user) {
        return <div>No user found</div>;
    }

    return (
        <div>
            <h1>Edit User</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input type="text" name="username" value={user.username} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Email:
                    <input type="email" name="email" value={user.email} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Institution:
                    <input type="text" name="institution" value={user.institution} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Position:
                    <input type="text" name="position" value={user.position} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Rank:
                    <input type="text" name="rank" value={user.rank} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Address:
                    <input type="text" name="address" value={user.address} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Birthdate:
                    <input type="date" name="birthdate" value={user.birthdate} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Father's Name:
                    <input type="text" name="fatherName" value={user.fatherName} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Mother's Name:
                    <input type="text" name="motherName" value={user.motherName} onChange={handleChange} />
                </label>
                <br />
                <h2>Roles</h2>
                <label>
                    Select Roles:
                    <select multiple={true} value={user.roles} onChange={handleRoleChange} className="select">
                        {roles.map(role => (
                            <option key={role.id} value={role.id}>
                                {role.name}
                            </option>
                        ))}
                    </select>
                </label>
                <br />
                <button type="submit">Update User</button>
            </form>
        </div>
    );
};

export default EditUser;
