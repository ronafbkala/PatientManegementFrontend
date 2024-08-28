import React, {useEffect, useMemo, useState} from 'react';
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import Keycloak from 'keycloak-js';
import {logoutUser, getUsers, getAllPolicies, getPatients} from './api';
import Home from './components/Home';
import Login from './components/Login';
import LoginDB from './components/LoginDB';
import ConditionVerification from "./components/ConditionVerification";
import Header from './components/Header';
import Footer from './components/Footer';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

// Import the DataOwner pages
import Dashboard from './Pages/DataOwner/Dashboard'; // Adjusted path to where Dashboard is
import PatientList from './Pages/DataOwner/Patient/PatientList';
import PatientDetails from './Pages/DataOwner/Patient/PatientDetails';
import AddPatient from './Pages/DataOwner/Patient/AddPatient';
import EditPatient from './Pages/DataOwner/Patient/EditPatient';
import PolicyList from './Pages/DataOwner/Policy/PolicyList';
import AddPolicy from './Pages/DataOwner/Policy/AddPolicy';
import EditPolicy from './Pages/DataOwner/Policy/EditPolicy';
import PolicyDetails from './Pages/DataOwner/Policy/PolicyDetails';
import EvaluateRole from './Pages/DataOwner/Policy/EvaluateRole';
import EvaluatePermission from './Pages/DataOwner/Policy/EvaluatePermission';
import UserList from './Pages/DataOwner/User/UserList';
import UserDetails from './Pages/DataOwner/User/UserDetails';
import AddUser from './Pages/DataOwner/User/AddUser';
import EditUser from './Pages/DataOwner/User/EditUser';
import AddRole from './Pages/DataOwner/Role/AddRole';
import RoleList from './Pages/DataOwner/Role/RoleList';
import EditRole from './Pages/DataOwner/Role/EditRole';
import RoleDetails from './Pages/DataOwner/Role/RoleDetails';

// Import the Staff pages
import StaffDashboard from './Pages/Staff/StaffDashboard';
import StaffPatientList from './Pages/Staff/PatientList';
import StaffPatientDetails from './Pages/Staff/PatientDetails';
import StaffEditPatient from './Pages/Staff/EditPatient';

// Import the Patient pages
import PatientDashboard from './Pages/Patient/PatientDashboard';

import PatientInfoDetails from "./Pages/Patient/PatientInfoDetails";
import EditPatientInfo from "./Pages/Patient/EditPatientInfo";

const keycloakConfig = {
    url: 'http://localhost:8180',
    realm: 'healthSystem',
    clientId: 'healthSystemClient',
};

