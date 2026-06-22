import axios from "axios";

const api = axios.create({
  baseURL: "https://travel-planner-backend-now0.onrender.com/api",
});

export default api;
