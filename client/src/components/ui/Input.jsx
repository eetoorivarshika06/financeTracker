export function Input({ label, className = "", ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-text-muted">
          {label}
        </label>
      )}
      <input className="finance-input" {...props} />
    </div>
  );
}

export default Input;
