export const fetchApiUploadFile = async (file) => {
    try {
        const formData = new FormData();
        formData.append("image", file);
        const token = localStorage.getItem('MANAGER_token');
        const response = await fetch("/api/v1/m/upload-file", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Upload failed");
        }

        return data.data;
    } catch (error) {
        console.error("Upload error:", error);
        throw error;
    }
};

export const upload = async (file) => {
    try {
        const token = localStorage.getItem("MANAGER_token");
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch("/api/v1/m/upload-file", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Gửi ảnh về server thất bại");
        }

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error("Lỗi upload:", error);
        alert("Đã xảy ra lỗi khi upload ảnh");
        throw error;
    }
};
