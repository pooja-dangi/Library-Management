export const Table = ({ columns, rows, rowKey }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/5 bg-white/[0.02]">
      <table className="min-w-full divide-y divide-white/5">
        <thead>
          <tr className="bg-white/5">
            {columns.map((c) => (
              <th
                key={c.key}
                className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400"
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 font-medium">
          {rows.map((r, idx) => (
            <tr key={rowKey ? rowKey(r) : idx} className="transition-colors hover:bg-white/[0.03]">
              {columns.map((c) => (
                <td key={c.key} className="whitespace-nowrap px-6 py-4 text-sm text-slate-200">
                  {c.cell ? c.cell(r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-sm text-slate-500">
                No data available
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
};

