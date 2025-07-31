import React, { useEffect, useState, useRef } from 'react';
import { fetchCategoriesPage } from '../../api/categories';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [hoverTop, setHoverTop] = useState(0);
    const itemRefs = useRef([]);
    const wrapperRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchCategoriesPage();
                setCategories(data);
            } catch (error) {
                console.error("Không thể load danh mục:", error);
            }
        };
        fetchData();
    }, []);

    const handleMouseEnter = (index) => {
        setHoveredIndex(index);
        const rect = itemRefs.current[index]?.getBoundingClientRect();
        const containerRect = itemRefs.current[0]?.offsetParent?.getBoundingClientRect();
        if (rect && containerRect) {
            setHoverTop(rect.top - containerRect.top);
        }
    };

    return (
        <div
            ref={wrapperRef}
            className="relative flex z-20"
            onMouseLeave={() => setHoveredIndex(null)}
        >
            {/* Danh mục cha */}
            <div className="w-[240px] bg-white rounded-xl shadow p-2 flex flex-col max-h-[420px] overflow-y-auto relative z-20">
                {categories.map((category, index) => (
                    <div
                        key={category.id}
                        ref={(el) => (itemRefs.current[index] = el)}
                        onMouseEnter={() => handleMouseEnter(index)}
                        onClick={() => navigate(`/category/${category.id}`)}
                        className={`flex items-center gap-2 py-2 px-3 rounded cursor-pointer transition duration-150 ${hoveredIndex === index
                                ? 'bg-red-100 text-red-600 font-semibold'
                                : 'hover:bg-gray-100'
                            }`}
                    >
                        <span className="text-black text-sm leading-tight">{category.name}</span>
                    </div>
                ))}
            </div>

            {/* Danh mục con */}
            {hoveredIndex !== null && categories[hoveredIndex]?.children?.length > 0 && (
                <div
                    className="absolute left-[240px] ml-[-4px] w-[280px] bg-gray-50 rounded-xl shadow p-4 space-y-2 z-50"
                    style={{ top: hoverTop }}
                >
                    {categories[hoveredIndex].children.map((child) => (
                        <div
                            key={child.id}
                            onClick={() => navigate(`/category/${child.id}`)}
                            className="text-black cursor-pointer text-sm hover:text-red-600 hover:bg-gray-100 rounded px-2 py-1 transition"
                        >
                            {child.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Categories;
