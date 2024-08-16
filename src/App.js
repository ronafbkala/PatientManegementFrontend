/*import React from 'react';
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

import UserList from './components/UserList';
import UserDetails from './components/UserDetails';
import AddUser from './components/AddUser';
import EditUser from './components/EditUser';

import Login from './components/Login';



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

                <Route path="/users" element={<UserList />} />
                <Route path="/users/:id" element={<UserDetails />} />
                <Route path="/addUser" element={<AddUser />} />
                <Route path="/editUser/:id" element={<EditUser />} />

                <Route path="/login" element={<Login />} />

            </Routes>
        </Router>
    );
};

export default App;


 */

import React, {useEffect, useMemo, useState} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Keycloak from 'keycloak-js';
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
import UserList from './components/UserList';
import UserDetails from './components/UserDetails';
import AddUser from './components/AddUser';
import EditUser from './components/EditUser';
import Login from './components/Login';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

const keycloakConfig = {
    url: 'http://localhost:8180',
    realm: 'healthSystem',
    clientId: 'healthSystemClient',
};

const App = () => {
    const [keycloak, setKeycloak] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    //const keycloakInstance = new Keycloak(keycloakConfig);
    const keycloakInstance = useMemo(() => new Keycloak(keycloakConfig), []);

    useEffect(() => {

        keycloakInstance.init({ onLoad: 'login-required' }).then(authenticated => {
            setKeycloak(keycloakInstance);
            setAuthenticated(authenticated);

            if (authenticated) {
                localStorage.setItem('access_token', keycloakInstance.token);
                localStorage.setItem('refresh_token', keycloakInstance.refreshToken);
                console.log('Authenticated:', authenticated);
                console.log('Access Token:', keycloakInstance.token);
            } else {
                console.log('Not authenticated, redirecting to login.');
                setAuthenticated(false);
            }

            setLoading(false); // Stop loading once authentication is checked
        }).catch(error => {
            console.error('Failed to initialize Keycloak:', error);
            setAuthenticated(false);
            setLoading(false);
        });
    }, [keycloakInstance]);

    if (loading || !keycloak) {
        return <div>Loading...</div>; // Display a loading state while Keycloak is initializing
    }
    return (
        <Router>
            <Routes>
                <Route path="/" element={authenticated ? <Home /> : <Navigate to="/login" />} />
                <Route path="/patients" element={authenticated ? <PatientList /> : <Navigate to="/login" />} />
                <Route path="/patients/new" element={authenticated ? <AddPatient /> : <Navigate to="/login" />} />
                <Route path="/patients/:id" element={authenticated ? <PatientDetails /> : <Navigate to="/login" />} />
                <Route path="/patients/:id/edit" element={authenticated ? <EditPatient /> : <Navigate to="/login" />} />

                <Route path="/policies" element={authenticated ? <PolicyList /> : <Navigate to="/login" />} />
                <Route path="/policies/new" element={authenticated ? <AddPolicy /> : <Navigate to="/login" />} />
                <Route path="/policies/:id" element={authenticated ? <PolicyDetails /> : <Navigate to="/login" />} />
                <Route path="/policies/:id/edit" element={authenticated ? <EditPolicy /> : <Navigate to="/login" />} />
                <Route path="/evaluate-role" element={authenticated ? <EvaluateRole /> : <Navigate to="/login" />} />
                <Route path="/evaluate-permission" element={authenticated ? <EvaluatePermission /> : <Navigate to="/login" />} />

                <Route path="/users" element={authenticated ? <UserList /> : <Navigate to="/login" />} />
                <Route path="/users/:id" element={authenticated ? <UserDetails /> : <Navigate to="/login" />} />
                <Route path="/addUser" element={authenticated ? <AddUser /> : <Navigate to="/login" />} />
                <Route path="/editUser/:id" element={authenticated ? <EditUser /> : <Navigate to="/login" />} />

                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
};

export default App;