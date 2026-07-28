interface ContentPaginationProps {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const pageSizes = [12, 24, 48];

export function ContentPagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: ContentPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)
    .filter((value) => {
      if (totalPages <= 7) return true;
      if (value === 1 || value === totalPages) return true;
      return Math.abs(value - page) <= 1;
    });

  return (
    <div className="flex flex-col gap-4 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">
        Showing {start} to {end} of {totalItems} results
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 disabled:opacity-40"
        >
          Previous
        </button>

        {pages.map((value, index, array) => {
          const prev = array[index - 1];
          const showEllipsis = prev != null && value - prev > 1;
          return (
            <span key={value} className="flex items-center gap-2">
              {showEllipsis && <span className="text-slate-400">…</span>}
              <button
                type="button"
                onClick={() => onPageChange(value)}
                className={`min-w-9 rounded-lg px-3 py-1.5 text-sm ${
                  page === value
                    ? "bg-indigo-600 text-white"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {value}
              </button>
            </span>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 disabled:opacity-40"
        >
          Next
        </button>
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span>Rows per page</span>
        <select
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700"
        >
          {pageSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
