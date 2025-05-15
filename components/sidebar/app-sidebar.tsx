"use client";
import React from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "../ui/sidebar";
import Link from "next/link";
import { Command, LogOut, Users } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

const data = {
	navMain: [
		{
			title: "Dashboard",
			url: "/dashboard",
			items: [
				{
					title: "Task Board",
					url: "/dashboard/task-board",
				},
			],
		},
	],
};

export default function AppSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	const router = useRouter();
	const { user, logout } = useAuth();

	const handleLogout = () => {
		logout();
		router.push("/login");
	};

	return (
		<Sidebar variant="inset" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size={"lg"} asChild>
							<Link href="/dashboard">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-600 text-sidebar-primary-foreground">
									<Command className="size-4" />
								</div>
								<div className="grid flex-1 text-left text-lg leading-tight">
									<p className="truncate font-semibold">Task Board</p>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu className="gap-2">
						{data.navMain.map((item) => (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton asChild>
									<Link href={item.url} className="font-medium">
										{item.title}
									</Link>
								</SidebarMenuButton>
								{item.items?.length ? (
									<SidebarMenuSub className="ml-0 border-l-0 px-1.5">
										{item.items.map((item) => (
											<SidebarMenuSubItem key={item.title}>
												<SidebarMenuSubButton asChild>
													<Link href={item.url}>{item.title}</Link>
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										))}
									</SidebarMenuSub>
								) : null}
							</SidebarMenuItem>
						))}
						{user?.role === "ADMIN" && (
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Link href="/dashboard/users" className="font-medium">
										<Users className="size-4 mr-2" />
										Users
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						)}
					</SidebarMenu>
				</SidebarGroup>
				<SidebarGroup className="mt-auto">
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								onClick={handleLogout}
								className="text-red-50 hover:text-red-100 bg-red-500 hover:bg-red-600 cursor-pointer">
								<LogOut className="size-4 mr-2" />
								Logout
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
