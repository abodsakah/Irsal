import React from "react";
import Sidebar from "./Sidebar";

type Props = {
	children: React.ReactNode;
};

export default function Layout({ children }: Props) {
	return (
		<div className='flex h-screen'>
			<Sidebar />
			<div className='flex-1 p-4 pl-6 bg-gray-100'>{children}</div>
		</div>
	);
}
