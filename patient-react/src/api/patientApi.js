import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/patients",
});

export const getPatients = () => API.get("/");
export const createPatient = (data) => API.post("/", data);
export const updatePatient = (id, data) => API.put(`/${id}`, data);
export const deletePatient = (id) => API.delete(`/${id}`);