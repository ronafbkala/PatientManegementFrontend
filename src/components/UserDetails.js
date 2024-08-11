import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserById } from '../api';

const UserDetails = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        getUserById(id).then(response => setUser(response.data));
    }, [id]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>User Details</h1>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <p>Institution: {user.institution}</p>
            <p>Position: {user.position}</p>
            <p>Rank: {user.rank}</p>
            <p>Address: {user.address}</p>
            <p>Birthdate: {user.birthdate}</p>
            <p>Father's Name: {user.fatherName}</p>
            <p>Mother's Name: {user.motherName}</p>
        </div>
    );
};

export default UserDetails;
