"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar/app-sidebar";

export default function LayoutContent({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const isAuthPage =
		pathname?.includes("/login") || pathname?.includes("/register");

	return isAuthPage ? (
		children
	) : (
		<SidebarProvider defaultOpen={true}>
			<AppSidebar />
			{children}
		</SidebarProvider>
	);
}
