import React, { useEffect, useState } from 'react'
import { fetchOptionsWithPaging } from '../../api/option';
import { useNavigate, useParams } from 'react-router-dom';
import ClippedDrawer from '../dashboard/DashboardLayoutBasic';
import { toast } from 'react-toastify';
import { upload } from '../../api/upload-file';
import Select from 'react-select';
import { fetchSupplierWithPaging } from '../../api/supplier';
import { fetchProductVariantById, updateProductVariantById } from '../../api/product-variant';

const ProductManagerEditVariant = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [options, setOptions] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const optionSelectData = options.map(opt => ({ value: opt.id, label: opt.name }));

    const [form, setForm] = useState(null);

    // load option + supplier
    useEffect(() => {
        const loadOptions = async () => {
            try {
                const data = await fetchOptionsWithPaging({ page: 0, size: 100 });
                setOptions(data.data || []);
            } catch (error) {
                console.error('Lỗi tải option:', error);
            }
        };
        const loadSupplier = async () => {
            try {
                const data = await fetchSupplierWithPaging({ page: 0, size: 100 });
                setSuppliers(data.data || []);
            } catch (error) {
                console.error('Lỗi tải supplier:', error);
            }
        };
        loadOptions();
        loadSupplier();
    }, []);

    // load variant by id
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchProductVariantById(id);
                const specsArr = data.specifications
                    ? Object.entries(data.specifications).map(([k, v]) => ({ key: k, value: v }))
                    : [{ key: '', value: '' }];

                setForm({
                    productId: data.product.id,
                    name: data.name || '',
                    seoName: data.seoName || '',
                    price: data.price || '',
                    priceSale: data.priceSale || '',
                    quantity: data.quantity || '',
                    sku: data.sku || '',
                    model: data.model || '',
                    inventoryPolicy: data.inventoryPolicy || 'DENY',
                    warranty: data.warranty || '',
                    barcode: data.barcode || '',
                    release_at: data.release_at ? data.release_at.split('T')[0] : '',
                    imageUrl: Array.isArray(data.imageUrl) ? data.imageUrl[0] : (data.imageUrl || ''),
                    specifications: specsArr,
                    description: data.description || '',
                    supplierId: data.supplierId || '',
                    status: data.status || 'ACTIVE',
                    optionIds: data.optionValueIds || []
                });
            } catch (error) {
                console.error('Lỗi tải variant:', error);
                toast.error('Không tìm thấy biến thể');
                navigate('/products-manager');
            }
        };
        fetchData();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleOptionChange = (selectedOptions) => {
        const values = selectedOptions ? selectedOptions.map(o => o.value) : [];
        setForm(prev => ({ ...prev, optionIds: values }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsUploading(true);
        try {
            const imageUrl = await upload(file);
            setForm(prev => ({ ...prev, imageUrl: [...prev.imageUrl, imageUrl] }));
        } catch (err) {
            console.error("Lỗi upload ảnh:", err);
            setError("Không thể tải ảnh lên");
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveImage = (url) => {
        setForm(prev => ({
            ...prev,
            imageUrl: prev.imageUrl.filter(img => img !== url)
        }));
    };

    const setSpecifications = (specs) => {
        setForm(prev => ({ ...prev, specifications: specs }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form) return;

        const specsObject = {};
        form.specifications.forEach(({ key, value }) => {
            if (key.trim()) specsObject[key.trim()] = value;
        });

        const payload = {
            ...form,
            price: Number(form.price),
            priceSale: Number(form.priceSale),
            quantity: Number(form.quantity),
            release_at: form.release_at ? new Date(form.release_at).toISOString() : null,
            specifications: specsObject
        };
        console.log('Dữ liệu gửi lên', payload);
        try {
            setLoading(true);
            await updateProductVariantById(id, payload);
            toast.success("Cập nhật biến thể thành công!");
            navigate('/products-manager');
        } catch (err) {
            console.error(err);
            toast.error("Cập nhật thất bại!");
        } finally {
            setLoading(false);
        }
    };

    if (!form) return <ClippedDrawer><p className="p-6">Đang tải dữ liệu...</p></ClippedDrawer>;

    return (
        <ClippedDrawer>
            <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50 min-h-[calc(100vh-80px)]">
                <div className="sticky top-16 z-10 bg-white border-b shadow-sm">
                    <div className="flex items-center text-sm text-gray-600 space-x-2 px-4 pt-2">
                        <button onClick={() => navigate('/tongquan')} className="hover:underline text-blue-600">Dashboard</button>
                        <span>/</span>
                        <button onClick={() => navigate('/products-manager')} className="hover:underline text-blue-600">Quản lý sản phẩm</button>
                        <span>/</span>
                        <span className="text-gray-700 font-medium">Chỉnh sửa biến thể</span>
                    </div>
                    <h2 className="text-xl font-semibold p-4">Chỉnh sửa biến thể sản phẩm</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="font-semibold text-lg mb-4">Thông tin cơ bản</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <input name="name" value={form.name} onChange={handleChange} placeholder="Tên biến thể" required className="border p-2 rounded outline-none" />
                            <input name="seoName" value={form.seoName} onChange={handleChange} placeholder="SEO Name" className="border p-2 rounded outline-none" />
                            <textarea name="description" value={form.description} onChange={handleChange} rows="3" placeholder="Mô tả" className="border p-2 rounded col-span-2 outline-none" />
                            <SpecificationsInput specifications={form.specifications} setSpecifications={setSpecifications} />
                        </div>
                    </div>

                    {/* --- Nhóm 2: Giá & Kho --- */}
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="font-semibold text-lg mb-4">Giá & Kho</h3>
                        <div className="grid grid-cols-3 gap-4">

                            <div>
                                <label className="block text-sm font-medium mb-1">Giá</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={form.price}
                                    onChange={handleChange}
                                    placeholder="Giá"
                                    className="border p-2 rounded outline-none w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Giá sale</label>
                                <input
                                    type="number"
                                    name="priceSale"
                                    value={form.priceSale}
                                    onChange={handleChange}
                                    placeholder="Giá sale"
                                    className="border p-2 rounded outline-none w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Số lượng</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={form.quantity}
                                    onChange={handleChange}
                                    placeholder="Số lượng"
                                    className="border p-2 rounded outline-none w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">SKU</label>
                                <input
                                    name="sku"
                                    value={form.sku}
                                    onChange={handleChange}
                                    placeholder="SKU"
                                    className="border p-2 rounded outline-none w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Model</label>
                                <input
                                    name="model"
                                    value={form.model}
                                    onChange={handleChange}
                                    placeholder="Model"
                                    className="border p-2 rounded outline-none w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Chính sách kho</label>
                                <select
                                    name="inventoryPolicy"
                                    value={form.inventoryPolicy}
                                    onChange={handleChange}
                                    className="border p-2 rounded outline-none w-full"
                                >
                                    <option value="DENY">Không cho đặt khi hết hàng</option>
                                    <option value="ALLOW">Cho đặt khi hết hàng</option>
                                </select>
                            </div>
                        </div>
                    </div>


                    {/* --- Ngày phát hành --- */}
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="font-semibold text-lg mb-4">Ngày phát hành</h3>
                        <input type="date" name="release_at" value={form.release_at} onChange={handleChange} className="border p-2 rounded outline-none" />
                    </div>

                    {/* --- Nhà cung cấp --- */}
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="font-semibold text-lg mb-4">Nhà cung cấp</h3>
                        <Select
                            options={suppliers.map(s => ({ value: s.id, label: s.name }))}
                            value={suppliers.map(s => ({ value: s.id, label: s.name }))
                                .find(opt => opt.value === form.supplierId) || null}
                            onChange={(selected) => setForm(prev => ({ ...prev, supplierId: selected ? selected.value : "" }))}
                            placeholder="Chọn nhà cung cấp..."
                        />
                    </div>

                    {/* --- Hình ảnh & Trạng thái --- */}
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="font-semibold text-lg mb-4">Hình ảnh & Trạng thái</h3>
                        <div className="grid grid-cols-2 gap-4 items-center">
                            <div>
                                <input type="file" accept="image/*" onChange={handleImageUpload} />
                                {form.imageUrl && <img src={form.imageUrl} alt="Ảnh sản phẩm" />}
                                {isUploading && <p className="text-blue-500 text-sm mt-1">Đang tải ảnh...</p>}
                            </div>
                            <select name="status" value={form.status} onChange={handleChange} className="border p-2 rounded outline-none">
                                <option value="ACTIVE">Đang bán</option>
                                <option value="INACTIVE">Ngừng bán</option>
                                <option value="DELETED">Đã xóa</option>
                            </select>
                        </div>
                    </div>

                    {/* --- Liên kết & Thuộc tính --- */}
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="font-semibold text-lg mb-4">Liên kết & Thuộc tính</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium mb-1">Option</label>
                                <Select
                                    isMulti
                                    options={optionSelectData}
                                    value={optionSelectData.filter(opt => form.optionIds?.includes(opt.value))}
                                    onChange={handleOptionChange}
                                    className="w-full"
                                    classNamePrefix="select"
                                    placeholder="Chọn option..."
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="barcode" className="text-sm font-medium mb-1">Barcode</label>
                                <input
                                    id="barcode"
                                    name="barcode"
                                    value={form.barcode}
                                    onChange={handleChange}
                                    placeholder="Nhập barcode"
                                    className="border p-2 rounded outline-none"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="warranty" className="text-sm font-medium mb-1">Bảo hành</label>
                                <input
                                    id="warranty"
                                    name="warranty"
                                    value={form.warranty}
                                    onChange={handleChange}
                                    placeholder="Nhập thời gian bảo hành"
                                    className="border p-2 rounded outline-none"
                                />
                            </div>
                        </div>
                    </div>


                    <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                        {loading ? "Đang lưu..." : "Lưu thay đổi"}
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
        setSpecifications(specifications.filter((_, i) => i !== index));
    };

    return (
        <div>
            {specifications.map((spec, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                    <input type="text" placeholder="Tên thuộc tính" value={spec.key}
                        onChange={e => handleChangeKey(index, e.target.value)}
                        className="border rounded px-2 py-1 flex-1 outline-none" />
                    <input type="text" placeholder="Giá trị" value={spec.value}
                        onChange={e => handleChangeValue(index, e.target.value)}
                        className="border rounded px-2 py-1 flex-1 outline-none" />
                    <button type="button" onClick={() => handleRemove(index)} className="bg-red-500 text-white px-2 rounded">Xóa</button>
                </div>
            ))}
            <button type="button" onClick={handleAdd} className="bg-green-600 text-white px-4 py-1 rounded">Thêm thuộc tính</button>
        </div>
    );
};

export default ProductManagerEditVariant;
