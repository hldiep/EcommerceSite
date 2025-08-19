const API_URL = `/api/v1/m/products`;

export const fetchProductsWithPaging = async ({
    keyword,
    brandId,
    categoryId,
    minPrice,
    maxPrice,
    status,
    page = 0,
    size = 10,
    sortBy,
    direction,
}) => {
    const params = new URLSearchParams();
    const token = localStorage.getItem('MANAGER_token');
    if (!token) {
        throw new Error('Token không tồn tại. Vui lòng đăng nhập lại.');
    }
    if (keyword) params.append('keyword', keyword);
    if (brandId) params.append('brandId', brandId);
    if (categoryId) params.append('categoryId', categoryId);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (status) params.append('status', status);
    if (sortBy) params.append('sortBy', sortBy);
    if (direction) params.append('direction', direction);

    // pagination
    params.append('page', page);
    params.append('size', size);

    const url = `${API_URL}/page?${params.toString()}`;

    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Lỗi khi lấy danh sách sản phẩm');
        }

        const json = await response.json();
        return json.data;
    } catch (error) {
        console.error('Lỗi khi fetch sản phẩm:', error);
        throw error;
    }
};

export const fetchProductById = async (id) => {
    try {
        const token = localStorage.getItem('MANAGER_token');
        if (!token) {
            throw new Error('Token không tồn tại. Vui lòng đăng nhập lại.');
        }
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Không thể lấy thông tin sản phẩm');
        }

        const json = await response.json();
        return json.data;
    } catch (error) {
        console.error("Lỗi fetchProductById:", error.message);
        throw error;
    }
};
export const createProduct = async (payload) => {
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
            throw new Error(errorText || 'Tạo sản phẩm thất bại');
        }

        const json = await response.json();
        return json.data;
    } catch (err) {
        console.error('Lỗi tạo sản phẩm:', err);
        throw err;
    }
};
export const updateProductById = async (id, payload) => {
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
        console.error('Lỗi update sản phẩm', err);
        throw err;
    }
};
//public
export const fetchProductsPublicWithPaging = async ({
    keyword,
    brandId,
    categoryId,
    minPrice,
    maxPrice,
    status,
    page = 0,
    size = 10,
    sortBy,
    direction,
}) => {
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (brandId) params.append('brandId', brandId);
    if (categoryId) params.append('categoryId', categoryId);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (status) params.append('status', status);
    if (sortBy) params.append('sortBy', sortBy);
    if (direction) params.append('direction', direction);

    // pagination
    params.append('page', page);
    params.append('size', size);

    const url = `/api/v1/products/page?${params.toString()}`;

    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Lỗi khi lấy danh sách sản phẩm');
        }

        const json = await response.json();
        return json.data;
    } catch (error) {
        console.error('Lỗi khi fetch sản phẩm:', error);
        throw error;
    }
};

export const fetchProductByCategory = async (
    categoryId,
    page = 0,
    size = 20,
    sortBy = 'id',
    direction = 'asc',
) => {
    try {
        const url = new URL(`/api/v1/products/by-category/${categoryId}/page`, window.location.origin);
        url.searchParams.append('page', page);
        url.searchParams.append('size', size);
        url.searchParams.append('sortBy', sortBy);
        url.searchParams.append('direction', direction);
        const response = await fetch(url,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        if (!response.ok) {
            const err = await response.text();
            throw new Error(err || `Lỗi ${response.status}`);
        }

        const json = await response.json();
        return json.data;
    } catch (error) {
        console.error('Failed to fetch products by category:', error);
        throw error;
    }
};

export const fetchProductPublicById = async (id) => {
    try {
        const response = await fetch(`/api/v1/products/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Không thể lấy thông tin sản phẩm');
        }

        const json = await response.json();
        return json.data;
    } catch (error) {
        console.error("Lỗi fetchProductById:", error.message);
        throw error;
    }
};
export const changeProductStatus = async (id, status) => {
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
            throw new Error(errorText || 'Không thể thay đổi trạng thái sản phẩm');
        }

        return await response.json();
    } catch (error) {
        console.error('Lỗi khi thay đổi trạng thái:', error);
        throw error;
    }
};

export const fetchBestSellingProducts = async (limit) => {
    try {
        const res = await fetch(`/api/v1/products/best-selling?limit=${limit}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error('Lỗi fetch best selling products:', error);
        throw error;
    }
};


export const fetchNewestProducts = async (limit) => {
    try {
        const res = await fetch(`/api/v1/products/newest?limit=${limit}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error('Lỗi fetch newest products:', error);
        throw error;
    }
};