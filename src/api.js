import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8083/api',
});

const PolicyApi = axios.create({
    baseURL: 'http://localhost:8082/api',
});

export const getPatients = () => api.get('/patients/getAllPatients');
export const getPatientById = (id) => api.get(`/patients/getPatientById/${id}`);
export const createPatient = (patient) => api.post('/patients/create', patient);
export const updatePatient = (id, patient) => api.put(`/patients/update/${id}`, patient);
export const deletePatient = (id) => api.delete(`/patients/delete/${id}`);

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
export const evaluateUserToPermission = (userId, request) =>
    PolicyApi.post(`/policies/evaluate-permission`, request, { params: { userId } });

// UserService API calls
export const getUsers = () => PolicyApi.get('/users');
export const getUserById = (id) => PolicyApi.get(`/users/${id}`);