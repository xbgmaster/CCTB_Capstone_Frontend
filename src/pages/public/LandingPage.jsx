import { Link } from "react-router-dom";
import {
	ArrowRight,
	Briefcase,
	CheckCircle2,
	MapPin,
	Search,
	ShieldCheck,
	Star,
	Users,
	Zap,
} from "lucide-react";
import { useData } from "../../contexts/DataContext.jsx";
import StarRating from "../../components/ui/StarRating.jsx";

const HERO_STATS = [
	{ label: "Active jobs", key: "openJobs" },
	{ label: "Total jobs", key: "totalJobs" },
	{ label: "Verified companies", key: "companies" },
];

export default function LandingPage() {
	const { jobs, companies } = useData();

	const openJobs = jobs.filter((j) => j.status === "open").slice(0, 4);
	const featuredCompanies = [...companies]
		.sort((a, b) => b.rating - a.rating)
		.slice(0, 3);

	const counts = {
		openJobs: jobs.filter((j) => j.status === "open").length,
		totalJobs: jobs.length,
		companies: companies.length,
	};

	return (
		<div>
			<section className='hero-bg  relative overflow-hidden from-brand-50 via-white to-blue-50'>
				<div className='absolute inset-0 bg-[radial-gradient(circle_at_top_right,transparent_50%)]' />
				<div className='relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:flex lg:items-center lg:gap-12 lg:px-8 lg:py-28'>
					<div className='lg:w-1/2'>
						<span className='badge-brand'>Built for Canadian trades</span>
						<h1 className='mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl'>
							Find your next <span className='text-brand-600'>build</span>.
							<br />
							Hire the right hands.
						</h1>
						<p className='mt-5 max-w-xl text-lg'>
							Jobnet connects construction companies and general-services
							employers with verified, skilled workers across Canada - in real
							time.
						</p>
						<div className='mt-8 flex flex-wrap gap-3'>
							<Link to='/register' className='btn-primary text-base px-5 py-3'>
								Get started free
								<ArrowRight size={16} />
							</Link>
							<Link to='/jobs' className='btn-secondary text-base px-5 py-3'>
								<Search size={16} /> Browse open jobs
							</Link>
						</div>
						<div className='mt-10 grid grid-cols-3 gap-6 border-t border-ink-200/60 pt-6'>
							{HERO_STATS.map((s) => (
								<div key={s.key}>
									<p className='text-2xl font-bold text-ink-900'>
										{counts[s.key]}
									</p>
									<p className='text-xs uppercase tracking-wide text-ink-500'>
										{s.label}
									</p>
								</div>
							))}
						</div>
					</div>

					<div className='mt-12 lg:mt-0 lg:w-1/2'>
						<div className='card relative mx-auto max-w-md p-6'>
							<div className='absolute -right-3 -top-3 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-sm'>
								Live
							</div>
							<p className='text-sm font-semibold text-ink-500'>
								Latest opportunity
							</p>
							{openJobs[0] && (
								<>
									<h3 className='mt-1 text-lg font-bold text-ink-900'>
										{openJobs[0].title}
									</h3>
									<div className='mt-3 flex flex-wrap items-center gap-3 text-sm text-ink-600'>
										<span className='inline-flex items-center gap-1'>
											<MapPin size={14} />
											{openJobs[0].location}
										</span>
										<span className='inline-flex items-center gap-1'>
											<Briefcase size={14} />
											{openJobs[0].category}
										</span>
									</div>
									<p className='mt-3 line-clamp-3 text-sm text-ink-600'>
										{openJobs[0].description}
									</p>
									<div className='mt-4 flex items-center justify-between'>
										<p className='text-lg font-bold text-brand-600'>
											${openJobs[0].paymentAmount.toLocaleString("en-CA")}
											<span className='ml-1 text-xs font-medium text-ink-500'>
												{openJobs[0].paymentType === "hourly"
													? "/ hour"
													: "fixed"}
											</span>
										</p>
										<Link
											to={`/jobs/${openJobs[0].id}`}
											className='btn-primary text-xs'>
											View job
										</Link>
									</div>
								</>
							)}
						</div>
					</div>
				</div>
			</section>

			<section className='bg-white py-16 sm:py-20'>
				<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
					<div className='mx-auto max-w-2xl text-center'>
						<h2 className='text-3xl font-bold tracking-tight text-ink-900'>
							Built for both sides
						</h2>
						<p className='mt-3 text-ink-600'>
							Whether you're staffing a tower fit-out or looking for your next
							gig, Jobnet gives you the tools to move quickly and confidently.
						</p>
					</div>

					<div className='mt-12 grid gap-6 md:grid-cols-3'>
						{[
							{
								icon: Zap,
								title: "Real-time matching",
								body: "New jobs appear instantly. Workers see fresh opportunities the moment companies post them.",
							},
							{
								icon: ShieldCheck,
								title: "Verified profiles",
								body: "Business numbers, certifications, and reviews build a trusted marketplace - not a wild west.",
							},
							{
								icon: Users,
								title: "Role-based workspaces",
								body: "Dedicated dashboards for employers, workers, and admins keep everyone focused on what matters.",
							},
						].map((f) => (
							<div
								key={f.title}
								className='card p-6 transition-shadow hover:shadow-cardHover'>
								<div className='inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700'>
									<f.icon size={18} />
								</div>
								<h3 className='mt-4 text-base font-bold text-ink-900'>
									{f.title}
								</h3>
								<p className='mt-1 text-sm text-ink-600'>{f.body}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className=' hero-bg py-16 sm:py-20'>
				<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
					<div className='flex items-end justify-between'>
						<div>
							<h2 className='text-2xl font-bold tracking-tight'>
								Fresh job opportunities
							</h2>
							<p className='mt-1 text-sm text-ink-500'>
								Updated in real time as employers post new work.
							</p>
						</div>
						<Link
							to='/jobs'
							className='hidden text-sm font-semibold text-brand-600 hover:underline sm:inline-flex'>
							View all jobs <ArrowRight size={14} className='ml-1 inline' />
						</Link>
					</div>

					<div className='mt-6 grid gap-4 md:grid-cols-2'>
						{openJobs.map((job) => {
							const company = companies.find((c) => c.id === job.companyId);
							return (
								<Link
									to={`/jobs/${job.id}`}
									key={job.id}
									className='card group p-5 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-cardHover'>
									<div className='flex items-start justify-between gap-3'>
										<div>
											<p className='text-xs font-semibold uppercase tracking-wide text-brand-700'>
												{job.category}
											</p>
											<h3 className='mt-1 text-base font-bold text-ink-900 group-hover:text-brand-700'>
												{job.title}
											</h3>
											<p className='mt-1 text-xs text-ink-500'>
												{company?.name}
											</p>
										</div>
										<span className='badge-green'>Open</span>
									</div>
									<div className='mt-3 flex flex-wrap items-center gap-3 text-xs text-ink-600'>
										<span className='inline-flex items-center gap-1'>
											<MapPin size={12} />
											{job.location}
										</span>
										<span>
											{job.paymentType === "hourly"
												? `$${job.paymentAmount}/hr`
												: `$${job.paymentAmount.toLocaleString("en-CA")} fixed`}
										</span>
									</div>
								</Link>
							);
						})}
					</div>
				</div>
			</section>

			<section className='bg-white py-16 sm:py-20'>
				<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
					<h2 className='text-2xl font-bold tracking-tight text-ink-900'>
						Top-rated companies
					</h2>
					<p className='mt-1 text-sm text-ink-500'>
						Verified employers known for great work environments.
					</p>

					<div className='mt-6 grid gap-4 md:grid-cols-3'>
						{featuredCompanies.map((c) => (
							<Link
								to={`/companies/${c.id}`}
								key={c.id}
								className='card p-5 transition-shadow hover:shadow-cardHover'>
								<div className='flex items-start justify-between gap-3'>
									<div>
										<h3 className='text-base font-bold text-ink-900'>
											{c.name}
										</h3>
										<p className='mt-0.5 text-xs text-ink-500'>{c.industry}</p>
									</div>
									{c.verified && (
										<span className='badge-blue'>
											<CheckCircle2 size={12} /> Verified
										</span>
									)}
								</div>
								<div className='mt-3 flex items-center gap-2'>
									<StarRating value={c.rating} size={14} />
									<span className='text-xs text-ink-500'>
										{c.rating.toFixed(1)} ({c.reviewCount})
									</span>
								</div>
								<p className='mt-2 line-clamp-2 text-xs text-ink-600'>
									{c.description}
								</p>
							</Link>
						))}
					</div>
				</div>
			</section>

			<section className='bg-ink-900 py-16'>
				<div className='mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8'>
					<h2 className='text-3xl font-bold text-white'>
						Ready to get to work?
					</h2>
					<p className='mt-3 text-ink-300'>
						Join Jobnet today as a worker or an employer. It only takes a
						minute.
					</p>
					<div className='mt-6 flex flex-wrap justify-center gap-3'>
						<Link
							to='/register?role=worker'
							className='btn-primary px-5 py-3 text-base'>
							I'm a worker
						</Link>
						<Link
							to='/register?role=employer'
							className='btn px-5 py-3 text-base text-white ring-1 ring-white/30 hover:bg-white/10'>
							I'm an employer
						</Link>
					</div>
					<div className='mt-8 flex items-center justify-center gap-2 text-xs text-ink-400'>
						<Star size={12} className='fill-amber-400 text-amber-400' />
						Trusted by trades from coast to coast
					</div>
				</div>
			</section>
		</div>
	);
}
