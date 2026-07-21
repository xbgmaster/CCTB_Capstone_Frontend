import { HardHat } from "lucide-react";

export default function Footer() {
	return (
		<footer className='mt-auto border-t border-ink-200 bg-white'>
			<div className='mx-auto flex items-center max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8'>
				<div className='flex items-center gap-2 ml-auto md:ml-0'>
					<span className='flex h-7 w-7 items-center justify-center rounded-md bg-brand-600 text-white'>
						<HardHat size={14} />
					</span>
					<p className='text-sm text-ink-600'>
						<span className='font-semibold text-ink-900'>Jobnet</span>
						<span className='ml-2 text-ink-400'>
							- Built to connect people with works
						</span>
					</p>
				</div>
			</div>
		</footer>
	);
}
