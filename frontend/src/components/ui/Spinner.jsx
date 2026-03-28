export const Spinner = ({ label = "Loading..." }) => {
  return (
    <div className="flex items-center gap-3 text-sm font-medium text-slate-300">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500/30 border-t-indigo-500" />
      <span>{label}</span>
    </div>
  );
};

