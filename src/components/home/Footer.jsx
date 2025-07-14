import { faFacebookF, faInstagram, faTiktok, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const Footer = () => {
    return (
        <footer className="bg-gray-100 text-sm text-gray-700 py-8 px-4 md:px-12">
            <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

                <div>
                    <h3 className="text-lg font-semibold mb-2">Tổng đài hỗ trợ miễn phí</h3>
                    <p>Mua hàng - bảo hành <b>1800.2097</b> (7h30 - 22h00)</p>
                    <p>Khiếu nại <b>1800.2063</b> (8h00 - 21h30)</p>
                    <h4 className="mt-4 font-semibold mb-1">Phương thức thanh toán</h4>

                    <div className="mt-4">
                        <h4 className="font-semibold text-red-500">ĐĂNG KÝ NHẬN TIN KHUYẾN MÃI</h4>
                        <p className="text-red-500 mt-1">Nhận ngay voucher 10%</p>
                        <p className="text-xs">Voucher sẽ được gửi sau 24h, chỉ áp dụng cho khách hàng mới</p>
                    </div>
                </div>

                {/* Cột 2: Chính sách */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Thông tin và chính sách</h3>
                    <ul className="space-y-1">
                        {[
                            'Mua hàng và thanh toán Online',
                            'Mua hàng trả góp Online',
                            'Mua hàng trả góp bằng thẻ tín dụng',
                            'Chính sách giao hàng',
                            'Chính sách đổi trả',
                            'Tra điểm Smember',
                            'Xem ưu đãi Smember',
                            'Tra thông tin bảo hành',
                            'Tra cứu hoá đơn điện tử',
                            'Thông tin hoá đơn mua hàng',
                            'Trung tâm bảo hành chính hãng',
                            'Quy định về việc sao lưu dữ liệu',
                        ].map((item, idx) => (
                            <li key={idx} className="hover:text-red-500 cursor-pointer">{item}</li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Dịch vụ và thông tin khác</h3>
                    <ul className="space-y-1">
                        {[
                            'Khách hàng doanh nghiệp (B2B)',
                            'Ưu đãi thanh toán',
                            'Quy chế hoạt động',
                            'Chính sách bảo mật thông tin cá nhân',
                            'Chính sách Bảo hành',
                            'Liên hệ hợp tác kinh doanh',
                            'Tuyển dụng',
                            'Dịch vụ bảo hành mở rộng',
                            'Smember: Tích điểm & sử dụng ưu đãi',
                        ].map((item, idx) => (
                            <li key={idx} className="hover:text-red-500 cursor-pointer">{item}</li>
                        ))}
                    </ul>
                    <div className="flex gap-2 mt-3">
                        <img src="/images/qr.png" alt="qr" className="h-14" />
                        <img src="/images/googleplay.png" alt="gp" className="h-10" />
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Kết nối với chúng tôi</h3>
                    <div className='space-x-2'>
                        <FontAwesomeIcon icon={faYoutube} className="text-red-600 text-xl hover:scale-110 transition cursor-pointer" />
                        <FontAwesomeIcon icon={faFacebookF} className="text-blue-600 text-xl hover:scale-110 transition cursor-pointer" />
                        <FontAwesomeIcon icon={faInstagram} className="text-pink-500 text-xl hover:scale-110 transition cursor-pointer" />
                        <FontAwesomeIcon icon={faTiktok} className="text-black text-xl hover:scale-110 transition cursor-pointer" />
                    </div>

                    <h3 className="font-semibold mb-2 mt-2">Website thành viên</h3>
                    <ul className="space-y-2">
                        <li>
                            Hệ thống bảo hành sửa chữa Điện thoại - Máy tính
                        </li>
                        <li>
                            Trung tâm bảo hành uỷ quyền Apple
                        </li>
                        <li>
                            Kênh thông tin giải trí công nghệ cho giới trẻ
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    )
}

export default Footer