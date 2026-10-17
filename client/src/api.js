
import axios from "axios";

const api = axios.create({
  baseURL: "https://timeshow.onrender.com/",
});

export default api;
