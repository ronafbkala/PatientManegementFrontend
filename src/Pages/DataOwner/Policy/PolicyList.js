import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllPolicies } from '../../../api';
import '../../../styles.css';

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
                        <Link to={`/dataowner/policy/${policy.id}`} className="nav-link">
                            {policy.type} - {policy.condition}
                        </Link>
                    </li>
                ))}
            </ul>
            <Link to="/dataowner/policy/new" className="nav-link">Add New Policy</Link>
        </div>
    );
};

export default PolicyList;


