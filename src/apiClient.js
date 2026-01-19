import axios from "axios";

// Node chat backend API
const NODE_API_BASE_URL = "http://172.20.10.2:4000/api"; // 👈 change IP

const api = axios.create({
  baseURL: NODE_API_BASE_URL,
});

export default api;
