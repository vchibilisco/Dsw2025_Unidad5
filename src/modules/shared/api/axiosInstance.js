import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    console.log("1. Interceptor ejecutándose para:", config.url);
    console.log("2. Token en LocalStorage:", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("3. Header agregado:", config.headers.Authorization);
    } else {
      console.warn("!! ALERTA: No se encontró token, la petición irá sin autorización.");
    }

    return config;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (config) => { return config; },
  (error) => {
    if (error.status === 401) {
      if (window.location.pathname.includes('/admin/')) {
        localStorage.clear();
        window.location.href = '/login';
      } else {
        localStorage.removeItem('token');
      }
    }

    return Promise.reject(error);
  },
);

export { instance };