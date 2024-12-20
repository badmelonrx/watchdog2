import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const getAllItems = () => axios.get(`${API_BASE}/inventory`);
export const getItemById = (id) => axios.get(`${API_BASE}/inventory/${id}`);
export const postItem = (data) => axios.post(`${API_BASE}/inventory`, data);
export const putItem = (id, data) => axios.put(`${API_BASE}/inventory/${id}`, data);
export const deleteItem = (id) => axios.delete(`${API_BASE}/inventory/${id}`);
export const deleteItems = (ids) => axios.delete(`${API_BASE}/inventory`, { data: { ids } });
