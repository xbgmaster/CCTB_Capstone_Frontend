export default function Footer() {
	return (
		<footer className='mt-auto border-t border-white/10 bg-[var(--navy-deep)]'>
			<div className='mx-auto flex w-full max-w-7xl flex-col items-center gap-6 px-4 py-6 sm:px-6 md:flex-row md:items-center md:justify-center lg:px-8'>
				<div className='flex items-center gap-3'>
					<span className='dot text-xl'>●</span>
					<p
						className='navbar__logo text-base text-[var(--white)]'
						style={{ fontFamily: "var(--font-display)" }}>
						Jobnet
					</p>
				</div>
				<p className='text-sm text-[var(--white)] opacity-80'>
					Built to connect people with work.
				</p>
			</div>
		</footer>
	);
}
