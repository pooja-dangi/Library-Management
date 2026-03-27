export const Card = ({ title, subtitle, children, right }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      {(title || subtitle || right) && (
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4">
          <div>
            {title ? <h2 className="text-base font-semibold text-gray-900">{title}</h2> : null}
            {subtitle ? <p className="mt-1 text-sm text-gray-600">{subtitle}</p> : null}
          </div>
          {right ? <div>{right}</div> : null}
        </div>
      )}
      <div className="px-5 py-4">{children}</div>
    </div>
  );
};

