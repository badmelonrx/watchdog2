import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const getInputTemplates = () => axios.get(`${API_BASE}/templates/input-templates`);
export const validateData = (data) => axios.post(`${API_BASE}/templates/validate`, data);
