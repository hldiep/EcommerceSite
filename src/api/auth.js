const API_URL = `api/v1/auth`
export const loginApi = async (username, password) => {
    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (!res.ok || data.statusCode !== 200) {
            throw new Error(data.message || 'Login failed');
        }

        return data.data;
    } catch (error) {
        throw error;
    }
};
export const loginManagerApi = async (username, password) => {
    try {
        const res = await fetch(`/api/v1/auth/e/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (!res.ok || data.statusCode !== 200) {
            throw new Error(data.message || 'Login failed');
        }

        return data.data;
    } catch (error) {
        throw error;
    }
};