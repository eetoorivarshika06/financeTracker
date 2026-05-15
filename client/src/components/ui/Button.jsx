const variants = {
  primary:
    "bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/25",
  secondary:
    "bg-secondary/15 text-secondary border border-secondary/30 hover:bg-secondary/25",
  ghost: "bg-transparent text-text-muted hover:bg-white/5 hover:text-white",
  danger:
    "bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25",
  outline:
    "bg-transparent border border-white/10 text-white hover:bg-white/5",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  ...props
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