const App = () => {
    const [keycloak, setKeycloak] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [permission, setPermission] = useState(null);
    const [userRole, setUserRole] = useState(''); // State to store the user role
    const [policies, setPolicies] = useState([]); // Store policies for the user
    const [conditionsVerified, setConditionsVerified] = useState(false);
    const [patientId, setPatientId] = useState(null); // Add state for patient ID


    const keycloakInstance = useMemo(() => new Keycloak(keycloakConfig), []);

    useEffect(() => {
        keycloakInstance.init({ onLoad: 'login-required' }).then(authenticated => {
            setKeycloak(keycloakInstance);
            setAuthenticated(authenticated);

            if (authenticated) {
                localStorage.setItem('access_token', keycloakInstance.token);
                localStorage.setItem('refresh_token', keycloakInstance.refreshToken);
                setUsername(keycloakInstance.tokenParsed?.preferred_username || "Guest");

                getUsers().then(response => {
                    const keycloakUsername = keycloakInstance.tokenParsed?.preferred_username.trim().toLowerCase();
                    const currentUser = response.data.find(user => {
                        const backendUsername = user.username.replace(/\s+/g, '').trim().toLowerCase();
                        return backendUsername === keycloakUsername;
                    });

                    if (currentUser) {
                        const role = currentUser.roles.length > 0 ? currentUser.roles[0].name : null;
                        setUserRole(role);
                        console.log('Logged in user role:', role);

                        getAllPolicies().then(policyResponse => {
                            const allPolicies = policyResponse.data;
                            const relevantPolicies = allPolicies.filter(policy => {
                                const conditions = policy.condition.split(' AND ');
                                return conditions.some(cond => {
                                    const [key, value] = cond.split('=').map(s => s.trim().toLowerCase());
                                    return key === 'user' && currentUser.username.trim().toLowerCase() === value;
                                });
                            });
                            setPolicies(relevantPolicies);
                        }).catch(error => {
                            console.error('Error fetching policies:', error);
                        });

                        //------------------------
                        if (role === 'Patient') {
                            getPatients().then(patientResponse => {
                                const matchingPatient = patientResponse.data.find(patient => {
                                    console.log("Patient Name:", patient.name.trim().replace(/\s+/g, '').toLowerCase());
                                    console.log("Current User Name:", currentUser.username.trim().replace(/\s+/g, '').toLowerCase());

                                    return (
                                        patient.name.trim().replace(/\s+/g, '').toLowerCase() === currentUser.username.trim().replace(/\s+/g, '').toLowerCase()
                                    );
                                });

                                if (matchingPatient) {
                                    setPatientId(matchingPatient.id); // Store the patient's ID
                                    console.log("Matching patient found:", matchingPatient);
                                } else {
                                    console.error('No matching patient found');
                                }
                            }).catch(error => {
                                console.error('Error fetching patients:', error);
                            });
                        }


                    } else {
                        console.warn('User not found in the system.');
                    }
                }).catch(error => {
                    console.error('Error fetching users:', error);
                });

            } else {
                setAuthenticated(false);
            }


            console.log('Authenticated:', authenticated);
            console.log('Access Token:', keycloakInstance.token);
            setLoading(false);
        }).catch(error => {
            console.error('Failed to initialize Keycloak:', error);
            setAuthenticated(false);
            setLoading(false);
        });
    }, [keycloakInstance]);

    const handleLogout = (navigate) => {
        if (keycloak) {
            keycloak.logout({
                redirectUri: window.location.origin + '/logindb'
            }).then(() => {
                setAuthenticated(false);
                setUsername('');
                setUserRole('');
                localStorage.clear();
                navigate('/logindb');
            }).catch(error => {
                console.error('Keycloak logout failed:', error);
            });
        } else {
            logoutUser()
                .then(() => {
                    setAuthenticated(false);
                    setUsername('');
                    setUserRole('');
                    localStorage.clear();
                    navigate('/logindb');
                })
                .catch(error => {
                    console.error('Logout failed:', error);
                });
        }
    };

    const handlePermissionEvaluated = (evaluatedPermission) => {
        if (userRole !== 'DataOwner') {
            setPermission(evaluatedPermission);
        } else {
            setPermission('Unlimited Access');
        }
        setConditionsVerified(true);
    };

    if (loading || !keycloak) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <Header username={username} onLogout={handleLogout} />
            <div className="main-content">
                <Routes>
                    {!conditionsVerified && userRole !== 'DataOwner' ? (
                        <Route path="/*" element={
                            <ConditionVerification
                                keycloak={keycloak}
                                policies={policies}
                                onConditionsVerified={handlePermissionEvaluated}
                            />
                        } />
                    ) : (
                        <>
                            <Route path="/" element={
                                authenticated
                                    ? (userRole === 'DataOwner'
                                            ? <Navigate to="/dataowner/dashboard" />
                                            : ['Doctor', 'Nurse', 'Staff'].includes(userRole)
                                                ? <Navigate to="/staff/dashboard" />
                                                : userRole === 'Patient'
                                                    ? <Navigate to="/patient/dashboard" />
                                            : <Home userRole={userRole} />
                                    )
                                    : <Navigate to="/login" />
                            } />

                            {authenticated && userRole === 'DataOwner' ? (
                                <>
                                    <Route path="/dataowner/dashboard" element={<Dashboard />} />
                                    <Route path="/dataowner/patient" element={<PatientList />} />
                                    <Route path="/dataowner/patient/new" element={<AddPatient />} />
                                    <Route path="/dataowner/patient/:id" element={<PatientDetails />} />
                                    <Route path="/dataowner/patient/:id/edit" element={<EditPatient />} />

                                    <Route path="/dataowner/policy" element={<PolicyList />} />
                                    <Route path="/dataowner/policy/new" element={<AddPolicy />} />
                                    <Route path="/dataowner/policy/:id" element={<PolicyDetails />} />
                                    <Route path="/dataowner/policy/:id/edit" element={<EditPolicy />} />

                                    <Route path="/evaluate-role" element={<EvaluateRole />} />
                                    <Route path="/evaluate-permission" element={<EvaluatePermission onPermissionEvaluated={handlePermissionEvaluated} />} />

                                    <Route path="/dataowner/user" element={<UserList />} />
                                    <Route path="/dataowner/user/new" element={<AddUser />} />
                                    <Route path="/dataowner/user/:id" element={<UserDetails />} />
                                    <Route path="/dataowner/user/:id/edit" element={<EditUser />} />

                                    <Route path="/dataowner/role" element={<RoleList />} />
                                    <Route path="/dataowner/role/new" element={<AddRole />} />
                                    <Route path="/dataowner/role/:id" element={<RoleDetails />} />
                                    <Route path="/dataowner/role/:id/edit" element={<EditRole />} />
                                </>
                            ) : authenticated && ['Doctor', 'Nurse', 'Staff'].includes(userRole) ? (
                                <>
                                    <Route path="/staff/dashboard" element={<StaffDashboard />} />
                                    <Route path="/staff/patients" element={<StaffPatientList />} />
                                    <Route path="/staff/patients/:id" element={<StaffPatientDetails permission={permission} />} />
                                    <Route path="/staff/patients/:id/edit" element={<StaffEditPatient permission={permission} />} />

                                </>
                            ) : authenticated && userRole === 'Patient' && (
                                    <>
                                        <Route path="/patient/dashboard" element={<PatientDashboard patientId={patientId}/>} />
                                        <Route path="/patient/details" element={<PatientInfoDetails patientId={patientId} />} />
                                        <Route path="/patient/edit/:patientId" element={<EditPatientInfo />} />

                                    </>
                            )}

                            <Route path="/login" element={<Login />} />
                            <Route path="/logindb" element={<LoginDB onLogin={(name) => setUsername(name)} />} />
                        </>
                    )}
                </Routes>
            </div>
            <Footer />
        </Router>
    );
};

export default App;



