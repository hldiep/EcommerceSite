const API_URL = `/api/v1/m/discounts`;

export const fetchDiscountsWithPaging = async ({
    page = 0,
    size = 10,
    search = '',
    sortBy = 'id',
    direction = 'asc',
}) => {
    try {
        const token = localStorage.getItem('MANAGER_token');
        if (!token) throw new Error('Token không tồn tại. Vui lòng đăng nhập lại.');

        const url = new URL(`${API_URL}/page`, window.location.origin);
        url.searchParams.append('page', page);
        url.searchParams.append('size', size);
        url.searchParams.append('sortBy', sortBy);
        url.searchParams.append('direction', direction);
        if (search) url.searchParams.append('search', search);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(err || `Lỗi ${response.status}`);
        }

        const json = await response.json();
        return json.data;
    } catch (error) {
        console.error("Lỗi khi fetch khuyến mãi:", error);
        throw error;
    }
};
export const updateDiscountById = async (id, payload) => {
    try {
        const token = localStorage.getItem('MANAGER_token');
        const response = await fetch(`${API_URL}/update/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();
        return json.data;
    } catch (err) {
        console.error('Lỗi update khuyến mãi:', err);
        throw err;
    }
};
export const createDiscount = async (payload) => {
    try {
        const token = localStorage.getItem('MANAGER_token');

        const response = await fetch(`${API_URL}/add`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': '*/*',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Tạo mã giảm giá thất bại');
        }

        const json = await response.json();
        return json.data;
    } catch (err) {
        console.error('Lỗi tạo mã giảm giá:', err);
        throw err;
    }
};

export const changeDiscountStatus = async (id, status) => {
    try {
        const token = localStorage.getItem('MANAGER_token');
        const response = await fetch(`${API_URL}/change-status/${id}?status=${status}`, {
            method: 'PATCH',
            headers: {
                'Accept': '*/*',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Không thể thay đổi trạng thái khuyễn mãi');
        }

        return await response.json();
    } catch (error) {
        console.error('Lỗi khi thay đổi trạng thái:', error);
        throw error;
    }
};