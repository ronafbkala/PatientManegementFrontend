import React, { useEffect, useState } from 'react';
import { getUsers } from '../../../api';
import {Link, useNavigate} from 'react-router-dom';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getUsers();
                setUsers(response.data);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    setError('Unauthorized access. Please log in.');
                    navigate('/login');
                } else {
                    setError('An error occurred while fetching users.');
                }
            }
        };

        fetchUsers();
    }, [navigate]);

    return (
        <div>
            <h1 className="heading">User List</h1>
            {error ? (
                <div className="alert alert-danger">{error}</div>
            ) : (
                <>
                    <ul>
                        {users.length > 0 ? (
                            users.map(user => (
                                <li key={user.id}>
                                    <Link to={`/dataowner/user/${user.id}`} className="nav-link">
                                        {user.username} - {user.email}
                                    </Link>
                                </li>
                            ))
                        ) : (
                            <p>No users found.</p>
                        )}
                    </ul>
                    {users.length > 0 && (
                        <button
                            onClick={() => navigate('/dataowner/user/new')}
                            className="btn btn-primary"
                        >
                            Add User
                        </button>

                    )}
                </>
            )}
        </div>
    );
};

export default UserList;
