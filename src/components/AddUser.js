import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser, getRoles } from '../api';

const AddUser = () => {
    const [user, setUser] = useState({
        username: '',
        email: '',
        password: '',
        institution: '',
        position: '',
        rank: '',
        address: '',
        birthdate: '',
        fatherName: '',
        motherName: '',
        roles: []
    });
    const [roles, setRoles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoles = async () => {
            const response = await getRoles();
            setRoles(response.data);
        };
        fetchRoles();
    }, []);

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
        await createUser(user);
        navigate('/users');
    };

    return (
        <div>
            <h1>Add User</h1>
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
                    Password:
                    <input type="password" name="password" value={user.password} onChange={handleChange} required />
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
                <button type="submit">Add User</button>
            </form>
        </div>
    );
};

export default AddUser;
