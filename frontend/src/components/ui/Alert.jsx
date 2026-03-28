export const Alert = ({ variant = "info", children }) => {
  const styles = {
    info: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    success: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    warn: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    error: "bg-rose-500/10 text-rose-300 border-rose-500/20",
  };
  return <div className={`rounded-xl border px-4 py-3 text-sm font-medium backdrop-blur-md ${styles[variant] || styles.info}`}>{children}</div>;
};

