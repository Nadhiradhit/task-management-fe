"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RegisterForm() {
	const [form, setForm] = useState({
		name: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		// Basic validation
		if (!form.name || !form.email || !form.password) {
			setError("All fields are required.");
			setLoading(false);
			return;
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(form.email)) {
			setError("Invalid email address.");
			setLoading(false);
			return;
		}
		if (form.password.length < 8) {
			setError("Password must be at least 8 characters.");
			setLoading(false);
			return;
		}

		try {
			const response = await register(form);
			if (response.status === "Success") {
				router.push("/login");
			} else {
				setError(response.message || "Register failed");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Register failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="py-6 px-4 sm:py-8 sm:px-6 h-full">
			<div className="space-y-4 w-full h-48">
				<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
					Create Account
				</h1>
				<p className="text-gray-500 text-sm">Sign up to get started</p>
			</div>
			<form onSubmit={handleSubmit} className="space-y-4">
				{error && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
						{error}
					</div>
				)}
				<div className="space-y-4 w-full">
					<Input
						type="text"
						name="name"
						id="name"
						value={form.name}
						onChange={handleChange}
						placeholder="Full Name"
						className="rounded-md"
						required
					/>
					<Input
						type="email"
						name="email"
						id="email"
						value={form.email}
						onChange={handleChange}
						placeholder="Your Email"
						className="rounded-md"
						required
					/>
					<Input
						type="password"
						name="password"
						id="password"
						value={form.password}
						onChange={handleChange}
						placeholder="Your Password"
						className="rounded-md"
						required
					/>
				</div>
				<Button
					type="submit"
					disabled={loading}
					className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 cursor-pointer">
					{loading ? "Registering..." : "Register"}
				</Button>
			</form>
			<p className="pt-6 text-sm">
				Already have an account?{" "}
				<Link href="/login" className="text-indigo-700 hover:text-indigo-900">
					Log in
				</Link>
			</p>
		</div>
	);
}
