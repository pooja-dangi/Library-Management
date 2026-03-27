export const Checkbox = ({ label, name, checked, onChange, error }) => {
  return (
    <div className="space-y-1">
      <label className="inline-flex items-center gap-2 text-sm text-gray-800">
        <input
          type="checkbox"
          name={name}
          checked={!!checked}
          onChange={onChange}
          className="h-4 w-4 rounded border-gray-300 accent-indigo-600"
        />
        {label}
      </label>
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </div>
  );
};

