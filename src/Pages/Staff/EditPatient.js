import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPatientById, updatePatient } from '../../api';

const EditPatient = ({ permission }) => {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getPatientById(id)
            .then(response => {
                setPatient(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching patient:', error);
                setError('Error fetching patient data');
                setLoading(false);
            });
    }, [id]);

    const handleSave = () => {
        updatePatient(id, patient)
            .then(() => {
                navigate(`/staff/patients/${id}`);
            })
            .catch(error => {
                console.error('Error updating patient:', error);
                setError('Error updating patient');
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
            <h1>Edit Patient</h1>
            <div className="form-group">
                <label>Name</label>
                <input
                    type="text"
                    className="form-control"
                    value={patient.name}
                    onChange={(e) => setPatient({ ...patient, name: e.target.value })}
                />
            </div>
            <div className="form-group">
                <label>Birthdate</label>
                <input
                    type="date"
                    className="form-control"
                    value={patient.birthdate}
                    onChange={(e) => setPatient({ ...patient, birthdate: e.target.value })}
                />
            </div>
            <div className="form-group">
                <label>Address</label>
                <input
                    type="text"
                    className="form-control"
                    value={patient.address}
                    onChange={(e) => setPatient({ ...patient, address: e.target.value })}
                />
            </div>
            <div className="form-group">
                <label>Department</label>
                <input
                    type="text"
                    className="form-control"
                    value={patient.department}
                    onChange={(e) => setPatient({ ...patient, department: e.target.value })}
                />
            </div>
            <button className="btn btn-primary" onClick={handleSave}>
                Save Changes
            </button>
        </div>
    );
};

export default EditPatient;
