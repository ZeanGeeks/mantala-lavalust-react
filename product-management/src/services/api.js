import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost/Lavalust_2/LavaLust/public/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

let refreshRequest = null;

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const refreshToken = localStorage.getItem("refresh_token");

        if (
            error.response?.status !== 401 ||
            !refreshToken ||
            originalRequest?._retry ||
            originalRequest?.url?.endsWith("/refresh") ||
            originalRequest?.url?.endsWith("/login")
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        refreshRequest ??= api
            .post("/refresh", { refresh_token: refreshToken })
            .then((response) => {
                const accessToken = response.data.tokens.access_token;
                const newRefreshToken = response.data.tokens.refresh_token;

                localStorage.setItem("access_token", accessToken);
                localStorage.setItem("refresh_token", newRefreshToken);

                return accessToken;
            })
            .finally(() => {
                refreshRequest = null;
            });

        try {
            const accessToken = await refreshRequest;
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
        } catch (refreshError) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("user");
            return Promise.reject(refreshError);
        }
    }
);

export const login = async (username, password) => {
    const response = await api.post("/login", {
        username,
        password
    });

    return response.data;
};

export const logout = async () => {
    const refreshToken = localStorage.getItem("refresh_token");

    try {
        await api.post("/logout", {
            refresh_token: refreshToken
        });
    } finally {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
    }
};

export const getProducts = async () => {
    const response = await api.get("/products");

    return response.data;
};

export const createProduct = async (product) => {
    const response = await api.post("/products", product);

    return response.data;
};

export const updateProduct = async (id, product) => {
    const response = await api.put(`/products/${id}`, product);

    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await api.delete(`/products/${id}`);

    return response.data;
};

export default api;