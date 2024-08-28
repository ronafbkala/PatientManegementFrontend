import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRoles } from '../../../api';
import '../../../styles.css';

const RoleList = () => {
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        getRoles()
            .then(response => {
                setRoles(response.data);
            })
            .catch(error => {
                console.error('Error fetching roles:', error);
            });
    }, []);

    return (
        <div>
            <h1 className="heading">Roles</h1>
            <ul className="role-list">
                {roles.map(role => (
                    <li key={role.id}>
                        <Link to={`/dataowner/role/${role.id}`} className="nav-link">{role.name}</Link>
                    </li>
                ))}
            </ul>
            <Link to="/dataowner/role/new" className="nav-link">Add New Role</Link>
        </div>
    );
};

export default RoleList;
