import React, { useEffect, useState } from 'react'
import { fetchOptionsWithPaging } from '../../api/option';
import { useNavigate, useParams } from 'react-router-dom';
import ClippedDrawer from '../dashboard/DashboardLayoutBasic';
import { toast } from 'react-toastify';
import { upload } from '../../api/upload-file';
import Select from 'react-select';
import { createProductVariant } from '../../api/product-variant';
import { fetchSupplierWithPaging } from '../../api/supplier';
const ProductManagerAddVariant = () => {
    const navigate = useNavigate();
    const [options, setOptions] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const optionSelectData = options.map(opt => ({ value: opt.id, label: opt.name }));
    const { id } = useParams();
    const [images, setImages] = useState([]);
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);

        try {
            const imageUrl = await upload(file); // API upload trả về link
            console.log("Link ảnh trả về từ upload:", imageUrl);

            setForm((prev) => ({
                ...prev,
                imageUrl: [...prev.imageUrl, imageUrl], // lưu thêm vào mảng
            }));

            setError('');
        } catch (err) {
            console.error("Lỗi upload ảnh:", err);
            setError("Không thể tải ảnh lên. Vui lòng thử lại.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveImage = (url) => {
        setForm((prev) => ({
            ...prev,
            imageUrl: prev.imageUrl.filter((img) => img !== url),
        }));
    };
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
        const loadSupplier = async () => {
            try {
                const data = await fetchSupplierWithPaging({ page: 0, size: 100 });
                console.log('Data', data)
                setSuppliers(data.data || []);
            } catch (error) {
                console.error('Lỗi tải supplier:', error);
            }
        };

        loadSupplier();
    }, []);

    const [form, setForm] = useState({
        productId: '',
        name: '',
        seoName: '',
        price: '',
        priceSale: '',
        quantity: '',
        sku: '',
        model: '',
        inventoryPolicy: 'DENY',
        warranty: '',
        barcode: '',
        release_at: '',
        imageUrl: [],
        specifications: [{ key: '', value: '' }],
        description: '',
        supplierId: '',
        status: 'ACTIVE',
        optionValueIds: '',
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
            productId: id,
            name: form.name,
            seoName: form.seoName,
            price: Number(form.price),
            priceSale: Number(form.priceSale),
            quantity: Number(form.quantity),
            sku: form.sku,
            model: form.model,
            inventoryPolicy: form.inventoryPolicy,
            warranty: form.warranty,
            barcode: form.barcode,
            release_at: form.release_at
                ? new Date(form.release_at).toISOString()
                : null,
            imageUrl: form.imageUrl || [],
            specifications: specsObject,
            description: form.description,
            supplierId: form.supplierId,
            status: form.status,
            optionValueIds: form.optionIds || [],
        };
        console.log('Dữ liệu tải lên', payload);
        try {
            setLoading(true);
            await createProductVariant(payload);
            toast.success("Tạo sản phẩm thành công!");
            setForm({
                productId: '',
                name: '',
                seoName: '',
                price: '',
                priceSale: '',
                quantity: '',
                sku: '',
                model: '',
                inventoryPolicy: 'DENY',
                warranty: '',
                barcode: '',
                release_at: '',
                imageUrl: [],
                specifications: [{ key: '', value: '' }],
                description: '',
                supplierId: '',
                status: 'ACTIVE',
                optionValueIds: '',
            });
        } catch (err) {
            toast.error("Tạo sản phẩm thất bại!");
        } finally {
            setLoading(false);
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
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Nhóm 1: Thông tin cơ bản */}
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="font-semibold text-lg mb-4">Thông tin cơ bản</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <input name="name" value={form.name} onChange={handleChange} placeholder="Tên biến thể" required className="border p-2 rounded outline-none" />
                            <input name="seoName" value={form.seoName} onChange={handleChange} placeholder="SEO Name" className="border p-2 rounded outline-none" />
                            <textarea name="description" value={form.description} onChange={handleChange} rows="3" placeholder="Mô tả" className="border p-2 rounded col-span-2 outline-none" />
                            <SpecificationsInput specifications={form.specifications} setSpecifications={setSpecifications} />
                        </div>
                    </div>

                    {/* Nhóm 2: Giá & Kho */}
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="font-semibold text-lg mb-4">Giá & Kho</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Giá" className="border p-2 rounded outline-none" />
                            <input type="number" name="priceSale" value={form.priceSale} onChange={handleChange} placeholder="Giá sale" className="border p-2 rounded outline-none" />
                            <input type="number" name="quantity" value={form.quantity} onChange={handleChange} placeholder="Số lượng" className="border p-2 rounded outline-none" />
                            <input name="sku" value={form.sku} onChange={handleChange} placeholder="SKU" className="border p-2 rounded outline-none" />
                            <input name="model" value={form.model} onChange={handleChange} placeholder="Model" className="border p-2 rounded outline-none" />
                            <select name="inventoryPolicy" value={form.inventoryPolicy} onChange={handleChange} className="border p-2 rounded outline-none">
                                <option value="DENY">Không cho đặt khi hết hàng</option>
                                <option value="ALLOW">Cho đặt khi hết hàng</option>
                            </select>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="font-semibold text-lg mb-4">Ngày phát hành</h3>
                        <input
                            type="date"
                            name="release_at"
                            value={form.release_at}
                            onChange={handleChange}
                            className="border p-2 rounded outline-none"
                        />
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="font-semibold text-lg mb-4">Nhà cung cấp</h3>
                        <Select
                            options={suppliers.map(supplier => ({
                                value: supplier.id,
                                label: supplier.name
                            }))}
                            value={suppliers
                                .map(supplier => ({
                                    value: supplier.id,
                                    label: supplier.name
                                }))
                                .find(option => option.value === form.supplierId) || null}
                            onChange={(selectedOption) =>
                                setForm(prev => ({
                                    ...prev,
                                    supplierId: selectedOption ? selectedOption.value : ""
                                }))
                            }
                            placeholder="Chọn nhà cung cấp..."
                        />
                    </div>
                    {/* Nhóm 3: Hình ảnh & Trạng thái */}
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="font-semibold text-lg mb-4">Hình ảnh & Trạng thái</h3>
                        <div className="grid grid-cols-2 gap-4 items-center">
                            <div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
      file:rounded file:border-0 file:text-sm file:font-semibold
      file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />

                                {form.imageUrl && form.imageUrl.length > 0 && (
                                    <div className="flex gap-2 mt-2 flex-wrap">
                                        {form.imageUrl.map((url, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={url}
                                                    alt={`Preview ${index}`}
                                                    className="w-32 h-32 object-cover rounded"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const updatedImages = form.imageUrl.filter((_, i) => i !== index);
                                                        setForm({ ...form, imageUrl: updatedImages });
                                                    }}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {isUploading && <p className="text-blue-500 text-sm mt-1">Đang tải ảnh...</p>}
                            </div>
                            <select name="status" value={form.status} onChange={handleChange} className="border p-2 rounded outline-none">
                                <option value="ACTIVE">Đang bán</option>
                                <option value="INACTIVE">Ngừng bán</option>
                                <option value="DELETED">Đã xóa</option>
                            </select>
                        </div>
                    </div>

                    {/* Nhóm 4: Liên kết & Thuộc tính */}
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="font-semibold text-lg mb-4">Liên kết & Thuộc tính</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Select
                                isMulti
                                options={optionSelectData}
                                value={optionSelectData.filter(opt => form.optionIds?.includes(opt.value))}
                                onChange={handleOptionChange}
                                className="w-full"
                                classNamePrefix="select"
                                placeholder="Chọn option..."
                            />
                            <input name="barcode" value={form.barcode} onChange={handleChange} placeholder="Barcode" className="border p-2 rounded outline-none" />
                            <input name="warranty" value={form.warranty} onChange={handleChange} placeholder="Bảo hành" className="border p-2 rounded outline-none" />
                        </div>
                    </div>

                    {/* Nút submit */}
                    <button type="submit" disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                        {loading ? "Đang tạo..." : "Tạo biến thể"}
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