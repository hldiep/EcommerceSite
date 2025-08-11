const API_URL = `/api/v1/m/revenues`;
export const fetchRevenueReport = async (from, to, unit) => {
    try {
        const token = localStorage.getItem('MANAGER_token');
        const response = await fetch(
            `${API_URL}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&unit=${encodeURIComponent(unit)}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Lỗi API: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi khi fetch dữ liệu báo cáo:", error);
        return null;
    }
};
