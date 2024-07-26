import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import PatientList from './components/PatientList';
import PatientDetails from './components/PatientDetails';
import AddPatient from './components/AddPatient';
import EditPatient from './components/EditPatient';

import PolicyList from './components/PolicyList';
import AddPolicy from './components/AddPolicy';
import EditPolicy from './components/EditPolicy';
import PolicyDetails from './components/PolicyDetails';
import EvaluateRole from './components/EvaluateRole';
import EvaluatePermission from './components/EvaluatePermission';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/patients" element={<PatientList />} />
                <Route path="/patients/new" element={<AddPatient />} />
                <Route path="/patients/:id" element={<PatientDetails />} />
                <Route path="/patients/:id/edit" element={<EditPatient />} />

                <Route path="/policies" element={<PolicyList />} />
                <Route path="/policies" element={<PolicyList />} />
                <Route path="/policies/new" element={<AddPolicy />} />
                <Route path="/policies/:id" element={<PolicyDetails />} />
                <Route path="/policies/:id/edit" element={<EditPolicy />} />
                <Route path="/evaluate-role" element={<EvaluateRole />} />
                <Route path="/evaluate-permission" element={<EvaluatePermission />} />
            </Routes>
        </Router>
    );
};

export default App;
