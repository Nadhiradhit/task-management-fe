import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Add a request interceptor to add the token to all requests
axiosInstance.interceptors.request.use(
	(config) => {
		const token = Cookies.get("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Add a response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (error.response?.status === 401) {
			// Handle token expiration
			Cookies.remove("token");
			Cookies.remove("user");
			window.location.href = "/login";
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;
