"use client";
import { Board, deleteBoard, getBoardById, updateBoard } from "@/lib/board";
import React, { useEffect, useState, useCallback } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";

interface BoardDetailProps {
	boardId: string;
}

export default function BoardDetail({ boardId }: BoardDetailProps) {
	const [board, setBoard] = useState<Board | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isUpdating, setIsUpdating] = useState(false);
	const [boardName, setBoardName] = useState("");
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const debouncedBoardName = useDebounce(boardName, 500);
	const router = useRouter();

	const fetchBoardDetails = useCallback(async (id: string) => {
		try {
			setIsLoading(true);
			setError(null);
			const response = await getBoardById(id);
			setBoard(response.data);
			setBoardName(response.data.name);
		} catch (error) {
			console.error("Error fetching board details:", error);
			setError("Failed to load board details");
		} finally {
			setIsLoading(false);
		}
	}, []);

	const handleVisibilityToggle = async () => {
		if (!board) return;

		try {
			setIsUpdating(true);
			const response = await updateBoard(boardId, {
				is_public: !board.is_public,
			});
			setBoard(response.data);
		} catch (error) {
			console.error("Error updating board visibility:", error);
			setError("Failed to update board visibility");
		} finally {
			setIsUpdating(false);
		}
	};

	const updateBoardName = useCallback(
		async (newName: string) => {
			if (!board || newName === board.name) return;

			try {
				setIsUpdating(true);
				const response = await updateBoard(boardId, {
					name: newName,
				});
				setBoard(response.data);
			} catch (error) {
				console.error("Error updating board name:", error);
				setError("Failed to update board name");
				setBoardName(board.name);
			} finally {
				setIsUpdating(false);
			}
		},
		[board, boardId]
	);

	const handleDeleteBoard = async () => {
		try {
			setIsDeleting(true);
			await deleteBoard(boardId);
			router.push("/dashboard");
		} catch (error) {
			console.error("Error deleting board:", error);
			setError("Failed to delete board. Please try again.");
		} finally {
			setIsDeleting(false);
			setIsDeleteDialogOpen(false);
		}
	};

	useEffect(() => {
		if (debouncedBoardName && board && debouncedBoardName !== board.name) {
			updateBoardName(debouncedBoardName);
		}
	}, [debouncedBoardName, board, updateBoardName]);

	useEffect(() => {
		if (!boardId) {
			setError("Board ID is required");
			setIsLoading(false);
			return;
		}

		fetchBoardDetails(boardId);
	}, [boardId, fetchBoardDetails]);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-[200px]">
				Loading...
			</div>
		);
	}

	if (error) {
		return <div className="text-red-500">{error}</div>;
	}

	if (!board) {
		return <div>Board not found</div>;
	}

	return (
		<div className="p-4">
			<div className="bg-white rounded-lg shadow p-6">
				<div className="mb-4">
					<Input
						type="text"
						value={boardName}
						onChange={(e) => setBoardName(e.target.value)}
						className="text-3xl font-semibold border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
						placeholder="Enter board name"
						disabled={isUpdating}
					/>
				</div>
				<div className="space-y-2">
					<p className="text-gray-600">
						<span className="font-semibold">Created by:</span>{" "}
						{board.user?.name || "Unknown"}
					</p>
					<div className="flex items-center gap-2">
						<span className="font-semibold text-gray-600">Visibility:</span>
						<Switch
							checked={board.is_public}
							onCheckedChange={handleVisibilityToggle}
							disabled={isUpdating}
						/>
					</div>
				</div>
				<div className="flex items-center gap-2 justify-end">
					<Button
						variant="destructive"
						onClick={() => setIsDeleteDialogOpen(true)}
						disabled={isDeleting}>
						<Trash />
					</Button>
				</div>
			</div>

			<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Board</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this board? This action cannot be
							undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsDeleteDialogOpen(false)}
							disabled={isDeleting}>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleDeleteBoard}
							disabled={isDeleting}>
							{isDeleting ? "Deleting..." : "Delete"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
