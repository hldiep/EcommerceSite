const API_URL = `/api/v1/m/slides`;

export const fetchSlidesWithPaging = async ({
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
        console.error("Lỗi khi fetch slide:", error);
        throw error;
    }
};
export const updateSlidesById = async (id, payload) => {
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
        console.error('Lỗi update slides:', err);
        throw err;
    }
};

export const createSlides = async (payload) => {
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
            throw new Error(errorText || 'Tạo slides thất bại');
        }

        const json = await response.json();
        return json.data;
    } catch (err) {
        console.error('Lỗi tạo slides:', err);
        throw err;
    }
};

export const getAllSides = async () => {
    try {
        const token = localStorage.getItem('MANAGER_token');
        const response = await fetch(`${API_URL}/all`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
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
        console.error("Lỗi kết nối slides API:", error);
        throw error;
    }
};

export const fetchSlidesById = async (id) => {
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
            throw new Error(errorText || 'Không tìm thấy slides');
        }
        const json = await response.json();
        return json.data;
    } catch (error) {
        console.error('Lỗi khi gọi API', error);
        throw new Error(error.message || 'Đã xảy ra lỗi khi lấy thông tin');
    }
};
export const changeSlideStatus = async (id, status) => {
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
            throw new Error(errorText || 'Không thể thay đổi trạng thái slide');
        }

        return await response.json();
    } catch (error) {
        console.error('Lỗi khi thay đổi trạng thái:', error);
        throw error;
    }
};