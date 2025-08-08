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

export const sendOtpRegister = async (formData) => {
    try {
        const response = await fetch("/api/v1/auth/register/email/send-otp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            console.log("OTP sent:", result);
            return result;
        } else {
            console.error("Error sending OTP:", result);
            throw new Error(result.message || "Failed to send OTP");
        }
    } catch (error) {
        console.error("Network or server error:", error);
        throw error;
    }
};

export const verifyOtpRegister = async (otp, formData) => {
    try {
        const response = await fetch(`/api/v1/auth/register?otp=${otp}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            return result;
        } else {
            throw new Error(result.message || "Xác minh OTP thất bại");
        }
    } catch (error) {
        console.error("Lỗi xác minh OTP:", error);
        throw error;
    }
};