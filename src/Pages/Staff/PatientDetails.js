import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPatientById } from '../../api';

const PatientDetails = ({ permission }) => {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            {['Read, Write', 'Unlimited Access'].includes(permission) && (
                <Link to={`/staff/patients/${patient.id}/edit`} className="btn btn-primary">
                    Edit Patient
                </Link>
            )}
        </div>
    );
};

export default PatientDetails;
