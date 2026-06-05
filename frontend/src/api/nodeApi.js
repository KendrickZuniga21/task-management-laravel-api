import axios from "axios";

const nodeApi = axios.create({
    baseURL: "https://task-management-node-services-bcuw.onrender.com",
    // baseURL: "http://localhost:3000",
});

nodeApi.interceptors.request.use((config) => {

    const token =
        localStorage.getItem("token");

    if (token) {

        config.headers.Authorization =
            `Bearer ${token}`;
    }

    return config;
});

export default nodeApi;