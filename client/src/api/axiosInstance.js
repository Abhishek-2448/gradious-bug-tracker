import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach the logged-in user's id to every request.
client.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      config.headers["x-user-id"] = user.id;
    }
  } catch {
    // ignore a corrupted value
  }
  return config;
});

export default client;
