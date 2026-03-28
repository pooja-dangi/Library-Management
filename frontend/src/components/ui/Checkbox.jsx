export const Checkbox = ({ label, name, checked, onChange, error }) => {
  return (
    <div className="space-y-1">
      <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-slate-300 transition-colors hover:text-white">
        <input
          type="checkbox"
          name={name}
          checked={!!checked}
          onChange={onChange}
          className="h-5 w-5 rounded-md border-white/10 bg-white/5 text-indigo-600 transition focus:ring-4 focus:ring-indigo-500/20 disabled:opacity-50"
        />
        {label}
      </label>
      {error ? <p className="text-xs font-medium text-rose-400">{error}</p> : null}
    </div>
  );
};

