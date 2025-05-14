import LoginForm from "../_sections/login-form";
import Image from "next/image";

export default function LoginPage() {
	return (
		<div className="min-h-screen flex items-center justify-center font-noto-sans">
			<div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
				<div className="w-full md:w-1/2 p-4 sm:p-8  flex items-center justify-center">
					<LoginForm />
				</div>
				<div className="w-full md:w-1/2 md:flex items-center justify-center bg-white hidden ">
					<Image
						src={"/task-management.jpg"}
						alt="login"
						width={600}
						height={600}
						className="object-cover rounded-lg w-full h-40 sm:h-80 md:h-full"
						priority
					/>
				</div>
			</div>
		</div>
	);
}
