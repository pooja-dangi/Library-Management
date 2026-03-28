export const RadioGroup = ({ label, name, value, onChange, options, error }) => {
  return (
    <div className="space-y-1.5">
      {label ? <p className="text-sm font-semibold text-slate-300">{label}</p> : null}
      <div className="flex flex-wrap gap-5">
        {options.map((o) => (
          <label key={o.value} className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-300 transition-colors hover:text-white">
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={onChange}
              className="h-4 w-4 border-white/10 bg-white/5 text-indigo-600 accent-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
            />
            {o.label}
          </label>
        ))}
      </div>
      {error ? <p className="text-xs font-medium text-rose-400">{error}</p> : null}
    </div>
  );
};

