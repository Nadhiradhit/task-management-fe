"use client";
import { useState } from "react";
import { login } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async () => {
		setError("");
		setLoading(true);

		try {
			const response = await login(email, password);
			if (response.status === "Success") {
				router.push("/dashboard");
			} else {
				setError(response.message || "Login failed");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Login failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="py-6 px-4 sm:py-8 sm:px-6 h-full">
			<div className="space-y-4 w-full h-48">
				<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
					Hello, <br />
					<span className="text-primary">Welcome Back</span>
				</h1>
				<p className="text-gray-500 text-sm">Please sign in to your account</p>
			</div>
			<form onSubmit={handleSubmit} className="space-y-4">
				{error && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
						{error}
					</div>
				)}

				<div className="space-y-4 w-full">
					<Input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Your Email"
						className="rounded-md"
						required
					/>
					<div className="relative">
						<Input
							type={showPassword ? "text" : "password"}
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Your Password"
							className="rounded-md"
							required
						/>
						<Button
							type="button"
							variant={"ghost"}
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-2.5 inset-y-1 top-0 text-gray-500 hover:text-black"
							tabIndex={-1}
							aria-label={showPassword ? "Hide Password" : "Show Password"}>
							{showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
						</Button>
					</div>
				</div>

				<div className="text-end">
					<Link
						href={"/forgot-password"}
						className="text-sm hover:text-indigo-700">
						Forgot your password?
					</Link>
				</div>

				<Button
					type="submit"
					disabled={loading}
					className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 cursor-pointer">
					{loading ? "Logging in..." : "Login"}
				</Button>
			</form>
			<p className="pt-6 text-sm">
				Don&apos;t have an account?{" "}
				<Link
					href="/register"
					className="text-indigo-700 hover:text-indigo-900">
					Sign up
				</Link>
			</p>
		</div>
	);
}
