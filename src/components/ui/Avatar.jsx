const COLORS = [
  'bg-brand-100 text-brand-700',
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-violet-100 text-violet-700',
  'bg-pink-100 text-pink-700',
  'bg-amber-100 text-amber-700',
  'bg-cyan-100 text-cyan-700',
];

const SIZES = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
  xl: 'h-20 w-20 text-xl',
};

function hashIndex(str = '') {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h) % COLORS.length;
}

export default function Avatar({ initials = '?', seed = '', size = 'md', className = '' }) {
  const color = COLORS[hashIndex(seed || initials)];
  return (
    <div
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${color} ${SIZES[size]} ${className}`}
      aria-hidden
    >
      {initials.slice(0, 2).toUpperCase()}
    </div>
  );
}
