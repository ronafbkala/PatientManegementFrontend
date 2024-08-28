import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPatientById, updatePatient } from '../../api';

const EditPatientInfo = () => {
    const { patientId } = useParams(); // Get patient ID from URL
    const [patient, setPatient] = useState({
        name: '',
        birthdate: '',
        address: '',
        department: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (patientId) {
            getPatientById(patientId)
                .then(response => {
                    setPatient(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching patient data:', error);
                    setError('Failed to load patient data.');
                    setLoading(false);
                });
        } else {
            setError('No patient ID provided.');
            setLoading(false);
        }
    }, [patientId]);

    const handleChange = (e) => {
        setPatient({
            ...patient,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updatePatient(patientId, patient)
            .then(() => {
                navigate('/patient/dashboard'); 
            })
            .catch(error => {
                console.error('Error updating patient data:', error);
                setError('Failed to update patient data.');
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container">
            <h1>Edit Personal Information</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={patient.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Birthdate:</label>
                    <input
                        type="date"
                        className="form-control"
                        name="birthdate"
                        value={patient.birthdate}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Address:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="address"
                        value={patient.address}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Department:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="department"
                        value={patient.department}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
        </div>
    );
};

export default EditPatientInfo;
