const API_URL = `/api/v1/m/product-variants`;

export const fetchProductVariantsWithPaging = async ({ page = 0, size = 10, search = '' }) => {
    try {
        const token = localStorage.getItem('MANAGER_token');
        if (!token) {
            throw new Error('Token không tồn tại. Vui lòng đăng nhập lại.');
        }

        const url = new URL(`/page`, window.location.origin);
        url.searchParams.append('page', page);
        url.searchParams.append('size', size);
        url.searchParams.append('sortBy', 'id');
        url.searchParams.append('direction', 'asc');

        if (search) {
            url.searchParams.append('search', search);
        }

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
        console.error("Lỗi khi fetch product variant:", error);
        throw error;
    }
};
export const updateProductVariantById = async (id, payload) => {
    try {
        const token = localStorage.getItem('MANAGER_token');
        const response = await fetch(`/update/${id}`, {
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
        console.error('Lỗi update product variant:', err);
        throw err;
    }
};
export const createProductVariant = async (payload) => {
    try {
        const token = localStorage.getItem('MANAGER_token');

        const response = await fetch('/add', {
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
            throw new Error(errorText || 'Tạo product variant thất bại');
        }

        const json = await response.json();
        return json.data;
    } catch (err) {
        console.error('Lỗi tạo product variant:', err);
        throw err;
    }
};
export const fetchProductVariantById = async (id) => {
    try {
        const token = localStorage.getItem('MANAGER_token');
        const response = await fetch(`${API_URL}/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Không tìm thấy');
        }
        const json = await response.json();
        return json.data;
    } catch (error) {
        console.error('Lỗi khi gọi API', error);
        throw new Error(error.message || 'Đã xảy ra lỗi khi lấy thông tin');
    }
};

export const changeProductVariantStatus = async (id, status) => {
    try {
        const token = localStorage.getItem('MANAGER_token');
        const response = await fetch(`/change-status/${id}?status=${status}`, {
            method: 'PATCH',
            headers: {
                'Accept': '*/*',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Không thể thay đổi trạng thái biến thể');
        }

        return await response.json();
    } catch (error) {
        console.error('Lỗi khi thay đổi trạng thái:', error);
        throw error;
    }
};
