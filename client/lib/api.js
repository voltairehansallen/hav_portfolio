import axios from 'axios';

const FALLBACK_API_URL = 'http://localhost:5000/api';

function normalizeApiUrl(value) {
  if (!value) return FALLBACK_API_URL;
  // Variable saisie sans schéma (ex: "monapp.up.railway.app" au lieu de
  // "https://monapp.up.railway.app") — on complète plutôt que de planter.
  const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    // eslint-disable-next-line no-new
    new URL(withScheme);
    return withScheme;
  } catch {
    console.warn(
      `⚠️  NEXT_PUBLIC_API_URL="${value}" n'est pas une URL valide — vérifie cette variable d'environnement. Repli sur ${FALLBACK_API_URL}.`
    );
    return FALLBACK_API_URL;
  }
}

const api = axios.create({
  baseURL: normalizeApiUrl(process.env.NEXT_PUBLIC_API_URL),
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
