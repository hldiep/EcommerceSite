import React, { useState } from 'react'
import ClippedDrawer from '../dashboard/DashboardLayoutBasic'
import { toast } from 'react-toastify';
import { fetchRevenueReport } from '../../api/revenue';

const RevenueManager = () => {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [unit, setUnit] = useState("DAY");
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFetch = async () => {
        if (!from || !to) return alert("Vui lòng chọn khoảng thời gian");
        setLoading(true);
        const data = await fetchRevenueReport(from, to, unit);
        setReport(data?.data || null);
        setLoading(false);
    };

    return (
        <ClippedDrawer>
            <div>
                <div className="sticky top-16 z-10 bg-white border-b shadow-sm">
                    <div className="flex items-center text-sm text-gray-600 space-x-2 px-4 pt-2">
                        <button className="hover:underline text-blue-600">Dashboard</button>
                        <span>/</span>
                        <span className="text-gray-700 font-medium">Báo cáo thống kê</span>
                    </div>
                    <h2 className="text-xl font-semibold p-4">Báo cáo thống kê</h2>
                </div>

                <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50 min-h-[calc(100vh-80px)]">

                    <div className="bg-white p-4 rounded-lg shadow flex items-end gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Từ ngày</label>
                            <input
                                type="date"
                                className="border rounded px-2 py-1 outline-none"
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Đến ngày</label>
                            <input
                                type="date"
                                className="border rounded px-2 py-1 outline-none"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Thống kê theo</label>
                            <select
                                className="border rounded px-2 py-2 outline-none"
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                            >
                                <option value="DAY">Ngày</option>
                                <option value="WEEK">Tuần</option>
                                <option value="MONTH">Tháng</option>
                            </select>
                        </div>
                        <button
                            onClick={handleFetch}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Lấy dữ liệu
                        </button>
                    </div>

                    {loading &&
                        <div className="flex justify-center items-center py-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-r-transparent"></div>
                            <div className="ml-4 text-blue-600 font-medium text-lg">Đang tải dữ liệu...</div>
                        </div>}

                    {report && (
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="text-lg font-semibold mb-4">Tổng quan</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div className="p-3 bg-gray-100 rounded">Tổng đơn: {report.totalOrders}</div>
                                <div className="p-3 bg-gray-100 rounded">Đơn thành công: {report.totalSuccessOrders}</div>
                                <div className="p-3 bg-gray-100 rounded">Đơn hủy: {report.totalCancelledOrders}</div>
                                <div className="p-3 bg-gray-100 rounded">Khách hàng: {report.totalCustomers}</div>
                                <div className="p-3 bg-gray-100 rounded">Doanh thu: {report.totalRevenue}</div>
                                <div className="p-3 bg-gray-100 rounded">Giảm giá: {report.totalDiscount}</div>
                                <div className="p-3 bg-gray-100 rounded">Thuế: {report.totalTax}</div>
                                <div className="p-3 bg-gray-100 rounded">Phí ship: {report.totalShippingFee}</div>
                            </div>
                        </div>
                    )}

                    {report && report.detailByUnit && (
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="text-lg font-semibold mb-4">Chi tiết</h3>
                            <table className="w-full border-collapse border text-sm">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border px-2 py-1">Thời gian</th>
                                        <th className="border px-2 py-1">Tổng đơn</th>
                                        <th className="border px-2 py-1">Thành công</th>
                                        <th className="border px-2 py-1">Hủy</th>
                                        <th className="border px-2 py-1">Khách hàng</th>
                                        <th className="border px-2 py-1">Doanh thu</th>
                                        <th className="border px-2 py-1">Giảm giá</th>
                                        <th className="border px-2 py-1">Thuế</th>
                                        <th className="border px-2 py-1">Phí ship</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {report.detailByUnit.map((row, idx) => (
                                        <tr key={idx}>
                                            <td className="border px-2 py-1">{row.unit}</td>
                                            <td className="border px-2 py-1">{row.numberOfOrders}</td>
                                            <td className="border px-2 py-1">{row.numberOfSuccessOrders}</td>
                                            <td className="border px-2 py-1">{row.numberOfCancelledOrders}</td>
                                            <td className="border px-2 py-1">{row.numberOfCustomers}</td>
                                            <td className="border px-2 py-1">{row.revenue}</td>
                                            <td className="border px-2 py-1">{row.discount}</td>
                                            <td className="border px-2 py-1">{row.tax}</td>
                                            <td className="border px-2 py-1">{row.shippingFee}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {report && report.detailByUnit.length === 0 && (
                        <p className="text-gray-500">Không có dữ liệu cho khoảng thời gian này.</p>
                    )}
                </div>
            </div>
        </ClippedDrawer>
    );
}

export default RevenueManager