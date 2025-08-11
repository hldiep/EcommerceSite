import React, { useEffect, useState } from 'react'
import { fetchOptionsWithPaging } from '../../api/option';
import { useNavigate } from 'react-router-dom';
import ClippedDrawer from '../dashboard/DashboardLayoutBasic';
import { createProduct } from '../../api/product';
import { fetchBrandsWithPaging } from '../../api/brand';
import { toast } from 'react-toastify';
import { upload } from '../../api/upload-file';
import Select from 'react-select';
const ProductManagerAddVariant = () => {
    const navigate = useNavigate();
    const [options, setOptions] = useState([]);
    const [brands, setBrands] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const optionSelectData = options.map(opt => ({ value: opt.id, label: opt.name }));

    useEffect(() => {
        const loadOptions = async () => {
            try {
                const data = await fetchOptionsWithPaging({ page: 0, size: 100 });
                setOptions(data.data || []);
            } catch (error) {
                console.error('Lỗi tải option:', error);
            }
        };

        loadOptions();
    }, []);
    useEffect(() => {
        const loadBrands = async () => {
            try {
                const data = await fetchBrandsWithPaging({ page: 0, size: 100 });
                setBrands(data.data || []);
            } catch (error) {
                console.error('Lỗi tải thương hiệu:', error);
            }
        };

        loadBrands();
    }, []);
    const [form, setForm] = useState({
        name: "",
        seoName: "",
        specifications: [{ key: '', value: '' }],
        description: "",
        imageUrl: "",
        status: "ACTIVE",
        brandId: "",
        optionIds: [],
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };
    const handleOptionChange = (selectedOptions) => {
        const values = selectedOptions ? selectedOptions.map(o => o.value) : [];
        setForm(prev => ({ ...prev, optionIds: values }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        const specsObject = {};
        form.specifications.forEach(({ key, value }) => {
            if (key.trim()) specsObject[key.trim()] = value;
        });

        const payload = {
            name: form.name,
            seoName: form.seoName,
            specifications: specsObject,
            description: form.description,
            imageUrl: form.imageUrl,
            status: form.status,
            brandId: Number(form.brandId),
            optionIds: form.optionIds,
        };
        console.log('Dữ liệu tải lên', payload);
        try {
            setLoading(true);
            await createProduct(payload);
            toast.success("Tạo sản phẩm thành công!");
            setForm({
                name: "",
                seoName: "",
                description: "",
                imageUrl: "",
                status: "ACTIVE",
                brandId: "",
                optionIds: "",
                specifications: [{ key: '', value: '' }]
            });
        } catch (err) {
            toast.error("Tạo sản phẩm thất bại!");
        } finally {
            setLoading(false);
        }
    };
    const handleSpecChange = (key, value) => {
        setForm(prev => ({
            ...prev,
            specifications: {
                ...prev.specifications,
                [key]: value
            }
        }));
    };
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);

        try {
            const imageUrl = await upload(file);
            console.log("Link ảnh trả về từ upload:", imageUrl);

            setForm((prev) => ({
                ...prev,
                imageUrl: imageUrl,
            }));

            setError('');
        } catch (err) {
            console.error("Lỗi upload ảnh:", err);
            setError("Không thể tải ảnh lên. Vui lòng thử lại.");
        } finally {
            setIsUploading(false);
        }
    };
    const setSpecifications = (specs) => {
        setForm(prev => ({ ...prev, specifications: specs }));
    };
    return (
        <ClippedDrawer>
            <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50 min-h-[calc(100vh-80px)]">
                <div className="sticky top-16 z-10 bg-white border-b shadow-sm">
                    <div className="flex items-center text-sm text-gray-600 space-x-2 px-4 pt-2">
                        <button onClick={() => navigate('/tongquan')} className="hover:underline text-blue-600">
                            Dashboard
                        </button>
                        <span>/</span>
                        <button onClick={() => navigate('/products-manager')} className="hover:underline text-blue-600">Quản lý sản phẩm</button>
                        <span>/</span>
                        <span className="text-gray-700 font-medium">Thêm biến thể sản phẩm</span>
                    </div>
                    <h2 className="text-xl font-semibold p-4">Thêm biến thể sản phẩm</h2>
                </div>
                <form onSubmit={handleSubmit} >
                    <div className="mt-6 grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tên sản phẩm
                            </label>
                            <input type="text" name="name" value={form.name} onChange={handleChange} required className="border px-3 py-2 rounded w-full outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                SEO Name
                            </label>
                            <input type="text" name="seoName" value={form.seoName} onChange={handleChange} required className="border px-3 py-2 rounded w-full outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mô tả
                            </label>
                            <textarea name="description" value={form.description} onChange={handleChange} rows="3" className="border px-3 py-2 rounded w-full outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Thông số kỹ thuật</label>
                            <SpecificationsInput
                                specifications={form.specifications}
                                setSpecifications={setSpecifications}
                            />
                        </div>
                        <div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ảnh sản phẩm
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
               file:rounded file:border-0 file:text-sm file:font-semibold
               file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                {isUploading && (
                                    <p className="text-blue-600 text-sm mt-1">Đang tải ảnh lên...</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Trạng thái
                                    <select name="status" value={form.status} onChange={handleChange} className="border px-3 py-2 rounded w-full outline-none">
                                        <option value="ACTIVE">ACTIVE</option>
                                        <option value="INACTIVE">INACTIVE</option>
                                        <option value="DELETED">DELETED</option>
                                    </select>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Brand
                            </label>
                            <select
                                name="brandId"
                                value={form.brandId}
                                onChange={handleChange}
                                className="border px-4 py-2 rounded w-52 outline-none"
                            >
                                <option value="">-- Thương hiệu --</option>
                                {brands.map((b) => (
                                    <option key={b.id} value={b.id.toString()}>
                                        {b.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Option
                            </label>
                            <Select
                                isMulti
                                options={optionSelectData}
                                value={optionSelectData.filter(opt => form.optionIds.includes(opt.value))}
                                onChange={handleOptionChange}
                                className="w-full"
                                classNamePrefix="select"
                                placeholder="Chọn option..."
                            />
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="mt-5 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        {loading ? "Đang tạo..." : "Tạo sản phẩm"}
                    </button>
                </form>

            </div>
        </ClippedDrawer>
    )
}
const SpecificationsInput = ({ specifications, setSpecifications }) => {
    const handleChangeKey = (index, newKey) => {
        const newSpecs = [...specifications];
        newSpecs[index].key = newKey;
        setSpecifications(newSpecs);
    };

    const handleChangeValue = (index, newValue) => {
        const newSpecs = [...specifications];
        newSpecs[index].value = newValue;
        setSpecifications(newSpecs);
    };

    const handleAdd = () => {
        setSpecifications([...specifications, { key: '', value: '' }]);
    };

    const handleRemove = (index) => {
        const newSpecs = specifications.filter((_, i) => i !== index);
        setSpecifications(newSpecs);
    };

    return (
        <div>
            {specifications.map((spec, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                    <input
                        type="text"
                        placeholder="Tên thuộc tính"
                        value={spec.key}
                        onChange={e => handleChangeKey(index, e.target.value)}
                        className="border rounded px-2 py-1 flex-1 outline-none"
                    />
                    <input
                        type="text"
                        placeholder="Giá trị"
                        value={spec.value}
                        onChange={e => handleChangeValue(index, e.target.value)}
                        className="border rounded px-2 py-1 flex-1 outline-none"
                    />
                    <button
                        type="button"
                        onClick={() => handleRemove(index)}
                        className="bg-red-500 text-white px-2 rounded"
                    >
                        Xóa
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={handleAdd}
                className="bg-green-600 text-white px-4 py-1 rounded"
            >
                Thêm thuộc tính
            </button>
        </div>
    );
};
export default ProductManagerAddVariant