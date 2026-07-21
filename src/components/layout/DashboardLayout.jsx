import { NavLink, Outlet } from "react-router-dom";

export default function DashboardLayout({ title, subtitle, nav = [] }) {
	return (
		<div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
			<div className='mb-6'>
				<h1 className='text-2xl font-bold tracking-tight text-ink-900'>
					{title}
				</h1>
				{subtitle && <p className='mt-1 text-sm text-ink-500'>{subtitle}</p>}
			</div>

			<div className='grid gap-6 lg:grid-cols-[220px_1fr]'>
				<aside>
					<nav className='card sticky top-20 flex flex-col p-2'>
						{nav.map((item) => (
							<NavLink
								key={item.to}
								to={item.to}
								end={item.end}
								className={({ isActive }) =>
									`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
										isActive
											? "bg-brand-50 text-brand-700"
											: "text-ink-600 hover:bg-ink-100 hover:text-ink-900"
									}`
								}>
								{item.icon ? <item.icon size={16} /> : null}
								<span className='flex-1'>{item.label}</span>
								{item.badge ? (
									<span className='rounded-full bg-brand-600 px-1.5 py-0.5 text-[10px] font-semibold text-white'>
										{item.badge}
									</span>
								) : null}
							</NavLink>
						))}
					</nav>
				</aside>
				<section className='min-w-0'>
					<Outlet />
				</section>
			</div>
		</div>
	);
}
