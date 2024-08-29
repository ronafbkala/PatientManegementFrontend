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
            password: user.password,
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
        <div className="container">
            <h1>Edit User</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" name="username" className="form-control" value={user.username} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" className="form-control" value={user.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Institution</label>
                    <input type="text" name="institution" className="form-control" value={user.institution} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Position</label>
                    <input type="text" name="position" className="form-control" value={user.position} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Rank</label>
                    <input type="text" name="rank" className="form-control" value={user.rank} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Address</label>
                    <input type="text" name="address" className="form-control" value={user.address} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Birthdate</label>
                    <input type="date" name="birthdate" className="form-control" value={user.birthdate} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Father's Name</label>
                    <input type="text" name="fatherName" className="form-control" value={user.fatherName} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Mother's Name</label>
                    <input type="text" name="motherName" className="form-control" value={user.motherName} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Select Roles</label>
                    <select multiple={true} value={user.roles} onChange={handleRoleChange} className="form-control">
                        {roles.map(role => (
                            <option key={role.id} value={role.id}>
                                {role.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Update User</button>
            </form>
        </div>
    );
};

export default EditUser;
