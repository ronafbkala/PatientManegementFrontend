import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPatientById, deletePatient } from '../api';

const PatientDetails = ({ permission }) => {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Correctly import and use useNavigate

    // Log the incoming permission prop
    console.log('PatientDetails component rendered with permission:', permission);



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

    const handleDelete = () => {
        deletePatient(id)
            .then(() => {
                navigate('/patients');
            })
            .catch(error => {
                console.error('Error deleting patient:', error);
                setError('Error deleting patient');
            });
    };
    useEffect(() => {
        if (permission === null) {
            // Redirect the user or show an error message if no permission is granted
            console.error("No valid permission found");
            navigate('/error-page'); // Or any other handling you prefer
        }
    }, [permission]);

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
        <div className="container">
            <h1>Patient Details</h1>
            <div className="card">
                <div className="card-header">Personal Information</div>
                <div className="card-body">
                    <div className="patient-details">
                        <strong>Name:</strong> {patient.name}
                    </div>
                    <div className="patient-details">
                        <strong>Birthdate:</strong> {patient.birthdate}
                    </div>
                    <div className="patient-details">
                        <strong>Address:</strong> {patient.address}
                    </div>
                    <div className="patient-details">
                        <strong>Department:</strong> {patient.department}
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-header">Medical Record</div>
                <div className="card-body">
                    {patient.medicalRecord ? (
                        <div className="medical-record">
                            <div>
                                <strong>Details:</strong> {patient.medicalRecord.details}
                            </div>
                            <div>
                                <strong>Diagnosis:</strong> {patient.medicalRecord.diagnosis}
                            </div>
                            <div>
                                <strong>Treatment Plan:</strong> {patient.medicalRecord.treatmentPlan}
                            </div>
                            <div>
                                <strong>Last Visit Date:</strong> {patient.medicalRecord.lastVisitDate}
                            </div>
                            <div>
                                <strong>Physician Name:</strong> {patient.medicalRecord.physicianName}
                            </div>
                            <div>
                                <strong>Medications:</strong> {patient.medicalRecord.medications}
                            </div>
                            <div>
                                <strong>Allergies:</strong> {patient.medicalRecord.allergies}
                            </div>
                            <div>
                                <strong>Test Results:</strong> {patient.medicalRecord.testResults}
                            </div>
                        </div>
                    ) : (
                        <div>No medical record found</div>
                    )}
                </div>
            </div>
            {/* Conditionally render edit and delete options based on permission */}
            {['Read, Write', 'Unlimited Access'].includes(permission) ? (
                <Link to={`/patients/${patient.id}/edit`} className="btn btn-primary">
                    Edit Patient
                </Link>
            ) : console.log('Edit button not shown. Permission:', permission)}

            {permission === 'Unlimited Access' ? (
                <button onClick={handleDelete} className="btn btn-danger">
                    Remove Patient
                </button>
            ) : console.log('Delete button not shown. Permission:', permission)}

            {permission === 'Read' && (
                <p>You have read-only access to this patient's details.</p>
            )}
        </div>
    );
};

export default PatientDetails;


