import axios from 'axios';

// LƯU Ý: Thay IP này bằng IP máy tính của bạn (ipconfig)
const BASE_URL = 'http://172.16.43.0:5000/api/patients';

export const getPatients = () => axios.get(BASE_URL);
export const createPatient = (data) => axios.post(BASE_URL, data);
export const updatePatient = (id, data) => axios.put(`${BASE_URL}/${id}`, data);
export const deletePatient = (id) => axios.delete(`${BASE_URL}/${id}`);