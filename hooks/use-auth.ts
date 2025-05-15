import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axiosInstance from "@/lib/axios";

interface User {
	id: string;
	email: string;
	role: "ADMIN" | "USER";
	name: string;
}

export function useAuth() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const token = Cookies.get("token");
				const userId = Cookies.get("user");
				const userEmail = Cookies.get("email");
				const userName = Cookies.get("name");
				const userRole = Cookies.get("role");

				if (!token || !userId) {
					setUser(null);
					setLoading(false);
					return;
				}

				if (userId && userEmail && userName && userRole) {
					setUser({
						id: userId,
						email: userEmail,
						name: userName,
						role: userRole as "ADMIN" | "USER",
					});
					setLoading(false);
					return;
				}

				// Otherwise fetch from API
				const response = await axiosInstance.get("/auth/me", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (response.data) {
					const userData = response.data.data;
					setUser({
						id: userData.id,
						email: userData.email,
						name: userData.name,
						role: userData.role,
					});
				}
			} catch (error) {
				console.error("Auth check failed:", error);
				setUser(null);
				Cookies.remove("token");
				Cookies.remove("user");
				Cookies.remove("email");
				Cookies.remove("name");
				Cookies.remove("role");
			} finally {
				setLoading(false);
			}
		};

		checkAuth();
	}, []);

	const logout = () => {
		Cookies.remove("token");
		Cookies.remove("user");
		Cookies.remove("email");
		Cookies.remove("name");
		Cookies.remove("role");
		setUser(null);
		router.push("/login");
	};

	return {
		user,
		loading,
		logout,
		isAuthenticated: !!user,
	};
}
