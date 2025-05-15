"use client";

import React, { useEffect, useState } from "react";
import { User, getUsers, deleteUser, toggleUserActive } from "@/lib/users";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

export default function UsersPage() {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);

	const fetchUsers = async () => {
		try {
			const response = await getUsers();
			setUsers(response.data);
		} catch (error) {
			toast.error("Failed to fetch users");
			console.error("Error fetching users:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const handleDelete = async (userId: string) => {
		try {
			await deleteUser(userId);
			toast.success("User deleted successfully");
			fetchUsers();
			setDeleteDialogOpen(false);
		} catch (error) {
			toast.error("Failed to delete user");
			console.error("Error deleting user:", error);
		}
	};

	const handleToggleActive = async (userId: string, currentStatus: boolean) => {
		try {
			await toggleUserActive(userId, !currentStatus);
			toast.success(
				`User ${!currentStatus ? "activated" : "deactivated"} successfully`
			);
			fetchUsers();
		} catch (error) {
			toast.error("Failed to update user status");
			console.error("Error updating user status:", error);
		}
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="container mx-auto py-6">
			<h1 className="text-2xl font-bold mb-6">Users Management</h1>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Role</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{users.map((user) => (
						<TableRow key={user.id}>
							<TableCell>{user.name}</TableCell>
							<TableCell>{user.email}</TableCell>
							<TableCell>{user.role}</TableCell>
							<TableCell>
								<span
									className={`px-2 py-1 rounded-full text-xs ${
										user.is_active
											? "bg-green-100 text-green-800"
											: "bg-red-100 text-red-800"
									}`}>
									{user.is_active ? "Active" : "Inactive"}
								</span>
							</TableCell>
							<TableCell>
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleToggleActive(user.id, user.is_active)}>
										{user.is_active ? "Deactivate" : "Activate"}
									</Button>
									<Dialog
										open={deleteDialogOpen && selectedUser?.id === user.id}
										onOpenChange={(open) => {
											setDeleteDialogOpen(open);
											if (!open) setSelectedUser(null);
										}}>
										<DialogTrigger asChild>
											<Button
												variant="destructive"
												size="sm"
												onClick={() => setSelectedUser(user)}>
												Delete
											</Button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>Delete User</DialogTitle>
												<DialogDescription>
													Are you sure you want to delete this user? This action
													cannot be undone.
												</DialogDescription>
											</DialogHeader>
											<DialogFooter>
												<Button
													variant="outline"
													onClick={() => setDeleteDialogOpen(false)}>
													Cancel
												</Button>
												<Button
													variant="destructive"
													onClick={() => handleDelete(user.id)}>
													Delete
												</Button>
											</DialogFooter>
										</DialogContent>
									</Dialog>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
