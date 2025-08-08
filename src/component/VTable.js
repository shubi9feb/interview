import { Pagination, Stack } from "@mui/material";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/* eslint-disable react/prop-types */
const Table = ({
  cols = [],
  data = [],
  totalPages = 1,
  page = 1,
  handlePageChange = () => {},
  isTableLoading = false,
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  useEffect(() => {
    setSortConfig({ key: "default", direction: "desc" });
  }, []);

  const sortedData = () => {
    if (!data) return [];
    if (sortConfig.key !== null) {
      const sortedItems = [...data];
      sortedItems.sort((a, b) => {
        const valueA = a[sortConfig.key];
        const valueB = b[sortConfig.key];
        if (typeof valueA === "number" && typeof valueB === "number") {
          return sortConfig.direction === "asc"
            ? valueA - valueB
            : valueB - valueA;
        }
        if (typeof valueA === "string" && typeof valueB === "string") {
          return sortConfig.direction === "asc"
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }
        const stringA = String(valueA ?? "").toLowerCase();
        const stringB = String(valueB ?? "").toLowerCase();
        return sortConfig.direction === "asc"
          ? stringA.localeCompare(stringB)
          : stringB.localeCompare(stringA);
      });
      return sortedItems;
    }
    return data;
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // const onPaginationChange = (event, value) => {
  //   const pageValue = Math.max(1, Math.min(value, totalPages));
  //   handlePageChange(event, pageValue);
  // };

  const safeTotalPages = Math.max(1, totalPages);
  const safePage = Math.min(Math.max(1, page), safeTotalPages);

  const onPaginationChange = (_event, value) => {
    const pageValue = Number.isFinite(value)
      ? Math.max(1, Math.min(value, safeTotalPages))
      : 1;
    handlePageChange(pageValue);
  };

  return (
    <div className="p-2 bg-primaryDarkCards rounded-lg border border-primaryGray-700 overflow-x-auto table-content">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            {cols.map((col, index) => (
              <th
                key={index}
                style={{ cursor: col.sortable ? "pointer" : "default" }}
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                onClick={() => col.sortable && requestSort(col.key)}
              >
                <div className="flex items-center justify-center gap-1">
                  {col.title}
                  {col.sortable && sortConfig.key === col.key && (
                    <ArrowUpDownIcon className="w-4 h-4" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-600">
          {isTableLoading ? (
            <tr>
              <td colSpan={cols.length} className="text-center">
                <SkeletonTheme baseColor="#202020" highlightColor="#19191c">
                  <Skeleton height={30} count={10} />
                </SkeletonTheme>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={cols.length} className="text-center py-4">
                <img
                  src="/datanotfound.svg"
                  alt="No data"
                  className="mx-auto"
                  style={{ width: "150px" }}
                />
              </td>
            </tr>
          ) : (
            sortedData().map((item, rowIndex) => (
              <tr key={rowIndex}>
                {cols.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-6 py-4 text-xs font-medium text-gray-500 truncate ${
                      col.colored ? "text-gradient font-semibold" : ""
                    }`}
                  >
                    {col.render
                      ? col.render(item, rowIndex)
                      : item[col.dataIndex]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Stack
        spacing={2}
        direction="row"
        className="mt-3 justify-center items-center"
      >
        <button
          onClick={() => onPaginationChange(null, safePage - 1)}
          disabled={safePage <= 1}
          className="px-3 py-1 rounded border bg-white text-sm disabled:opacity-50"
        >
          Prev
        </button>

        <Pagination
          page={safePage}
          onChange={onPaginationChange} // forwards page number only
          count={safeTotalPages}
          color="primary"
          variant="outlined"
          shape="rounded"
        />

        <button
          onClick={() => onPaginationChange(null, safePage + 1)}
          disabled={safePage >= safeTotalPages}
          className="px-3 py-1 rounded border bg-white text-sm disabled:opacity-50"
        >
          Next
        </button>
      </Stack>
    </div>
  );
};

export default Table;
