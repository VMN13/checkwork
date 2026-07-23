import type { ReactNode } from "react";

type Row = {
  keyLabel: ReactNode;
  value: ReactNode;
};

type Props = {
  rows: Row[];
  leftHeader?: ReactNode;
  rightHeader?: ReactNode;
};

export default function KeyValueTable({
  rows,
  leftHeader = "Field",
  rightHeader = "Value",
}: Props) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="border-b border-gray-200 bg-gray-50 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-700 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-200">
              {leftHeader}
            </th>
            <th className="border-b border-gray-200 bg-gray-50 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-700 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-200">
              {rightHeader}
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.map((r, idx) => (
            <tr key={idx}>
              <td className="border-b border-gray-100 px-3 py-2 text-sm text-gray-800 dark:border-gray-800 dark:text-gray-100">
                {r.keyLabel}
              </td>
              <td className="border-b border-gray-100 px-3 py-2 text-sm text-gray-800 dark:border-gray-800 dark:text-gray-100">
                {r.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
