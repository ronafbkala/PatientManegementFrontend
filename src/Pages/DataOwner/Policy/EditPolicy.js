import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPolicyById, updatePolicy } from '../../../api';

const EditPolicy = () => {
    const { id } = useParams();
    const [policy, setPolicy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getPolicyById(id)
            .then(response => {
                setPolicy(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching policy:', error);
                setError('Error fetching policy data');
                setLoading(false);
            });
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPolicy({
            ...policy,
            [name]: value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        updatePolicy(id, policy)
            .then(() => {
                navigate(`/dataowner/policy/${id}`);
            })
            .catch(error => {
                console.error('Error updating policy:', error);
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!policy) {
        return <div>No policy found</div>;
    }

    return (
        <div className="container">
            <h1>Edit Policy</h1>
            <form onSubmit={handleSubmit} className="form">
                <label>
                    Type:
                    <input type="text" name="type" value={policy.type} onChange={handleChange} required />
                </label>
                <label>
                    Condition:
                    <input type="text" name="condition" value={policy.condition} onChange={handleChange} required />
                </label>
                <label>
                    Action:
                    <input type="text" name="action" value={policy.action} onChange={handleChange} required />
                </label>
                <button type="submit" className="btn btn-primary">Update Policy</button>
            </form>
        </div>
    );
};

export default EditPolicy;
