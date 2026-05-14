import type { ReactNode } from 'react'

export type DataTableProps = {
  minWidthClass: string
  columns: string[]
  isLoading: boolean
  error?: string
  emptyMessage: string
  dataLength: number
  children: ReactNode
  /** When `isLoading` is true, render this many skeleton rows instead of a single “Loading…” cell. */
  skeletonRowCount?: number
}

export function DataTable({
  minWidthClass,
  columns,
  isLoading,
  error,
  emptyMessage,
  dataLength,
  children,
  skeletonRowCount = 5,
}: DataTableProps) {
  const colSpan = columns.length

  const skeletonRows =
    isLoading && skeletonRowCount > 0
      ? Array.from({ length: skeletonRowCount }, (_, rowIdx) => (
          <tr key={`skeleton-row-${rowIdx}`} className="animate-pulse">
            {columns.map((col) => (
              <td key={`${rowIdx}-${col}`} className="px-4 py-3">
                <div
                  className="h-4 rounded bg-slate-200"
                  style={{
                    width: `${48 + ((rowIdx + col.length) % 5) * 8}%`,
                    maxWidth: '160px',
                  }}
                />
              </td>
            ))}
          </tr>
        ))
      : null

  return (
    <div className="overflow-auto rounded-xl border border-slate-200">
      <table className={`w-full ${minWidthClass} text-left text-sm`}>
        <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-4 py-3 font-medium">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {isLoading && skeletonRows}
          {!isLoading && error ? (
            <tr>
              <td colSpan={colSpan} className="px-4 py-12 text-center text-sm font-medium text-red-600">
                {error}
              </td>
            </tr>
          ) : !isLoading && !error && dataLength === 0 ? (
            <tr>
              <td colSpan={colSpan} className="px-4 py-12 text-center text-sm text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          ) : !isLoading && !error && dataLength > 0 ? (
            children
          ) : null}
        </tbody>
      </table>
    </div>
  )
}
