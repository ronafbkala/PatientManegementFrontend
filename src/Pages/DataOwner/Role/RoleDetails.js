import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getRoleById, deleteRole } from '../../../api';

const RoleDetails = () => {
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

    const handleDelete = () => {
        deleteRole(id)
            .then(() => {
                navigate('dataowner/role');
            })
            .catch(error => {
                console.error('Error deleting role:', error);
                setError('Error deleting role');
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
        <div className="container">
            <h1>Role Details</h1>
            <div className="card">
                <div className="card-header">Role Information</div>
                <div className="card-body">
                    <div className="role-details">
                        <strong>ID:</strong> {role.id}
                    </div>
                    <div className="role-details">
                        <strong>Name:</strong> {role.name}
                    </div>
                </div>
            </div>
            <Link to={`/dataowner/role/${role.id}/edit`} className="btn btn-primary">Edit Role</Link>
            <button onClick={handleDelete} className="btn btn-danger">Remove Role</button>
        </div>
    );
};

export default RoleDetails;
