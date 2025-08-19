import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ClippedDrawer from './DashboardLayoutBasic';
import { fetchRevenueReport } from '../../api/revenue';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip as ReTooltip,
    Legend as ReLegend,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from 'recharts';

const COLORS = [
    "#4F46E5",
    "#06B6D4",
    "#F59E0B",
    "#EF4444",
    "#10B981",
    "#8B5CF6",
    "#F472B6",
];
const Tongquan = () => {
    const navigate = useNavigate();
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [unit, setUnit] = useState("DAY");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [pieData, setPieData] = useState([]);
    const [barData, setBarData] = useState([]);

    const parseResponse = (report) => {
        if (!report) return { pie: [], bar: [] };

        // Biểu đồ tròn: số liệu tổng
        const pie = [
            { name: "Tổng đơn hàng", value: report.totalOrders || 0 },
            { name: "Đơn thành công", value: report.totalSuccessOrders || 0 },
            { name: "Đơn hủy", value: report.totalCancelledOrders || 0 },
            { name: "Khách hàng", value: report.totalCustomers || 0 },
            { name: "Doanh thu", value: report.totalRevenue || 0 },
            { name: "Giảm giá", value: report.totalDiscount || 0 },
            { name: "Thuế", value: report.totalTax || 0 },
            { name: "Phí vận chuyển", value: report.totalShippingFee || 0 },
        ];

        // Biểu đồ cột: doanh thu theo thời gian
        const bar = (report.detailByUnit || []).map((item) => ({
            name: item.unit,
            revenue: item.revenue || 0,
        }));

        return { pie, bar };
    };

    const handleFetch = async () => {
        if (!from || !to) return alert("Vui lòng chọn khoảng thời gian");
        setLoading(true);
        const res = await fetchRevenueReport(from, to, unit);
        const report = res?.data || null;
        if (!report) {
            setError("Không có dữ liệu");
            setPieData([]);
            setBarData([]);
        } else {
            const { pie, bar } = parseResponse(report);
            setPieData(pie);
            setBarData(bar);
        }
        setLoading(false);
    };

    const formatDateLocal = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const today = new Date();
        const prior = new Date(today);
        prior.setDate(today.getDate() - 6);

        setFrom(formatDateLocal(prior));
        setTo(formatDateLocal(today));
    }, []);

    useEffect(() => {
        if (from && to) {
            handleFetch();
        }
    }, [from, to, unit]);
    return (
        <ClippedDrawer>
            <div>
                <div className="sticky top-16 z-10 bg-white border-b shadow-sm">
                    <div className="flex items-center text-sm text-gray-600 space-x-2 px-4 pt-2">
                        <button className="hover:underline text-blue-600">
                            Dashboard
                        </button>
                        <span>/</span>
                        <span className="text-gray-700 font-medium">Tổng quan</span>
                    </div>
                    <h2 className="text-xl font-semibold p-4">Tổng quan</h2>
                </div>
                <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50 min-h-[calc(100vh-80px)]">
                    <div className="bg-white rounded-2xl shadow p-4 flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                            <div className="col-span-1 md:col-span-1">
                                <label className="text-sm block mb-1">Từ ngày</label>
                                <input
                                    type="date"
                                    className="w-full border rounded p-2 outline-none"
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value)}
                                />
                            </div>
                            <div className="col-span-1 md:col-span-1">
                                <label className="text-sm block mb-1">Đến ngày</label>
                                <input
                                    type="date"
                                    className="w-full border rounded p-2 outline-none"
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                />
                            </div>
                            <div className="col-span-1 md:col-span-1">
                                <label className="text-sm block mb-1">Đơn vị</label>
                                <select className="w-full border rounded p-2 py-3 outline-none" value={unit} onChange={(e) => setUnit(e.target.value)}>
                                    <option value="DAY">Ngày</option>
                                    <option value="WEEK">Tuần</option>
                                    <option value="MONTH">Tháng</option>
                                </select>
                            </div>
                            <div className="col-span-1 md:col-span-1 flex gap-2">
                                <button
                                    onClick={handleFetch}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
                                    disabled={loading}
                                >
                                    {loading ? "Đang tải..." : "Tải báo cáo"}
                                </button>
                                <button
                                    onClick={() => {
                                        setFrom("");
                                        setTo("");
                                    }}
                                    className="px-4 py-2 border rounded-lg"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded">{error}</div>
                    )}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow p-4 h-96">
                        <h3 className="text-lg font-medium mb-2">Doanh thu theo thời gian</h3>
                        {barData.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-gray-500">Không có dữ liệu</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="85%">
                                <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                                    <YAxis />
                                    <ReTooltip formatter={(value) => new Intl.NumberFormat('vi-VN').format(value)} />
                                    <Bar
                                        dataKey="revenue"
                                        name="Doanh thu"
                                        fill="#4F46E5"
                                        radius={[6, 6, 0, 0]}
                                        barSize={30}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                    <div className="lg:col-span-1 bg-white rounded-2xl shadow p-4 h-96">
                        <h3 className="text-lg font-medium mb-2">Phân bổ theo danh mục</h3>
                        {pieData.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-gray-500">Không có dữ liệu</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="85%">
                                <PieChart>
                                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <ReTooltip />
                                    <ReLegend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>
        </ClippedDrawer>
    )
}

export default Tongquan