import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoleById, updateRole } from '../api';

const EditRole = () => {
    const { id } = useParams();
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getRoleById(id)
            .then(response => {
                setRole(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching role:', error);
                setError('Error fetching role data');
                setLoading(false);
            });
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setRole({
            ...role,
            [name]: value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        updateRole(id, role)
            .then(() => {
                navigate(`/roles/${id}`);
            })
            .catch(error => {
                console.error('Error updating role:', error);
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!role) {
        return <div>No role found</div>;
    }

    return (
        <div>
            <h1>Edit Role</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={role.name}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <button type="submit">Update Role</button>
            </form>
        </div>
    );
};

export default EditRole;
