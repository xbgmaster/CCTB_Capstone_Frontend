import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
	ChevronDown,
	HardHat,
	LogOut,
	Menu,
	Settings,
	User,
	X,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useData } from "../../contexts/DataContext.jsx";
import Avatar from "../ui/Avatar.jsx";
import NotificationBell from "./NotificationBell.jsx";

function getDashboardPath(role) {
	if (role === "employer") return "/employer";
	if (role === "worker") return "/worker";
	if (role === "admin") return "/admin";
	return "/";
}

export default function Navbar() {
	const { currentUser, logout } = useAuth();
	const { ROLES } = useData();
	const navigate = useNavigate();
	const [menuOpen, setMenuOpen] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);
	const menuRef = useRef(null);

	useEffect(() => {
		const handler = (e) => {
			if (menuRef.current && !menuRef.current.contains(e.target))
				setMenuOpen(false);
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	const handleLogout = () => {
		logout();
		setMenuOpen(false);
		navigate("/");
	};

	const navLinks = [
		{ to: "/jobs", label: "Browse Jobs" },
		{ to: "/companies", label: "Companies" },
		{ to: "/about", label: "How it works" },
	];

	return (
		<header className='sticky top-0 z-30 border-b border-white/10 bg-[var(--navy-deep)] backdrop-blur'>
			<div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
				<div className='flex items-center gap-8'>
					<Link to='/' className='flex items-center gap-2'>
						<span className='text-xl text-[var(--sky-light)]'>●</span>
						<p
							className='text-base font-bold uppercase tracking-wide text-[var(--white)]'
							style={{ fontFamily: "var(--font-display)" }}>
							Jobnet
						</p>
					</Link>

					<nav className='hidden items-center gap-10 md:flex'>
						{navLinks.map((l) => (
							<NavLink
								key={l.to}
								to={l.to}
								end
								className={({ isActive }) => {
									const base =
										"inline-block text-[0.85rem] font-semibold uppercase tracking-[0.12em] transition-all duration-300 transform pb-2 hover:-translate-y-[2px]";

									if (isActive) {
										return `${base} border-b-2 border-[var(--sky-light)] text-[var(--white)] opacity-100`;
									}

									return `${base} border-b-2 border-transparent text-[var(--white)] opacity-70 hover:border-[var(--sky-light)] hover:opacity-100`;
								}}>
								{l.label}
							</NavLink>
						))}
					</nav>
				</div>

				<div className='flex items-center gap-2'>
					{currentUser ? (
						<>
							<NotificationBell />
							<Link
								to={getDashboardPath(currentUser.role)}
								className='hidden text-sm font-medium text-[var(--white)] opacity-90 hover:opacity-100 md:inline-flex'>
								Dashboard
							</Link>
							<div className='relative' ref={menuRef}>
								<button
									type='button'
									onClick={() => setMenuOpen((o) => !o)}
									className='flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-white/10'>
									<Avatar
										initials={currentUser.avatar}
										seed={currentUser.id}
										size='sm'
									/>
									<ChevronDown
										size={14}
										className='text-[var(--white)] opacity-70'
									/>
								</button>
								{menuOpen && (
									<div className='absolute right-0 mt-2 w-56 animate-slide-up overflow-hidden rounded-xl border border-ink-200 bg-white shadow-cardHover'>
										<div className='border-b border-ink-100 px-4 py-3'>
											<p className='truncate text-sm font-semibold text-ink-900'>
												{currentUser.firstName} {currentUser.lastName}
											</p>
											<p className='truncate text-xs text-ink-500'>
												{currentUser.email}
											</p>
											<p className='mt-1 text-xs font-medium uppercase tracking-wide text-brand-700'>
												{currentUser.role}
											</p>
										</div>
										<div className='py-1'>
											<Link
												to={getDashboardPath(currentUser.role)}
												onClick={() => setMenuOpen(false)}
												className='flex items-center gap-2 px-4 py-2 text-sm text-ink-700 hover:bg-ink-50'>
												<User size={14} /> Dashboard
											</Link>
											<Link
												to={
													currentUser.role === ROLES.EMPLOYER
														? "/employer/company"
														: currentUser.role === ROLES.WORKER
															? "/worker/profile"
															: "/admin"
												}
												onClick={() => setMenuOpen(false)}
												className='flex items-center gap-2 px-4 py-2 text-sm text-ink-700 hover:bg-ink-50'>
												<Settings size={14} /> Profile settings
											</Link>
											<button
												type='button'
												onClick={handleLogout}
												className='flex w-full items-center gap-2 border-t border-ink-100 px-4 py-2 text-sm text-red-600 hover:bg-red-50'>
												<LogOut size={14} /> Sign out
											</button>
										</div>
									</div>
								)}
							</div>
						</>
					) : (
						<>
							<Link
								to='/login'
								className='hidden items-center rounded-[var(--radius-pill)] border-[1.5px] border-white/60 px-6 py-2.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-[var(--white)] transition hover:bg-white/10 sm:inline-flex'>
								Sign in
							</Link>
							<Link
								to='/register'
								className='inline-flex items-center rounded-[var(--radius-pill)] bg-[var(--white)] px-6 py-2.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-[var(--navy-deep)] transition hover:bg-[#e9edff]'>
								Get started
							</Link>
						</>
					)}

					<button
						type='button'
						onClick={() => setMobileOpen((o) => !o)}
						className='rounded-md p-2 text-[var(--white)] hover:bg-white/10 md:hidden'
						aria-label='Toggle menu'>
						{mobileOpen ? <X size={18} /> : <Menu size={18} />}
					</button>
				</div>
			</div>

			{mobileOpen && (
				<div className='border-t border-white/10 bg-[var(--navy-deep)] md:hidden'>
					<nav className='flex flex-col gap-3 px-4 py-4'>
						{navLinks.map((l) => (
							<NavLink
								key={l.to}
								to={l.to}
								end
								onClick={() => setMobileOpen(false)}
								className={({ isActive }) =>
									`rounded-md px-3 py-2 text-sm font-semibold uppercase tracking-wide ${
										isActive
											? "text-[var(--sky-light)]"
											: "text-[var(--white)] opacity-90 hover:opacity-100"
									}`
								}>
								{l.label}
							</NavLink>
						))}
						{!currentUser && (
							<Link
								to='/login'
								onClick={() => setMobileOpen(false)}
								className='rounded-md px-3 py-2 text-sm font-semibold uppercase tracking-wide text-[var(--white)] opacity-90 hover:opacity-100'>
								Sign in
							</Link>
						)}
					</nav>
				</div>
			)}
		</header>
	);
}
