export default function Field({ label, as = 'input', ...props }) {
  const Tag = as;
  return (
    <div>
      <label className="mb-1 block font-mono text-xs text-muted" htmlFor={props.id || props.name}>
        {label}
      </label>
      <Tag
        id={props.id || props.name}
        className="w-full rounded border border-panel-border bg-bg px-3 py-2 text-sm text-white outline-none focus:border-vision"
        {...props}
      />
    </div>
  );
}
