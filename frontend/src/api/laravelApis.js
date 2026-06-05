import axios from "axios";

const laravelApi = axios.create({
    baseURL: "https://task-management-laravel-api-production.up.railway.app/api",
    // baseURL: "http://127.0.0.1:8000/api",
});

laravelApi.interceptors.request.use((config) => {

    const token =
        localStorage.getItem("token");

    if (token) {

        config.headers.Authorization =
            `Bearer ${token}`;
    }

    return config;
});

export default laravelApi;