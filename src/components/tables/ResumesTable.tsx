
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { navigate } from "../../app/hashRouter";

export type Resume = {
  id: string;
  candidateName: string;
  jobTitle: string;
  status: "Draft" | "Published";
  likesCount: number;
  updatedAt: string; 
};

type Props = {
  query: string;
  resumes?: Resume[];
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString();
}

export default function ResumesTable({ query, resumes }: Props) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const data = useMemo<Resume[]>(() => {
    const list = resumes ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return list;

    return list.filter((r) => {
      const haystack = [r.candidateName, r.jobTitle, r.status, r.id].join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }, [query, resumes]);

  const columns = useMemo<ColumnDef<Resume>[]>(() => {
    return [
      {
        id: "candidate",
        header: "Candidate",
        accessorKey: "candidateName",
        cell: ({ row }) => (
          <div className="min-w-55">
            <div className="font-semibold text-gray-900 dark:text-gray-50">
              {row.original.candidateName}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {row.original.jobTitle}
            </div>
          </div>
        ),
      },
      {
        id: "status",
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => (
          <span
            className={[
              "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
              row.original.status === "Published"
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
            ].join(" ")}
          >
            {row.original.status}
          </span>
        ),
      },
      {
        id: "likes",
        header: "Likes",
        accessorKey: "likesCount",
        cell: ({ row }) => (
          <span className="text-sm text-gray-800 dark:text-gray-100">
            {row.original.likesCount}
          </span>
        ),
      },
      {
        id: "updatedAt",
        header: "Updated",
        accessorKey: "updatedAt",
        cell: ({ row }) => (
          <span className="text-sm text-gray-700 dark:text-gray-200">{formatDate(row.original.updatedAt)}</span>
        ),
      },
    ];
  }, []);

  const table = useReactTable({
    data,
    columns,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-lg border border-green-200 bg-white dark:border-green-500/40 dark:bg-gray-900">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    className="border-b border-green-200 bg-gray-50 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-700 dark:border-green-500/40 dark:bg-gray-800 dark:text-gray-200"
                  >
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-3 py-10 text-center text-sm text-gray-600 dark:text-gray-300">
                  No results
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate({ name: "resumeDetails", id: row.original.id })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      navigate({ name: "resumeDetails", id: row.original.id });
                    }
                  }}
                  className="cursor-pointer hover:bg-gray-50/60 dark:hover:bg-gray-800/60"
                  aria-label={`Open resume: ${row.original.candidateName}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="border-b border-gray-100 px-3 py-2 align-top text-sm text-gray-800 dark:border-gray-800 dark:text-gray-100"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
