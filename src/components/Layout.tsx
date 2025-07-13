import React from "react";
import Sidebar from "./Sidebar";

type Props = {
	children: React.ReactNode;
};

export default function Layout({ children }: Props) {
	return (
		<div className='flex h-screen overflow-hidden'>
			<Sidebar />
			<div className='flex-1 overflow-auto bg-gray-100'>
				<main className='p-6'>{children}</main>
			</div>
		</div>
	);
}
