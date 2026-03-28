export const Button = ({
  children,
  variant = "primary",
  fullWidth = false,
  type = "button",
  disabled,
  onClick,
  className = "",
}) => {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
    
  const variants = {
    primary: "bg-indigo-600 text-white shadow-[0_0_15px_-3px_rgba(79,70,229,0.5)] hover:bg-indigo-500 hover:shadow-[0_0_20px_0px_rgba(79,70,229,0.6)]",
    secondary: "bg-white/10 text-white border border-white/10 hover:bg-white/20 backdrop-blur-sm",
    danger: "bg-rose-600 text-white shadow-[0_0_15px_-3px_rgba(225,29,72,0.4)] hover:bg-rose-500",
    ghost: "bg-transparent text-slate-300 hover:bg-white/10 hover:text-white",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant] || variants.primary} ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {children}
    </button>
  );
};

