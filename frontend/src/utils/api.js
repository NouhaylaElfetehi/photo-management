import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("🔍 Vérification du token avant envoi :", token);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Token ajouté aux headers :", config.headers.Authorization);
    } else {
      console.warn("⚠️ Aucun token trouvé dans localStorage !");
    }
    return config;
  },
  (error) => Promise.reject(error)
);
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    console.log("📡 Vérification du token avant envoi :", token);

    if (!token) {
      console.warn("⚠️ Aucun token trouvé dans localStorage !");
      return config;
    }

    // Vérifie que le token est bien formé (évite les problèmes de null ou undefined)
    if (token && token.startsWith("ey")) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Token ajouté aux headers :", config.headers.Authorization);
    } else {
      console.warn("⚠️ Le token récupéré est invalide :", token);
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  response => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("🔄 Token expiré, tentative de rafraîchissement...");

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        console.error("❌ Aucun refresh token disponible !");
        return Promise.reject(error);
      }

      try {
        const res = await axios.post("http://localhost:5000/api/auth/refresh", { refreshToken });
        const newToken = res.data.accessToken;

        localStorage.setItem("token", newToken);
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return axios(error.config);
      } catch (refreshError) {
        console.error("❌ Erreur lors du rafraîchissement du token :", refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);




export default api;
