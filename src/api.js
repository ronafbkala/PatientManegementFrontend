import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8083/api',
});

const PolicyApi = axios.create({
    baseURL: 'http://localhost:8082/api',
});

const UserApi = axios.create({
    baseURL: 'http://localhost:8081/api',
});

/*
// Interceptor to add the authentication token to each request
const attachTokenToRequests = (apiInstance) => {
    apiInstance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('access_token');  // Assuming the token is stored in localStorage
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
};

// Attach the token interceptor to each API instance
attachTokenToRequests(api);
attachTokenToRequests(PolicyApi);
attachTokenToRequests(UserApi);

 */
// Interceptor to add the authentication token to each request
const attachTokenToRequests = (apiInstance) => {
    apiInstance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('access_token');  // Assuming the token is stored in localStorage
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
};

// Attach the token interceptor to each API instance
attachTokenToRequests(api);
attachTokenToRequests(PolicyApi);
attachTokenToRequests(UserApi);

export const getPatients = () => api.get('/patients/getAllPatients');
export const getPatientById = (id) => api.get(`/patients/getPatientById/${id}`);
export const createPatient = (patient) => api.post('/patients/create', patient);
export const updatePatient = (id, patient) => api.put(`/patients/update/${id}`, patient);
export const deletePatient = (id) => api.delete(`/patients/delete/${id}`);

export const getMedicalRecordById = (id) => api.get(`/medical-records/${id}`);


/*export const getMedicalRecords = () => api.get('/medical-records/getAll');
export const getMedicalRecordById = (id) => api.get(`/medical-records/${id}`);
export const createMedicalRecord = (record) => api.post('/medical-records/create', record);
//export const createMedicalRecordForPatient = (patientId, record) => api.post(`/patients/getPatientById/${id}/medical-record/create`, record);
export const createMedicalRecordForPatient = (patientId, record) => api.post(`/patients/${patientId}/medical-record`, record);

export const updateMedicalRecord = (id, record) => api.put(`/medical-records//update/${id}`, record);
export const deleteMedicalRecord = (id) => api.delete(`/medical-records/delete/${id}`);*/


// Policy API Calls
export const getAllPolicies = () => PolicyApi.get('/policies/getAll');
export const getPolicyById = (id) => PolicyApi.get(`/policies/getPolicyById/${id}`);
export const createPolicy = (policy) => PolicyApi.post('/policies/create', policy);
export const updatePolicy = (id, policy) => PolicyApi.put(`/policies/update/${id}`, policy);
export const deletePolicy = (id) => PolicyApi.delete(`/policies/delete/${id}`);

// Policy Evaluation API Calls
export const evaluateUserToRole = (userId, environmentAttributes) =>
    PolicyApi.post(`/policies/evaluate-role`, environmentAttributes, { params: { userId } });
//export const evaluateUserToPermission = (userId, request) =>
    //PolicyApi.post(`/policies/evaluate-permission`, request, { params: { userId } });

export const evaluateUserToPermission = async (userId, request) => {
    try {
        const token = localStorage.getItem('access_token');
        const response = await PolicyApi.post(
            `/policies/evaluate-permission`,
            request,
            {
                params: { userId },
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log('Evaluate Permission Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error in evaluateUserToPermission:', error.response || error.message || error);
        throw error; // Re-throw the error to be handled by the calling function
    }
};

// User Management API Calls
export const getUsers = () => UserApi.get('/user/getAllUsers');
export const getUserById = (id) => UserApi.get(`/user/${id}`);
export const createUser = (user) => UserApi.post('/user/create', user);
export const updateUser = (id, user) => UserApi.put(`/user/update/${id}`, user);
export const deleteUser = (id) => UserApi.delete(`/user/delete/${id}`);
export const authenticateUser = (credentials) => UserApi.post('/user/auth/login', credentials);
export const logoutUser = () => UserApi.post('/user/logout');
export const getUserInfo = () => UserApi.get('/user/info');

export const getRoles = () => UserApi.get('/roles/getAllRoles');
export const getRoleById = (id) => UserApi.get(`/roles/getRoleById/${id}`);
export const createRole = (role) => UserApi.post('/roles/create', role);
export const updateRole = (id, role) => UserApi.put(`/roles/update/${id}`, role);
export const deleteRole = (id) => UserApi.delete(`/roles/delete/${id}`);