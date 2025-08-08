const API_URL = `/api/v1/orders`;

export const addOrder = async (payload) => {
    try {
        const response = await fetch('/add', {
            method: 'POST',
            headers: {
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