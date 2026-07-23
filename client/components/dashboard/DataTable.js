import Button from './ui/Button';

/**
 * @param {Array<{key: string, label: string, render?: Function}>} columns
 * @param {Array} rows
 * @param {Function} onEdit
 * @param {Function} onDelete
 */
export default function DataTable({ columns, rows, onEdit, onDelete }) {
  if (rows.length === 0) {
    return <p className="font-mono text-sm text-muted">// aucune entrée pour l'instant</p>;
  }

  return (
    <div className="overflow-x-auto rounded border border-panel-border">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-panel-border font-mono text-xs text-muted">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 font-medium">
                {col.label}
              </th>
            ))}
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-panel-border last:border-0">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-white">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  {onEdit && (
                    <Button variant="ghost" onClick={() => onEdit(row)}>
                      éditer
                    </Button>
                  )}
                  {onDelete && (
                    <Button variant="danger" onClick={() => onDelete(row)}>
                      suppr.
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
