export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="card flex flex-col items-center justify-center px-6 py-12 text-center">
      {Icon && (
        <div className="mb-3 rounded-full bg-ink-100 p-3 text-ink-500">
          <Icon size={22} />
        </div>
      )}
      <p className="text-base font-semibold text-ink-900">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-ink-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
