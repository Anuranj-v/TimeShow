import axios from "axios";

export const BASE_URL = import.meta.env.VITE_API_URL || "https://timeshow.onrender.com";

const api = axios.create({
  baseURL: BASE_URL.endsWith("/") ? BASE_URL : `${BASE_URL}/`,
});

export const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const base = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;
  return `${base}${cleanPath}`;
};

export default api;
