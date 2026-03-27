export const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  disabled,
}) => {
  return (
    <div className="space-y-1">
      {label ? (
        <label className="block text-sm font-medium text-gray-700" htmlFor={name}>
          {label}
        </label>
      ) : null}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-600 disabled:bg-gray-50 ${
          error ? "border-rose-500" : "border-gray-300"
        }`}
      />
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </div>
  );
};

