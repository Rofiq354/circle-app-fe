import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.BACK_END_URL}/api/v1`,
  withCredentials: true,
});

export default api;
