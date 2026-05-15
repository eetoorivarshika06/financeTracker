export function Alert({ children, variant = "error" }) {
  const styles = {
    error: "border-danger/30 bg-danger/10 text-danger",
    success: "border-success/30 bg-success/10 text-success",
    info: "border-primary/30 bg-primary/10 text-primary",
  };

  return (
    <div
      className={`rounded-xl border px-4 py-3 text-sm ${styles[variant]}`}
      role="alert"
    >
      {children}
    </div>
  );
}

export default Alert;
