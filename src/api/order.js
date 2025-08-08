const API_URL = `/api/v1/orders`;

export const addOrder = async (payload) => {
    const token = localStorage.getItem('CUSTOMER_token');
    try {
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
            throw new Error(errorText || 'Tạo đơn hàng thất bại');
        }

        const json = await response.json();
        return json.data;
    } catch (err) {
        console.error('Lỗi tạo đơn hàng:', err);
        throw err;
    }
}

export const getShipFee = async (address) => {
    try {
        const encodedAddress = encodeURIComponent(address);
        const response = await fetch(`${API_URL}/get-ship-fee?address=${encodedAddress}`, {
            method: 'POST',
            headers: {
                'accept': '*/*',
            },
            body: ''
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error('Error fetching ship fee:', error);
        return null;
    }
}

export const getHistory = async ({
    page = 0,
    size = 10,
    search = '',
    sortBy = 'id',
    direction = 'asc',
}) => {
    try {
        const token = localStorage.getItem('CUSTOMER_token');
        if (!token) throw new Error('Token không tồn tại. Vui lòng đăng nhập lại.');

        const url = new URL(`/api/v1/c/orders/history`, window.location.origin);
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
        console.error("Lỗi khi fetch history order:", error);
        throw error;
    }
}