export const Button = ({
  children,
  variant = "primary",
  type = "button",
  disabled,
  onClick,
  className = "",
}) => {
  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-600",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-400",
    danger: "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-600",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400",
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
    >
      {children}
    </button>
  );
};

