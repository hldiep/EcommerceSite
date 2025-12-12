const API_URL = `/api/v1/c/reviews`;

export const fetchReviewsWithPaging = async ({ page = 0, size = 10, search = '' }) => {
    try {
        const token = localStorage.getItem('CUSTOMER_token');
        if (!token) {
            throw new Error('Token không tồn tại. Vui lòng đăng nhập lại.');
        }

        const url = new URL(`${API_URL}`, window.location.origin);
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
        console.error("Lỗi khi fetch review:", error);
        throw error;
    }
};

export const fetchReviewsById = async (id) => {
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
            throw new Error(errorText || 'Không tìm thấy reviews');
        }
        const json = await response.json();
        return json.data;
    } catch (error) {
        console.error('Lỗi khi gọi API', error);
        throw new Error(error.message || 'Đã xảy ra lỗi khi lấy thông tin');
    }
};

export const addReviews = async (payload) => {
    try {
        const token = localStorage.getItem("CUSTOMER_token");

        const response = await fetch(`${API_URL}/add/`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "*/*",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Lỗi đánh giá");
        }

        const json = await response.json();
        return json.data;
    } catch (err) {
        console.error("Lỗi đánh giá:", err);
        throw err;
    }
};

export const fetchReviewsByProductId = async({
    productId,
    page = 0,
    size = 20,
    keyword = '',
    sortBy = 'id',
    direction = 'asc',
})=>{
    try {
        const token = localStorage.getItem('CUSTOMER_token');
        if (!token) {
            throw new Error('Token không tồn tại. Vui lòng đăng nhập lại.');
        }

        const url = new URL(`${API_URL}/product/${productId}`, window.location.origin);

        url.searchParams.append('keyword', keyword);
        url.searchParams.append('page', page);
        url.searchParams.append('size', size);
        url.searchParams.append('sortBy', sortBy);
        url.searchParams.append('direction', direction);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                Accept: '*/*',
            },
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(err || `Lỗi ${response.status}`);
        }

        const json = await response.json();
        return json.data;
    } catch (error) {
        console.error("Lỗi khi fetch review theo productId:", error);
        throw error;
    }
}