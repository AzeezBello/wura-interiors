export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-ink/10 pb-6">
      <div>
        <h1 className="text-4xl font-medium">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-ink/70">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
}
