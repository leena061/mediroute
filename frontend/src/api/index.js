import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// Attach token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

// Triage
export const predictDisease = (data) => API.post("/triage/predict", data);
export const getHistory = () => API.get("/triage/history");

// Facilities
export const getNearbyFacilities = (lat, lng) =>
  API.get(`/facilities/nearby?lat=${lat}&lng=${lng}`);