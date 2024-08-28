import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPolicyById, deletePolicy } from '../../../api';

const PolicyDetails = () => {
    const { id } = useParams();
    const [policy, setPolicy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const handleDelete = () => {
        deletePolicy(id)
            .then(() => {
                window.location.href = '/dataowner/policy';
            })
            .catch(error => {
                console.error('Error deleting policy:', error);
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
            <h1>Policy Details</h1>
            <div className="card">
                <div className="card-header">Policy Information</div>
                <div className="card-body">
                    <div className="policy-details">
                        <strong>Type:</strong> {policy.type}
                    </div>
                    <div className="policy-details">
                        <strong>Condition:</strong> {policy.condition}
                    </div>
                    <div className="policy-details">
                        <strong>Action:</strong> {policy.action}
                    </div>
                </div>
            </div>
            <Link to={`/dataowner/policy/${policy.id}/edit`} className="btn btn-primary">Edit Policy</Link>
            <button onClick={handleDelete} className="btn btn-danger">Remove Policy</button>
        </div>
    );
};

export default PolicyDetails;
