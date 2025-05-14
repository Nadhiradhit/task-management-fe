import AppSidebar from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider defaultOpen={true}>
			<AppSidebar />
			<main className="flex-1 overflow-y-auto p-6">{children}</main>
		</SidebarProvider>
	);
}
