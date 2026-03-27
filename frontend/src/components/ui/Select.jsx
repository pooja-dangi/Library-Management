export const Select = ({ label, name, value, onChange, options, error, disabled }) => {
  return (
    <div className="space-y-1">
      {label ? (
        <label className="block text-sm font-medium text-gray-700" htmlFor={name}>
          {label}
        </label>
      ) : null}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-600 disabled:bg-gray-50 ${
          error ? "border-rose-500" : "border-gray-300"
        }`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
          </option>
        ))}
      </select>
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </div>
  );
};

