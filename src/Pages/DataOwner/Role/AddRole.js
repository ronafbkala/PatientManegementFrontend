import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRole } from '../../../api';
import '../../../styles.css';

const AddRole = () => {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const newRole = { name };

        createRole(newRole)
            .then(() => {
                navigate('/dataowner/role');
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

