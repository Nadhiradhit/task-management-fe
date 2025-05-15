import axiosInstance from "./axios";

export interface Board {
	id: string;
	name: string;
	created_by: string;
	is_public: boolean;
	created_at: string;
	updated_at: string;
	user?: {
		id: string;
		name: string;
	};
}

export interface CreateBoardResponse {
	data: Board;
	message: string;
	status: string;
}

export interface GetBoardResponse {
	data: Board;
	message: string;
	status: string;
}

export const createBoard = async (data: {
	name: string;
	is_public: boolean;
}) => {
	const response = await axiosInstance.post<CreateBoardResponse>(
		"/board/create",
		data
	);
	return response.data;
};

export const getBoards = async () => {
	const response = await axiosInstance.get("/board");
	return response.data;
};

export const getBoardById = async (boardId: string) => {
	const response = await axiosInstance.get<GetBoardResponse>(
		`/board/${boardId}`
	);
	return response.data;
};

export const updateBoard = async (
	boardId: string,
	data: {
		name?: string;
		is_public?: boolean;
	}
) => {
	const response = await axiosInstance.put<GetBoardResponse>(
		`/board/${boardId}`,
		data
	);
	return response.data;
};

export const deleteBoard = async (boardId: string) => {
	const response = await axiosInstance.delete<{
		message: string;
		status: string;
	}>(`/board/${boardId}`);
	return response.data;
};
