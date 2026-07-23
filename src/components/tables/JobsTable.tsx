/* eslint-disable react-hooks/incompatible-library */
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { navigate } from "../../app/hashRouter";

export type Job = {
  id: string;
  title: string;
  company: string;
  updatedAt: string; // ISO
  salaryMin?: number;
  salaryMax?: number;
  location: string;
  isOpen: boolean;
};

type Props = {
  query: string;
  jobs?: Job[];
};

function formatSalary(job: Job) {
  const { salaryMin, salaryMax } = job;
  if (typeof salaryMin !== "number" && typeof salaryMax !== "number") return "—";
  if (typeof salaryMin === "number" && typeof salaryMax === "number") return `${salaryMin}–${salaryMax}`;
  if (typeof salaryMin === "number") return `${salaryMin}+`;
  return `${salaryMax}+`;
}

export default function JobsTable({ query, jobs }: Props) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const data = useMemo<Job[]>(() => {
    const list = jobs ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return list;

    return list.filter((j) => {
      const haystack = [j.title, j.company, j.location, j.isOpen ? "open" : "closed", j.id]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [jobs, query]);

  const columns = useMemo<ColumnDef<Job>[]>(() => {
    return [
      {
        id: "title",
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <div className="min-w-55">
            <div className="font-semibold text-gray-900 dark:text-gray-50">{row.original.title}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{row.original.company}</div>
          </div>
        ),
      },
      {
        id: "location",
        accessorKey: "location",
        header: "Location",
        cell: ({ row }) => <span className="text-sm text-gray-700 dark:text-gray-200">{row.original.location}</span>,
      },
      {
        id: "salary",
        header: "Salary",
        cell: ({ row }) => <span className="text-sm text-gray-700 dark:text-gray-200">{formatSalary(row.original)}</span>,
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => (
          <span
            className={[
              "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
              row.original.isOpen
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300",
            ].join(" ")}
          >
            {row.original.isOpen ? "Open" : "Closed"}
          </span>
        ),
      },
      {
        id: "updatedAt",
        header: "Updated",
        cell: ({ row }) => (
          <span className="text-sm text-gray-700 dark:text-gray-200">{new Date(row.original.updatedAt).toLocaleString()}</span>
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
                    className="border-b border-gray-200 bg-gray-50 px-2 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-700 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-200 sm:px-3 sm:py-2 sm:text-xs"
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
                <td colSpan={columns.length} className="px-2 py-10 text-center text-sm text-gray-600 dark:text-gray-300 sm:px-3">
                  No results
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate({ name: "jobDetails", id: row.original.id })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      navigate({ name: "jobDetails", id: row.original.id });
                    }
                  }}
                  className="cursor-pointer hover:bg-gray-50/60 dark:hover:bg-gray-800/60"
                  aria-label={`Open job: ${row.original.title}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="border-b border-gray-100 px-2 py-2 align-top text-xs text-gray-800 dark:border-gray-800 dark:text-gray-100 sm:px-3 sm:py-2 sm:text-sm"
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
