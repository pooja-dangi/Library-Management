export const RadioGroup = ({ label, name, value, onChange, options, error }) => {
  return (
    <div className="space-y-1">
      {label ? <p className="text-sm font-medium text-gray-700">{label}</p> : null}
      <div className="flex flex-wrap gap-4">
        {options.map((o) => (
          <label key={o.value} className="inline-flex items-center gap-2 text-sm text-gray-800">
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={onChange}
              className="h-4 w-4 accent-indigo-600"
            />
            {o.label}
          </label>
        ))}
      </div>
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </div>
  );
};

