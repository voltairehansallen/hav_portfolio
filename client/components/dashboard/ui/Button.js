import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary: 'border border-vision text-vision hover:bg-vision hover:text-bg',
  danger: 'border border-ambition text-ambition hover:bg-ambition hover:text-bg',
  ghost: 'border border-panel-border text-muted hover:text-white hover:border-white/30',
};

export default function Button({
  variant = 'primary',
  className = '',
  icon: Icon,
  loading = false,
  disabled,
  children,
  ...props
}) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`flex items-center gap-2 rounded px-4 py-2 font-mono text-sm transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : Icon && <Icon size={14} />}
      {children}
    </button>
  );
}
