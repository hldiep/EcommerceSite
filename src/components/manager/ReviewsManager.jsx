import React, { useEffect, useState } from "react";
import ClippedDrawer from "../dashboard/DashboardLayoutBasic";
import { Link, useNavigate } from "react-router-dom";
import { fetchReviewsWithPaging } from "../../api/reviews";
import Table from "../ui/Table";

const ReviewsManager = () => {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [keyword, setKeyword] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("id");
  const [direction, setDirection] = useState("asc");

  const [loading, setLoading] = useState(true);

  const columns = [
    { 
      key: "productId", 
      label: "Mã sản phẩm",
      render: (row) => (
        <Link 
          to={`/products-manager/${row.productId}`} 
          className="text-blue-600 hover:underline"
        >
          {row.productId}
        </Link>
      )
    },
    { key: "rating", label: "Rating" },
    { key: "fullName", label: "Khách hàng" },
    { key: "username", label: "Tài khoản" },
    { key: "comment", label: "Đánh giá" },
    { key: "status", label: "Trạng thái" },
  ];

  useEffect(() => {
    loadReviews();
  }, [currentPage, pageSize, sortBy, direction, keyword]); 

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await fetchReviewsWithPaging({
        page,
        size: pageSize,
        keyword: keyword,
        sortBy,
        direction,
      });

      console.log("Data", data)
      setReviews(data.data);
      setTotalItems(data.totalElements || 0);
    } catch (err) {
      console.error("Lỗi tải reviews:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <ClippedDrawer>
      <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50 min-h-[calc(100vh-80px)]">

        <div className="sticky top-16 z-10 bg-white border-b shadow-sm">
          <div className="flex items-center text-sm text-gray-600 space-x-2 px-4 pt-2">
            <button
              onClick={() => navigate("/tongquan")}
              className="hover:underline text-blue-600"
            >
              Dashboard
            </button>
            <span>/</span>
            <span className="text-gray-700 font-medium">Quản lý reviews</span>
          </div>
          <h2 className="text-xl font-semibold p-4">Quản lý reviews</h2>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <label htmlFor="">Tìm kiếm</label>
            <input
              type="text"
              placeholder="Nhập tìm kiếm..."
              className="border px-4 py-2 rounded w-72 outline-none"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter"}
            />
          </div>

          <div className="flex gap-4 items-center justify-end">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="border px-4 py-2 rounded w-48 outline-none"
            >
              <option value="id">Sắp xếp theo ID</option>
              <option value="title">Sắp xếp theo tiêu đề</option>
              <option value="productName">Sắp xếp theo sản phẩm</option>
            </select>

            <select
              value={direction}
              onChange={(e) => {
                setDirection(e.target.value);
                setCurrentPage(1);
              }}
              className="border px-4 py-2 rounded w-36 outline-none"
            >
              <option value="asc">Tăng dần</option>
              <option value="desc">Giảm dần</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-r-transparent"></div>
            <div className="ml-4 text-blue-600 font-medium text-lg">
              Đang tải dữ liệu...
            </div>
          </div>
        ) : (
          <Table
            columns={columns}
            data={reviews}    
            pageSize={pageSize}
            totalItems={totalItems}
            currentPage={currentPage}
            onPaging={(p)=>{
              setCurrentPage(p)
              setPage(p-1)
            }}
            onPagingSizeChange={(size)=>{
              setPageSize(size)
              setCurrentPage(1)
              setPage(0)
            }}
          />
        )}
      </div>
    </ClippedDrawer>
  );
};

export default ReviewsManager;
