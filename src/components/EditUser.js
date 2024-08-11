/*import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserById, updateUser } from '../api';

const EditUser = () => {
    const { id } = useParams();
    const [user, setUser] = useState({
        username: '',
        email: '',
        institution: '',
        position: '',
        rank: '',
        address: '',
        birthdate: '',
        fatherName: '',
        motherName: ''
    });

    useEffect(() => {
        getUserById(id).then(response => setUser(response.data));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateUser(id, user).then(() => {
            alert('User updated successfully');
        });
    };

    return (
        <div>
            <h1>Update User</h1>
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
                    <input type="text" name="institution" value={user.institution} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Position:
                    <input type="text" name="position" value={user.position} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Rank:
                    <input type="text" name="rank" value={user.rank} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Address:
                    <input type="text" name="address" value={user.address} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Birthdate:
                    <input type="date" name="birthdate" value={user.birthdate} onChange={handleChange} required />
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
                <button type="submit">Update User</button>
            </form>
        </div>
    );
};

export default EditUser;
*/

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserById, updateUser, getRoles } from '../api';

const EditUser = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const response = await getUserById(id);
            const userData = response.data;
            userData.roles = userData.roles.map(role => role.name); // Map roles to their names
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
        await updateUser(id, user);
        navigate('/users');
    };

    if (!user) {
        return <div>Loading...</div>;
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
                <label>
                    Roles:
                    <select multiple={true} value={user.roles} onChange={handleRoleChange}>
                        {roles.map(role => (
                            <option key={role.id} value={role.name}>
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
