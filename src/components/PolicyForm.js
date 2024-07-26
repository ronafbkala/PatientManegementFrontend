import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPolicy, getPolicyById, updatePolicy } from '../api';

const PolicyForm = () => {
    const [type, setType] = useState('');
    const [condition, setCondition] = useState('');
    const [action, setAction] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            getPolicyById(id).then(response => {
                const policy = response.data;
                setType(policy.type);
                setCondition(policy.condition);
                setAction(policy.action);
            }).catch(error => console.error('Error fetching policy:', error));
        }
    }, [id]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const policy = { type, condition, action };

        if (id) {
            updatePolicy(id, policy).then(() => navigate('/policies')).catch(error => console.error('Error updating policy:', error));
        } else {
            createPolicy(policy).then(() => navigate('/policies')).catch(error => console.error('Error creating policy:', error));
        }
    };

    return (
        <div>
            <h1>{id ? 'Edit Policy' : 'Add New Policy'}</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Type:
                    <input type="text" value={type} onChange={(e) => setType(e.target.value)} required />
                </label>
                <br />
                <label>
                    Condition:
                    <input type="text" value={condition} onChange={(e) => setCondition(e.target.value)} required />
                </label>
                <br />
                <label>
                    Action:
                    <input type="text" value={action} onChange={(e) => setAction(e.target.value)} required />
                </label>
                <br />
                <button type="submit">{id ? 'Update Policy' : 'Add Policy'}</button>
            </form>
        </div>
    );
};

export default PolicyForm;
