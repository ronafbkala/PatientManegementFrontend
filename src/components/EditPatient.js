import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPatientById, updatePatient } from '../api';

const EditPatient = () => {
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

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPatient({
            ...patient,
            [name]: value
        });
    };

    const handleMedicalRecordChange = (event) => {
        const { name, value } = event.target;
        setPatient({
            ...patient,
            medicalRecord: {
                ...patient.medicalRecord,
                [name]: value
            }
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        updatePatient(id, patient)
            .then(() => {
                navigate(`/patients/${id}`);
            })
            .catch(error => {
                console.error('Error updating patient:', error);
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!patient) {
        return <div>No patient found</div>;
    }

    return (
        <div>
            <h1>Edit Patient</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" name="name" value={patient.name} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Birthdate:
                    <input type="date" name="birthdate" value={patient.birthdate} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Address:
                    <input type="text" name="address" value={patient.address} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Department:
                    <input type="text" name="department" value={patient.department} onChange={handleChange} required />
                </label>
                <h2>Medical Record</h2>
                <label>
                    Details:
                    <input type="text" name="details" value={patient.medicalRecord.details} onChange={handleMedicalRecordChange} required />
                </label>
                <br />
                <label>
                    Diagnosis:
                    <input type="text" name="diagnosis" value={patient.medicalRecord.diagnosis} onChange={handleMedicalRecordChange} required />
                </label>
                <br />
                <label>
                    Treatment Plan:
                    <input type="text" name="treatmentPlan" value={patient.medicalRecord.treatmentPlan} onChange={handleMedicalRecordChange} required />
                </label>
                <br />
                <label>
                    Last Visit Date:
                    <input type="date" name="lastVisitDate" value={patient.medicalRecord.lastVisitDate} onChange={handleMedicalRecordChange} required />
                </label>
                <br />
                <label>
                    Physician Name:
                    <input type="text" name="physicianName" value={patient.medicalRecord.physicianName} onChange={handleMedicalRecordChange} required />
                </label>
                <br />
                <label>
                    Medications:
                    <input type="text" name="medications" value={patient.medicalRecord.medications} onChange={handleMedicalRecordChange} required />
                </label>
                <br />
                <label>
                    Allergies:
                    <input type="text" name="allergies" value={patient.medicalRecord.allergies} onChange={handleMedicalRecordChange} required />
                </label>
                <br />
                <label>
                    Test Results:
                    <input type="text" name="testResults" value={patient.medicalRecord.testResults} onChange={handleMedicalRecordChange} required />
                </label>
                <br />
                <button type="submit">Update Patient</button>
            </form>
        </div>
    );
};

export default EditPatient;
