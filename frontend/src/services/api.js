import axios from 'axios';

const api = axios.create({
  baseURL:  import.meta.env.REACT_APP_BASE_URL + "/api", 
});


api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
  
  export default api;