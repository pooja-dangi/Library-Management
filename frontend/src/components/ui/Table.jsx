export const Table = ({ columns, rows, rowKey }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-3 text-left font-semibold text-gray-700">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((r, idx) => (
            <tr key={rowKey ? rowKey(r) : idx} className="hover:bg-gray-50">
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-3 text-gray-800">
                  {c.cell ? c.cell(r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
          {rows.length === 0 ? (
            <tr>
              <td className="px-4 py-6 text-center text-gray-500" colSpan={columns.length}>
                No data
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
};

