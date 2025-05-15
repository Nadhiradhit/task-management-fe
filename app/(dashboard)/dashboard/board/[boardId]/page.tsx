import BoardDetail from "@/app/(dashboard)/_sections/board/board-detail";
import React from "react";

export default function page({ params }: { params: { boardId: string } }) {
	return (
		<div>
			<BoardDetail boardId={params.boardId} />
		</div>
	);
}
