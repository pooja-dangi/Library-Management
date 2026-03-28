export const Card = ({ title, subtitle, children, right, className = "" }) => {
  return (
    <div className={`overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl ${className}`}>
      {(title || subtitle || right) && (
        <div className="flex items-start justify-between gap-4 border-b border-white/5 px-5 py-4">
          <div>
            {title ? <h2 className="text-base font-bold tracking-tight text-white">{title}</h2> : null}
            {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
          </div>
          {right ? <div>{right}</div> : null}
        </div>
      )}
      <div className="px-5 py-4">{children}</div>
    </div>
  );
};

