// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:5000/api',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // THIS IS THE EXACT LINE REACT IS MISSING:
// export default api;

import axios from 'axios';

const api = axios.create({
  //baseURL: 'http://localhost:5000/api', // Make sure this matches your backend port!
  baseURL: 'https://ecokarma-backend-xyz.onrender.com/api',
});

// --- ADDED: The Interceptor (The 3 Lines of Magic) ---
api.interceptors.request.use(
  (config) => {
    // 1. Look for the token in localStorage
    const token = localStorage.getItem('token');
    
    // 2. If it exists, attach it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;