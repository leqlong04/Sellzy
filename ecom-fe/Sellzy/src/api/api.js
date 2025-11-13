import axios from "axios";

const baseUrlFromEnv = import.meta.env.VITE_BACK_END_URL;
const resolvedBaseUrl = (baseUrlFromEnv && String(baseUrlFromEnv).trim().length > 0)
  ? `${baseUrlFromEnv}/api`
  : "http://localhost:8080/api";

const api = axios.create({
  baseURL: resolvedBaseUrl,
  withCredentials: true,
});


export default api;