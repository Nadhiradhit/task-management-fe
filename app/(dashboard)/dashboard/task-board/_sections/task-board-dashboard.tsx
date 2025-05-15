"use client";
import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarDays, Globe, Lock, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Board, getBoards, createBoard } from "@/lib/board";
import Cookies from "js-cookie";
import Link from "next/link";

export default function TaskBoardDashboard() {
	const [boards, setBoards] = useState<Board[]>([]);
	const [isCreating, setIsCreating] = useState(false);
	const [newBoard, setNewBoard] = useState({ name: "", is_public: true });
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const currentUserId = Cookies.get("user");

	useEffect(() => {
		fetchBoards();
	}, []);

	const fetchBoards = async () => {
		try {
			setIsLoading(true);
			const response = await getBoards();

			if (
				response.data &&
				typeof response.data === "object" &&
				!Array.isArray(response.data)
			) {
				const boardsArray = Object.values(response.data);
				setBoards(boardsArray as Board[]);
			} else if (Array.isArray(response.data)) {
				setBoards(response.data);
			} else {
				setBoards([]);
			}
		} catch (error) {
			console.error("Error fetching boards:", error);
			setBoards([]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleCreateBoard = async () => {
		try {
			setIsCreating(true);
			await createBoard(newBoard);
			setNewBoard({ name: "", is_public: true });
			setIsOpen(false);
			fetchBoards();
		} catch (error) {
			console.error("Error creating board:", error);
		} finally {
			setIsCreating(false);
		}
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	return (
		<div className="space-y-6 p-6">
			<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
				<h1 className="text-2xl font-bold">Your Task Boards</h1>
				<Dialog open={isOpen} onOpenChange={setIsOpen}>
					<DialogTrigger asChild>
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							Create Your Task Board
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Create New Task Board</DialogTitle>
						</DialogHeader>
						<div className="space-y-4 py-4">
							<div className="space-y-2">
								<Label htmlFor="name">Board Name</Label>
								<Input
									id="name"
									value={newBoard.name}
									onChange={(e) =>
										setNewBoard({ ...newBoard, name: e.target.value })
									}
									placeholder="Enter board name"
								/>
							</div>
							<div className="flex items-center space-x-2">
								<Switch
									id="public"
									checked={newBoard.is_public}
									onCheckedChange={(checked: boolean) =>
										setNewBoard({ ...newBoard, is_public: checked })
									}
								/>
								<Label htmlFor="public">Public Board</Label>
							</div>
							<Button
								onClick={handleCreateBoard}
								disabled={isCreating || !newBoard.name}
								className="w-full">
								{isCreating ? "Creating..." : "Create Board"}
							</Button>
						</div>
					</DialogContent>
				</Dialog>
			</div>
			{isLoading ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{[1, 2, 3].map((i) => (
						<div key={i} className="p-6 border rounded-lg animate-pulse">
							<div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
							<div className="h-4 bg-gray-200 rounded w-1/2"></div>
						</div>
					))}
				</div>
			) : boards.length > 0 ? (
				<div className="space-y-8">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{boards
							.filter((board) => board.created_by === currentUserId)
							.map((board) => (
								<Link
									key={board.id}
									href={`/dashboard/board/${board.id}`}
									className="p-6 border rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-white">
									<div className="flex justify-between items-start">
										<h3 className="font-semibold text-lg">{board.name}</h3>
										<span
											className={`text-xs px-2 py-1 rounded-full flex items-center ${
												board.is_public
													? "bg-green-100 text-green-800"
													: "bg-gray-100 text-gray-800"
											}`}>
											{board.is_public ? (
												<>
													<Globe className="h-3 w-3 mr-1" />
													Public
												</>
											) : (
												<>
													<Lock className="h-3 w-3 mr-1" />
													Private
												</>
											)}
										</span>
									</div>
									<div className="mt-4 text-sm text-gray-500 flex items-center">
										<CalendarDays className="h-4 w-4 mr-1" />
										Created: {formatDate(board.created_at)}
									</div>
									{board.user && (
										<div className="mt-2 text-sm text-gray-500">
											By: {board.user.name}
										</div>
									)}
								</Link>
							))}
					</div>
				</div>
			) : (
				<div className="text-center py-10">
					<p className="text-gray-500">
						No boards found. Create your first board!
					</p>
				</div>
			)}
		</div>
	);
}
