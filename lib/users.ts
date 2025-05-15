import axiosInstance from "./axios";

export interface User {
	id: string;
	name: string;
	email: string;
	role: string;
	is_active: boolean;
	created_at: string;
	updated_at: string;
}

export const getUsers = async () => {
	const response = await axiosInstance.get("/auth/users");
	return response.data;
};

export const updateUser = async (userId: string, data: Partial<User>) => {
	const response = await axiosInstance.put(`/auth/users/${userId}`, data);
	return response.data;
};

export const deleteUser = async (userId: string) => {
	const response = await axiosInstance.delete(`/auth/${userId}`);
	return response.data;
};

export const toggleUserActive = async (userId: string, isActive: boolean) => {
	const response = await axiosInstance.put(`/auth/users/${userId}`, {
		is_active: isActive,
	});
	return response.data;
};
