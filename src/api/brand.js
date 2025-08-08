const API_URL = `/api/v1/brands`;

export const getAllBrand = async () => {
    try {
        const response = await fetch(`${API_URL}/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const text = await response.text();
            console.error("Lỗi response:", response.status, text);
            throw new Error(`Lỗi response: ${response.status}`);
        }

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error("Lỗi kết nối brand API:", error);
        throw error;
    }
};

export const fetchBrandById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Không tìm thấy brand');
        }
        const json = await response.json();
        return json.data;
    } catch (error) {
        console.error('Lỗi khi gọi API', error);
        throw new Error(error.message || 'Đã xảy ra lỗi khi lấy thông tin');
    }
};
export const fetchBrandsByCategoryWithPaging = async ({
    page = 0,
    size = 20,
    sortBy = 'id',
    direction = 'asc',
}) => {
    try {
        const url = new URL(`${API_URL}/by-category/${id}`, window.location.origin);
        url.searchParams.append('page', page);
        url.searchParams.append('size', size);
        url.searchParams.append('sortBy', sortBy);
        url.searchParams.append('direction', direction);
        if (search) url.searchParams.append('search', search);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
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
        console.error("Lỗi khi fetch brand:", error);
        throw error;
    }
};
//manager
export const fetchBrandsWithPaging = async ({
    page = 0,
    size = 10,
    search = '',
    sortBy = 'id',
    direction = 'asc',
}) => {
    try {
        const token = localStorage.getItem('MANAGER_token');
        if (!token) throw new Error('Token không tồn tại. Vui lòng đăng nhập lại.');

        const url = new URL(`/api/v1/m/brands/page`, window.location.origin);
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
        console.error("Lỗi khi fetch brand:", error);
        throw error;
    }
};
export const updateBrandById = async (id, payload) => {
    try {
        const token = localStorage.getItem('MANAGER_token');
        const response = await fetch(`/api/v1/m/brands/update/${id}`, {
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
        console.error('Lỗi update brand:', err);
        throw err;
    }
};
export const createBrand = async (payload) => {
    try {
        const token = localStorage.getItem('MANAGER_token');

        const response = await fetch('/api/v1/m/brands/add', {
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
            throw new Error(errorText || 'Tạo brand thất bại');
        }

        const json = await response.json();
        return json.data;
    } catch (err) {
        console.error('Lỗi tạo brand:', err);
        throw err;
    }
};

export const changeBrandStatus = async (id, status) => {
    try {
        const token = localStorage.getItem('MANAGER_token');
        const response = await fetch(`/api/v1/m/brands/change-status/${id}?status=${status}`, {
            method: 'PATCH',
            headers: {
                'Accept': '*/*',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Không thể thay đổi trạng thái thương hiệu');
        }

        return await response.json();
    } catch (error) {
        console.error('Lỗi khi thay đổi trạng thái:', error);
        throw error;
    }
};