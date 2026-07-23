export default function EntryRow({ title, subtitle, meta, description }) {
  return (
    <div className="border-b border-panel-border py-4 last:border-0">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-body font-semibold text-white">{title}</p>
        {meta && <p className="font-mono text-xs text-muted">{meta}</p>}
      </div>
      {subtitle && <p className="text-sm text-vision">{subtitle}</p>}
      {description && <p className="mt-1 text-sm text-muted">{description}</p>}
    </div>
  );
}
