import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000"
});

// Token management
const getToken = () => localStorage.getItem("accessToken");
const getRefreshToken = () => localStorage.getItem("refreshToken");
const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem("accessToken", accessToken);
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }
};
const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          clearTokens();
          window.location.href = "/login";
          return Promise.reject(error);
        }

        const response = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken } = response.data;
        setTokens(accessToken, refreshToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Export auth functions
export const authService = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const { accessToken, refreshToken, user } = response.data;
    setTokens(accessToken, refreshToken);
    return { user };
  },
  register: async (nome, email, password) => {
    const response = await api.post("/auth/register", { nome, email, password });
    return response.data;
  },
  logout: async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await api.post("/auth/logout", { refreshToken });
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
    clearTokens();
  },
  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data.user;
  },
  isAuthenticated: () => !!getToken()
};