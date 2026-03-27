export const Alert = ({ variant = "info", children }) => {
  const styles = {
    info: "border-blue-200 bg-blue-50 text-blue-900",
    error: "border-rose-200 bg-rose-50 text-rose-900",
    success: "border-emerald-200 bg-emerald-50 text-emerald-900",
    warn: "border-amber-200 bg-amber-50 text-amber-900",
  };
  return <div className={`rounded-xl border px-4 py-3 text-sm ${styles[variant]}`}>{children}</div>;
};

