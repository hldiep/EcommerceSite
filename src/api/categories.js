const API_URL = `/api/v1/categories`;

export const getAllCategories = async () => {
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
        console.error("Lỗi kết nối category API:", error);
        throw error;
    }
};
export const fetchCategoriesPage = async () => {
    try {
        const response = await fetch(`${API_URL}/page?page=0&size=20&sortBy=id&direction=asc`, {
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
        return result.data.data;
    } catch (error) {
        console.error("Lỗi khi gọi API danh mục:", error);
        throw error;
    }
};
export const fetchCategoryById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Không tìm thấy danh mục');
        }
        const json = await response.json();
        return json.data;
    } catch (error) {
        console.error('Lỗi khi gọi API', error);
        throw new Error(error.message || 'Đã xảy ra lỗi khi lấy thông tin');
    }
};

//manager
export const fetchCategoriesWithPaging = async ({ page = 0, size = 10, search = '' }) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Token không tồn tại. Vui lòng đăng nhập lại.');
        }

        const url = new URL(`/api/v1/m/categories/page`, window.location.origin);
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
        console.error("Lỗi khi fetch categories:", error);
        throw error;
    }
};
export const updateCategoryById = async (id, payload) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/v1/m/categories/update/${id}`, {
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
        console.error('Lỗi update category:', err);
        throw err;
    }
};
export const createCategory = async (payload) => {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch('/api/v1/m/categories/add', {
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
            throw new Error(errorText || 'Tạo danh mục thất bại');
        }

        const json = await response.json();
        return json.data;
    } catch (err) {
        console.error('Lỗi tạo danh mục:', err);
        throw err;
    }
};

