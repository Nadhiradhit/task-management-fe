import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const login = async (email: string, password: string) => {
	const response = await axios.post(`${API_URL}/auth/login`, {
		email,
		password,
	});

	if (response.data.data.token) {
		Cookies.set("token", response.data.data.token, { expires: 3 });
		Cookies.set("user", response.data.data.id, { expires: 3 });
		Cookies.set("email", response.data.data.email, { expires: 3 });
		Cookies.set("name", response.data.data.name, { expires: 3 });
		Cookies.set("role", response.data.data.role, { expires: 3 });
	}

	return response.data;
};

export const register = async (userData: any) => {
	const response = await axios.post(`${API_URL}/auth/register`, userData);
	return response.data;
};

export const logout = () => {
	Cookies.remove("token");
	Cookies.remove("user");
	Cookies.remove("email");
	Cookies.remove("name");
	Cookies.remove("role");
};
