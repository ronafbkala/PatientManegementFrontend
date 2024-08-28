import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getUserById, deleteUser } from '../../../api';

const UserDetails = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getUserById(id)
            .then(response => {
                console.log('Fetched User After Update:', response.data);  // This should show the updated role
                setUser(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching user:', error);
                setError('Error fetching user data');
                setLoading(false);
            });
    }, [id]);

    const handleDelete = () => {
        deleteUser(id)
            .then(() => {
                navigate('/dataowner/user');
            })
            .catch(error => {
                console.error('Error deleting user:', error);
                setError('Error deleting user');
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <h1>User Details</h1>
            <div className="card">
                <div className="card-header">Personal Information</div>
                <div className="card-body">
                    <div className="user-details">
                        <strong>Username:</strong> {user.username}
                    </div>
                    <div className="user-details">
                        <strong>Email:</strong> {user.email}
                    </div>
                    <div className="user-details">
                        <strong>Institution:</strong> {user.institution}
                    </div>
                    <div className="user-details">
                        <strong>Position:</strong> {user.position}
                    </div>
                    <div className="user-details">
                        <strong>Rank:</strong> {user.rank}
                    </div>
                    <div className="user-details">
                        <strong>Address:</strong> {user.address}
                    </div>
                    <div className="user-details">
                        <strong>Birthdate:</strong> {user.birthdate}
                    </div>
                    <div className="user-details">
                        <strong>Father's Name:</strong> {user.fatherName}
                    </div>
                    <div className="user-details">
                        <strong>Mother's Name:</strong> {user.motherName}
                    </div>
                    <div className="user-details">
                        <strong>Roles:</strong> {user.roles.map(role => role.name).join(', ')}
                    </div>
                </div>
            </div>
            <Link to={`/dataowner/user/${user.id}/edit`} className="btn btn-primary">Edit User</Link>
            <button onClick={handleDelete} className="btn btn-danger">Remove User</button>
        </div>
    );
};

export default UserDetails;
