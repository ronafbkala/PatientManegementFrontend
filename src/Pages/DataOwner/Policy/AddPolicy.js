import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPolicy } from '../../../api';
import '../../../styles.css';

const AddPolicy = () => {
    const [type, setType] = useState('UserToRole');
    const [conditions, setConditions] = useState([{ key: '', value: '' }]);
    const [action, setAction] = useState('');
    const navigate = useNavigate();

    const handleConditionChange = (index, field, value) => {
        const newConditions = conditions.map((cond, i) => (
            i === index ? { ...cond, [field]: value } : cond
        ));
        setConditions(newConditions);
    };

    const addCondition = () => {
        setConditions([...conditions, { key: '', value: '' }]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const conditionString = conditions.map(cond => `${cond.key}=${cond.value}`).join(' AND ');
        const newPolicy = { type, condition: conditionString, action };
        createPolicy(newPolicy)
            .then(() => {
                navigate('/dataowner/policy');
            })
            .catch(error => {
                console.error('Error creating policy:', error);
            });
    };

    return (
        <div className="container">
            <h1>Add New Policy</h1>
            <form onSubmit={handleSubmit} className="form">
                <label>
                    Type:
                    <select value={type} onChange={(e) => setType(e.target.value)} className="select">
                        <option value="UserToRole">User To Role</option>
                        <option value="UserToPermission">User To Permission</option>
                    </select>
                </label>

                <h3>Conditions</h3>
                {conditions.map((cond, index) => (
                    <div key={index} className="condition-group">
                        <label>
                            Key:
                            <select
                                value={cond.key}
                                onChange={(e) => handleConditionChange(index, 'key', e.target.value)}
                                required
                                className="select"
                            >
                                <option value="">Select Key</option>
                                <option value="user">User</option>
                                <option value="institution">Institution</option>
                                <option value="position">Position</option>
                                <option value="rank">Rank</option>
                                <option value="resource_type">Resource Type</option>
                                <option value="location">Location</option>
                                <option value="department">Department</option>
                                <option value="date">Date</option>
                                <option value="patient_id">Patient Id</option>
                            </select>
                        </label>
                        <label>
                            Value:
                            <input
                                type="text"
                                value={cond.value}
                                onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
                                required
                                className="input"
                            />
                        </label>
                    </div>
                ))}
                <button type="button" onClick={addCondition} className="btn btn-secondary">Add Condition</button>
                <label>
                    Action:
                    <input type="text" value={action} onChange={(e) => setAction(e.target.value)} required className="input"/>
                </label>
                <button type="submit" className="btn btn-primary">Add Policy</button>
            </form>
        </div>
    );
};

export default AddPolicy;

