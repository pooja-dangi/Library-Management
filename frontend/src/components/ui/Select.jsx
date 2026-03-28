export const Select = ({ label, name, value, onChange, options, error, disabled }) => {
  return (
    <div className="space-y-1.5">
      {label ? (
        <label className="block text-sm font-semibold text-slate-300" htmlFor={name}>
          {label}
        </label>
      ) : null}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full rounded-xl border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-all focus:border-indigo-500 focus:bg-white/10 focus:ring-4 focus:ring-indigo-500/20 disabled:opacity-50 ${
          error ? "border-rose-500 ring-4 ring-rose-500/20" : "border-white/10"
        }`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled} className="bg-slate-900 text-white">
            {o.label}
          </option>
        ))}
      </select>
      {error ? <p className="text-xs font-medium text-rose-400">{error}</p> : null}
    </div>
  );
};

