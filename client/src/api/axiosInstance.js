import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

client.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      config.headers["x-user-id"] = user.id;
    }
  } catch {
  }
  return config;
});

export default client;
