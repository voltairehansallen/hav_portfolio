import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

// Si le token expire pendant qu'on est dans le dashboard, on redirige proprement
// vers le login plutôt que de laisser chaque appel échouer silencieusement.
if (typeof window !== 'undefined') {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const onDashboard = window.location.pathname.startsWith('/dashboard');
      const onLoginPage = window.location.pathname === '/dashboard/login';
      if (error.response?.status === 401 && onDashboard && !onLoginPage) {
        window.location.href = '/dashboard/login';
      }
      return Promise.reject(error);
    }
  );
}

export default api;
