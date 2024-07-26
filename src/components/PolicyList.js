/*import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllPolicies, deletePolicy } from '../api';

const PolicyList = () => {
    const [policies, setPolicies] = useState([]);

    useEffect(() => {
        getAllPolicies()
            .then(response => setPolicies(response.data))
            .catch(error => console.error('Error fetching policies:', error));
    }, []);

    const handleDelete = (id) => {
        deletePolicy(id)
            .then(() => setPolicies(policies.filter(policy => policy.id !== id)))
            .catch(error => console.error('Error deleting policy:', error));
    };

    return (
        <div>
            <h1>Policies</h1>
            <Link to="/policies/new">Add New Policy</Link>
            <ul>
                {policies.map(policy => (
                    <li key={policy.id}>
                        <Link to={`/policies/${policy.id}`}>{policy.type}</Link>
                        <button onClick={() => handleDelete(policy.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PolicyList;*/
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllPolicies } from '../api';
import '../styles.css';

const PolicyList = () => {
    const [policies, setPolicies] = useState([]);

    useEffect(() => {
        getAllPolicies()
            .then(response => {
                setPolicies(response.data);
            })
            .catch(error => {
                console.error('Error fetching policies:', error);
            });
    }, []);

    return (
        <div>
            <h1 className="heading">Policies</h1>
            <ul className="policy-list">
                {policies.map(policy => (
                    <li key={policy.id}>
                        <Link to={`/policies/${policy.id}`} className="nav-link">
                            {policy.type} - {policy.condition}
                        </Link>
                    </li>
                ))}
            </ul>
            <Link to="/policies/new" className="nav-link">Add New Policy</Link>
        </div>
    );
};

export default PolicyList;


