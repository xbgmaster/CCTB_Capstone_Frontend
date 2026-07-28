import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

export default function AppLayout() {
	return (
		<div className='flex min-h-full flex-col'>
			<Navbar />
			<main className='hero-bg flex-1'>
				<Outlet />
			</main>
			<Footer />
		</div>
	);
}
