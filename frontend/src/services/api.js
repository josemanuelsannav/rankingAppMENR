import axios from 'axios';

const api = axios.create({
  //baseURL: "https://ranking-app-menr-back.vercel.app" + "/api", 
  baseURL: "http://localhost:3000" + "/api",
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