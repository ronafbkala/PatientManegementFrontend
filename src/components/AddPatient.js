import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPatient } from '../api';
import '../styles.css';

const AddPatient = () => {
    const [name, setName] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [address, setAddress] = useState('');
    const [department, setDepartment] = useState('');
    const [details, setDetails] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [treatmentPlan, setTreatmentPlan] = useState('');
    const [lastVisitDate, setLastVisitDate] = useState('');
    const [physicianName, setPhysicianName] = useState('');
    const [medications, setMedications] = useState('');
    const [allergies, setAllergies] = useState('');
    const [testResults, setTestResults] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const newPatient = {
            name,
            birthdate,
            address,
            department,
            medicalRecord: {
                details,
                diagnosis,
                treatmentPlan,
                lastVisitDate,
                physicianName,
                medications,
                allergies,
                testResults,
            },
        };
        createPatient(newPatient)
            .then(() => {
                navigate('/patients');
            })
            .catch(error => {
                console.error('Error creating patient:', error);
            });
    };

    return (
        <>
            <div className="overlay"></div>
            <div className="container">
                <h1>Add New Patient</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        Name:
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </label>
                    <label>
                        Birthdate:
                        <input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} required />
                    </label>
                    <label>
                        Address:
                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
                    </label>
                    <label>
                        Department:
                        <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} required />
                    </label>
                    <h2>Medical Record</h2>
                    <label>
                        Details:
                        <input type="text" value={details} onChange={(e) => setDetails(e.target.value)} required />
                    </label>
                    <label>
                        Diagnosis:
                        <input type="text" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} required />
                    </label>
                    <label>
                        Treatment Plan:
                        <input type="text" value={treatmentPlan} onChange={(e) => setTreatmentPlan(e.target.value)} required />
                    </label>
                    <label>
                        Last Visit Date:
                        <input type="date" value={lastVisitDate} onChange={(e) => setLastVisitDate(e.target.value)} required />
                    </label>
                    <label>
                        Physician Name:
                        <input type="text" value={physicianName} onChange={(e) => setPhysicianName(e.target.value)} required />
                    </label>
                    <label>
                        Medications:
                        <input type="text" value={medications} onChange={(e) => setMedications(e.target.value)} required />
                    </label>
                    <label>
                        Allergies:
                        <input type="text" value={allergies} onChange={(e) => setAllergies(e.target.value)} required />
                    </label>
                    <label>
                        Test Results:
                        <input type="text" value={testResults} onChange={(e) => setTestResults(e.target.value)} required />
                    </label>
                    <button type="submit" className="btn btn-primary">Add Patient</button>
                </form>
            </div>
        </>
    );
};

export default AddPatient;



