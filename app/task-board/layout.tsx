export default function TaskBoardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<main className="flex-1 overflow-y-auto px-4">{children}</main>
		</>
	);
}
