import axios from "axios";

const trimTrailingSlash = (value) =>
  String(value || "").trim().replace(/\/+$/, "");

const configuredApiUrl = trimTrailingSlash(process.env.NEXT_PUBLIC_API_URL);
const isLocalBrowser =
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname);
const apiUrl = isLocalBrowser
  ? "http://localhost:5000/api"
  : configuredApiUrl || "/api";

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
  timeout: 120000,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ERR_NETWORK" && typeof window !== "undefined") {
      error.userMessage =
        "Cannot connect to the backend. Check that the server is running or that NEXT_PUBLIC_API_URL is correct.";
    }

    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      const currentPath = window.location.pathname;
      if (currentPath !== "/login" && currentPath !== "/register") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
