import React, {useEffect, useMemo, useState} from 'react';
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import Keycloak from 'keycloak-js';
import { logoutUser, getUsers, getAllPolicies } from './api';
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
import AddRole from './components/AddRole';
import RoleList from './components/RoleList';
import EditRole from './components/EditRole';
import RoleDetails from "./components/RoleDetails";
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import LoginDB from './components/LoginDB';


import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import ConditionVerification from "./components/ConditionVerification";


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




    const keycloakInstance = useMemo(() => new Keycloak(keycloakConfig), []);
    useEffect(() => {

        keycloakInstance.init({ onLoad: 'login-required' }).then(authenticated => {
            setKeycloak(keycloakInstance);
            setAuthenticated(authenticated);

            if (authenticated) {
                localStorage.setItem('access_token', keycloakInstance.token);
                localStorage.setItem('refresh_token', keycloakInstance.refreshToken);
                setUsername(keycloakInstance.tokenParsed?.preferred_username || "Guest");

                // Fetch all users and find the logged-in user's role
                getUsers().then(response => {
                    console.log('All users from backend:', response.data); // Debug: Log all users fetched from backend

                    const keycloakUsername = keycloakInstance.tokenParsed?.preferred_username.trim().toLowerCase();
                    console.log('Keycloak username:', keycloakUsername);

                    const currentUser = response.data.find(user => {
                        const backendUsername = user.username.replace(/\s+/g, '').trim().toLowerCase(); // Remove spaces from backend username
                        console.log(`Comparing backend username: ${backendUsername} with Keycloak username: ${keycloakUsername}`);
                        return backendUsername === keycloakUsername;
                    });

                    if (currentUser) {
                        console.log('Current user object:', currentUser); // Log the full user object
                        const role = currentUser.roles.length > 0 ? currentUser.roles[0].name : null;

                        setUserRole(role); // Set the role of the logged-in user
                        console.log('User role:', role); // Debug: Log the role

                        /*
                        // Fetch policies and set permission based on matching username
                        getAllPolicies().then(policyResponse => {
                            const policies = policyResponse.data;

                            // Match only on the username
                            const matchingPolicy = policies.find(policy => {
                                const conditions = policy.condition.split(' AND ');
                                return conditions.some(cond => {
                                    const [key, value] = cond.split('=').map(s => s.trim().toLowerCase());
                                    return key === 'user' && currentUser.username.trim().toLowerCase() === value;
                                });
                            });

                            if (matchingPolicy) {
                                setPermission(matchingPolicy.action);
                                console.log('Permission assigned based on policy:', matchingPolicy.action);
                            } else {
                                console.warn('No matching policy found for the current user.');
                            }
                        }).catch(error => {
                            console.error('Error fetching policies:', error);
                        });


                         */

                        // Fetch policies and filter the ones relevant to the logged-in user
                        getAllPolicies().then(policyResponse => {
                            const allPolicies = policyResponse.data;
                            const relevantPolicies = allPolicies.filter(policy => {
                                const conditions = policy.condition.split(' AND ');
                                return conditions.some(cond => {
                                    const [key, value] = cond.split('=').map(s => s.trim().toLowerCase());
                                    return key === 'user' && currentUser.username.trim().toLowerCase() === value;
                                });
                            });

                            console.log('Here is the Policy!!!!');

                            setPolicies(relevantPolicies);


                        }).catch(error => {
                            console.error('Error fetching policies:', error);
                        });



                    } else {
                        console.warn('User not found in the system.');
                    }
                }).catch(error => {
                    console.error('Error fetching users:', error);
                });


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



    const handleLogout = (navigate) => {
        if (keycloak) {
            keycloak.logout({
                redirectUri: window.location.origin + '/logindb'  // Redirect to your custom login page after logout
            }).then(() => {
                // Clear local state and storage after successful logout
                setAuthenticated(false);
                setUsername(''); // Clear the username
                setUserRole(''); // Clear the user role
                localStorage.clear(); // Clear tokens or any stored data
                navigate('/logindb'); // Navigate to the login page
            }).catch(error => {
                console.error('Keycloak logout failed:', error);
                // Optionally, handle errors (e.g., display a notification)
            });
        } else {
            // Fallback if Keycloak is not initialized or available
            logoutUser()
                .then(response => {
                    console.log('Logout successful:', response);
                    setAuthenticated(false);
                    setUsername(''); // Clear the username
                    setUserRole(''); // Clear the user role
                    localStorage.clear(); // Clear tokens or any stored data
                    navigate('/logindb'); // Navigate to the login page
                })
                .catch(error => {
                    console.error('Logout failed:', error);
                    // Optionally, handle errors (e.g., display a notification)
                });
        }
    };

    const handlePermissionEvaluated = (evaluatedPermission) => {
        if (userRole !== 'DataOwner') {
            setPermission(evaluatedPermission);
        } else {
            // For DataOwner, keep the original permission
            setPermission('Unlimited Access');
        }
        console.log('Permission updated in App.js:', evaluatedPermission);
        setConditionsVerified(true); // Mark conditions as verified

    };

    if (permission !== null) {
        console.log('Permission updated in App.js:', permission);
    }else {
        console.log('Permission:', permission);
    }




    if (loading || !keycloak) {
        return <div>Loading...</div>; // Display a loading state while Keycloak is initializing
    }


    return (
        <Router>
            <Header username={username} onLogout={handleLogout} />  {/* Include Header component */}
            <div className="main-content">
                <Routes>
                    {!conditionsVerified && userRole !== 'DataOwner' ? (
                        <Route path="/*" element={
                            <ConditionVerification
                                keycloak={keycloak} // Pass keycloak instance here
                                policies={policies}
                                onConditionsVerified={handlePermissionEvaluated}
                            />
                        } />
                    ) : (
                        <>
                    <Route path="/" element={authenticated ? <Home userRole={userRole}/> : <Navigate to="/login" />} />



                    {/* Conditionally render routes based on the user role */}
                    {userRole === 'DataOwner' ? (
                        console.log("Rendering DataOwner Routes"),
                        <>
                            <Route path="/patients" element={authenticated ? <PatientList /> : <Navigate to="/login" />} />
                            <Route path="/patients/new" element={authenticated ? <AddPatient /> : <Navigate to="/login" />} />
                            <Route path="/patients/:id" element={authenticated ? <PatientDetails permission={permission}/> : <Navigate to="/login" />} />
                            <Route path="/patients/:id/edit" element={authenticated ? <EditPatient permission={permission}/> : <Navigate to="/login" />} />

                            <Route path="/policies" element={authenticated ? <PolicyList /> : <Navigate to="/login" />} />
                            <Route path="/policies/new" element={authenticated ? <AddPolicy /> : <Navigate to="/login" />} />
                            <Route path="/policies/:id" element={authenticated ? <PolicyDetails /> : <Navigate to="/login" />} />
                            <Route path="/policies/:id/edit" element={authenticated ? <EditPolicy /> : <Navigate to="/login" />} />
                            <Route path="/evaluate-role" element={authenticated ? <EvaluateRole /> : <Navigate to="/login" />} />

                            <Route path="/evaluate-permission" element={authenticated ? <EvaluatePermission onPermissionEvaluated={handlePermissionEvaluated}/> : <Navigate to="/login" />} />




                            <Route path="/users" element={authenticated ? <UserList /> : <Navigate to="/login" />} />
                            <Route path="/users/:id" element={authenticated ? <UserDetails /> : <Navigate to="/login" />} />
                            <Route path="/users/new" element={authenticated ? <AddUser /> : <Navigate to="/login" />} />
                            <Route path="/users/:id/edit" element={authenticated ? <EditUser /> : <Navigate to="/login" />} />

                            <Route path="/roles" element={authenticated ? <RoleList /> : <Navigate to="/login" />} />
                            <Route path="/roles/:id" element={authenticated ? <RoleDetails /> : <Navigate to="/login" />} />
                            <Route path="/roles/new" element={authenticated ? <AddRole /> : <Navigate to="/login" />} />
                            <Route path="/roles/:id/edit" element={authenticated ? <EditRole /> : <Navigate to="/login" />} />
                        </>
                    ) : (
                        console.log("Rendering Other Role Routes"),
                        <>
                            <Route path="/patients" element={authenticated ? <PatientList /> : <Navigate to="/login" />} />
                            <Route path="/patients/:id" element={authenticated ? <PatientDetails permission={permission}/> : <Navigate to="/login" />} />
                            <Route path="/patients/:id/edit" element={authenticated ? <EditPatient permission={permission}/> : <Navigate to="/login" />} />
                        </>
                    )}

                    <Route path="/login" element={<Login />} />
                    <Route path="/logindb" element={<LoginDB onLogin={(name) => setUsername(name)}/>} />
                        </>
                    )}
                </Routes>
            </div>
            <Footer />  {/* Include Footer component */}
        </Router>
    );
};

export default App;
