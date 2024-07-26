import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPatients } from '../api';
import '../styles.css';

const PatientList = () => {
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        getPatients()
            .then(response => {
                setPatients(response.data);
            })
            .catch(error => {
                console.error('Error fetching patients:', error);
            });
    }, []);

    return (
        <div>
            <h1 className="heading">Patients</h1>
            <ul className="patient-list">
                {patients.map(patient => (
                    <li key={patient.id}>
                        <Link to={`/patients/${patient.id}`} className="nav-link">{patient.name}</Link>
                    </li>
                ))}
            </ul>
            <Link to="/patients/new" className="nav-link">Add New Patient</Link>
        </div>
    );
};

export default PatientList;
