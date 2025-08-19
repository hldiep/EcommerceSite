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

export const sendOtpToEmail = async (email) => {
    const formData = new FormData();
    formData.append("email", email);

    const response = await fetch(`${API_URL}/reset-password/email/send-otp`, {
        method: "POST",
        body: formData
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Không thể gửi mã OTP.");
    }

    return result;
};

export const verifyOtp = async (email, otp) => {
    const response = await fetch('/api/v1/auth/resetPassword/email/verify', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
    });

    const result = await response.json();
    console.log("VERIFY OTP RESULT", result);

    if (!response.ok || result.statusCode !== 200 || !result.data) {
        const errorMessage = result.message || "Xác minh OTP thất bại.";
        throw new Error(errorMessage);
    }

    return result.data;
}

export const newPassword = async (token, newPassword) => {
    const res = await fetch('/api/v1/auth/resetPassword', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword })
    });

    const result = await res.json();

    if (!res.ok) {
        const errorMessage = result.data || result.message || "Không thể đặt lại mật khẩu.";
        throw new Error(errorMessage);
    }

    return result;
};


export const changePassword = async (username, oldPassword, newPassword) => {
    const res = await fetch('/api/v1/sh/accounts/change-password', {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ username, oldPassword, newPassword })
    });

    const result = await res.json();

    if (!res.ok) {
        const errorMessage = result.data || result.message || "Không thể đổi mật khẩu.";
        throw new Error(errorMessage);
    }

    return result;
};
