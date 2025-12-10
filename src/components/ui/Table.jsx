import React, { useMemo, useState } from "react";

export default function Table({
    isCheckbox = false,

    pageSize = 10,
    totalItems = 0,
    currentPage = 1,

    columns = [],
    data = [],

    onPaging = () => {},
    onPagingSizeChange = () => {},
    onRowClick = () => {},
}) {
    const [selectedIds, setSelectedIds] = useState([]);

    const totalPages = totalItems === 0 ? 1 : Math.ceil(totalItems / pageSize);

    // --- Select 1 row ---
    const handleSelectRow = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter((x) => x !== id)
                : [...prev, id]
        );
    };

    // --- Select all rows on current page ---
    const handleSelectAll = (rows) => {
        const ids = rows.map((r) => r.id);
        const isAllSelected = ids.every((id) => selectedIds.includes(id));

        setSelectedIds((prev) =>
            isAllSelected
                ? prev.filter((id) => !ids.includes(id)) // uncheck all
                : [...new Set([...prev, ...ids])] // check all
        );
    };

    // --- Change page ---
    const handleChangePage = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        onPaging(newPage);
    };

    // --- Change page size ---
    const handleChangeSize = (newSize) => {
        onPagingSizeChange(newSize);
    };

    const pagedData = data;

    // --- Check if all rows in page are selected ---
    const isAllSelected =
        pagedData.length > 0 &&
        pagedData.every((item) => selectedIds.includes(item.id));

    return (
        <div className="w-full border rounded-lg bg-white shadow">
            <table className="w-full border-collapse">
                <thead className="bg-gray-100 border-b">
                    <tr>
                        {isCheckbox && (
                            <th className="p-3 text-left w-10">
                                <input
                                    type="checkbox"
                                    checked={isAllSelected}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={() => handleSelectAll(pagedData)}
                                />
                            </th>
                        )}

                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className="p-3 text-left font-semibold text-gray-700"
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {totalItems === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length + (isCheckbox ? 1 : 0)}
                                className="text-center py-6"
                            >
                                <div className="flex flex-col items-center justify-center space-y-2">
                                    <img
                                        src="https://www.shutterstock.com/image-vector/no-result-document-file-data-600nw-2293706569.jpg"
                                        alt="Không có dữ liệu"
                                        className="w-32 h-32 object-contain opacity-60"
                                    />
                                    <p className="text-gray-500">Không có dữ liệu</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        pagedData.map((row) => (
                            <tr
                                key={row.id}
                                className="border-b hover:bg-blue-50 cursor-pointer transition"
                                onClick={() => onRowClick(row)}
                            >
                                {isCheckbox && (
                                    <td className="p-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(row.id)}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={() => handleSelectRow(row.id)}
                                        />
                                    </td>
                                )}

                                {columns.map((col) => (
                                    <td key={col.key} className="p-3 text-gray-800">
                                        {col.render
                                            ? col.render(row)
                                            : col.type === "html"
                                            ? (
                                                <span
                                                    dangerouslySetInnerHTML={{
                                                        __html: row[col.key],
                                                    }}
                                                />
                                            )
                                            : col.type === "image"
                                            ? (
                                                <img
                                                    src={row[col.key]}
                                                    className="w-12 h-12 object-cover rounded"
                                                    alt=""
                                                />
                                            )
                                            : col.type === "status"
                                            ? (
                                                <span
                                                    className={`px-2 py-1 text-xs rounded ${
                                                        row[col.key] === "active"
                                                            ? "bg-green-100 text-green-600"
                                                            : "bg-red-100 text-red-600"
                                                    }`}
                                                >
                                                    {row[col.key]}
                                                </span>
                                            )
                                            : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="p-4 flex justify-between items-center text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <span>Hiển thị</span>

                    <select
                        className="border rounded p-1 outline-none"
                        value={pageSize}
                        onChange={(e) => handleChangeSize(Number(e.target.value))}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                </div>

                <div className="flex gap-2 items-center">
                    <button
                        className="px-3 py-1 border rounded disabled:opacity-40"
                        disabled={currentPage <= 1}
                        onClick={() => handleChangePage(currentPage - 1)}
                    >
                        Prev
                    </button>

                    <span>
                        Trang {currentPage}/{totalPages}
                    </span>

                    <button
                        className="px-3 py-1 border rounded disabled:opacity-40"
                        disabled={currentPage >= totalPages}
                        onClick={() => handleChangePage(currentPage + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
