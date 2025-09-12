const properties = [
    {
        id: 1,
        title: 'TRUNG KÍNH 106m, 2 Ô TÔ TRÁNH,VÀO NHÀ,MẶT TIỀN ĐẸP.',
        address: 'Đường Nguyễn Du, P.Tân Định, Q1, TP.HCM',
        price: '31.5',
        unit: 'tỷ',
        acreage: '300 m²',
        created_at: new Date(),
        updated_at: new Date(),
        description: `NHÀ PHÂN LÔ SỔ VUÔNG TRƯỚC SAU 106M 6 TẦNG ,2 THOÁNG TRƯỚC SAU ( SAU NHÀ CÒN ĐƯỜNG NHỎ RỘNG 2M ) ,ĐƯỜNG TRƯỚC NHÀ 2 Ô TÔ TRÁNH ĐỖ. CHỈ 2 PHÚT ĐI Ô TÔ RA TRUNG KÍNH VÀ Mạc Thái TỔ, XUNG QUANH TRƯỜNG HỌC CẤP 1,2,3 CỰC KỲ NHIỀU MÀ LẠI TOÀN TRƯỜNG CHUYÊN,TRƯỜNG ĐIỂM QUỐC GIA.
            ĐẶC BIỆT NHÀ 2 THOÁNG TRƯỚC SAU,NỞ HẬU CỰC PHÁT.
            THIẾT KẾ 6 TẦNG MỖI TẦNG 2 PHÒNG.`,
        images: [
            'https://cdn.chotot.com/I8vZ7PJtR3ZAY8pJ24vRhiq2fVuB44HZZdVmRV_9qNc/preset:view/plain/62b2a36051036f643ba6074f86db2592-2948132055815625713.jpg',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcljdiuUsIN7IXwXrUi9wNozpc6CqR6tNK_g&s',
        ],
        contact: {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: '123456',
            role: 'admin',
            created_at: new Date(),
            updated_at: new Date(),
            nickname: 'John Doe',
            avatar: 'https://via.placeholder.com/150',
            phone: '1234567890',
        },
        detail: {
            type: 'Nhà phố',
            land_area: '300 m²',
            price_per_meter: '213 m²',
            legal_papers: 'Đã có đủ',
            bedrooms_count: 8,
            floors_count: 6,
        },
    },
    {
        id: 2,
        title: 'Bán nhà mặt tiền Nguyễn Trãi, Q5, 4x20m, 4 tầng',
        address: 'Nguyễn Trãi, P.14, Q5, TP.HCM',
        price: '25.8',
        unit: 'tỷ',
        acreage: '80 m²',
        created_at: new Date(),
        updated_at: new Date(),
        description: `Bán nhà mặt tiền đường Nguyễn Trãi, Quận 5. Vị trí cực kỳ đắc địa, gần chợ Kim Biên, thuận tiện kinh doanh buôn bán.
            - Diện tích: 4x20m, công nhận 80m²
            - Kết cấu: 1 trệt 3 lầu, sân thượng
            - Nhà xây kiên cố, nội thất cao cấp
            - Khu vực sầm uất, dân cư đông đúc
            - Giấy tờ pháp lý đầy đủ, sổ hồng chính chủ`,
        images: [
            'https://file4.batdongsan.com.vn/crop/350x232/2024/12/20/20241220083745-4320_wm.jpg',
            'https://file4.batdongsan.com.vn/crop/350x232/2024/12/20/20241220083745-e3f5_wm.jpg',
        ],
        contact: {
            id: 2,
            name: 'Nguyễn Văn A',
            email: 'nguyenvana@example.com',
            password: '123456',
            role: 'user',
            created_at: new Date(),
            updated_at: new Date(),
            nickname: 'Văn A',
            avatar: 'https://via.placeholder.com/150',
            phone: '0909123456',
        },
        detail: {
            type: 'Nhà mặt tiền',
            land_area: '80 m²',
            price_per_meter: '322.5 tr/m²',
            legal_papers: 'Sổ hồng chính chủ',
            bedrooms_count: 4,
            floors_count: 4,
        },
    },
    {
        id: 3,
        title: 'Bán căn hộ cao cấp Vinhomes Central Park 2PN view sông',
        address: 'Vinhomes Central Park, Bình Thạnh, TP.HCM',
        price: '6.5',
        unit: 'tỷ',
        acreage: '85 m²',
        created_at: new Date(),
        updated_at: new Date(),
        description: `Cần bán gấp căn hộ 2 phòng ngủ tại Vinhomes Central Park, tòa Landmark 81.
            - Diện tích: 85m², 2 phòng ngủ, 2 WC
            - View trực diện sông Sài Gòn, thoáng mát
            - Nội thất cao cấp đầy đủ, nhập khẩu từ Châu Âu
            - Tiện ích: hồ bơi, gym, khu vui chơi trẻ em, công viên
            - An ninh 24/7, hệ thống PCCC hiện đại
            - Sổ hồng lâu dài, có thể vay ngân hàng`,
        images: [
            'https://file4.batdongsan.com.vn/crop/350x232/2024/12/19/20241219162446-9f9f_wm.jpg',
            'https://file4.batdongsan.com.vn/crop/350x232/2024/12/19/20241219162446-4e4a_wm.jpg',
        ],
        contact: {
            id: 3,
            name: 'Trần Thị B',
            email: 'tranthib@example.com',
            password: '123456',
            role: 'user',
            created_at: new Date(),
            updated_at: new Date(),
            nickname: 'Thị B',
            avatar: 'https://via.placeholder.com/150',
            phone: '0908765432',
        },
        detail: {
            type: 'Căn hộ chung cư',
            land_area: '85 m²',
            price_per_meter: '76.5 tr/m²',
            legal_papers: 'Sổ hồng lâu dài',
            bedrooms_count: 2,
            floors_count: 1,
        },
    },
    {
        id: 4,
        title: 'Bán đất nền KDC Phú Mỹ Hưng, Q7, 10x20m, giá tốt',
        address: 'KDC Phú Mỹ Hưng, P.Tân Phú, Q7, TP.HCM',
        price: '35',
        unit: 'tỷ',
        acreage: '200 m²',
        created_at: new Date(),
        updated_at: new Date(),
        description: `Bán đất nền khu dân cư Phú Mỹ Hưng, vị trí đẹp, khu dân trí cao.
            - Diện tích: 10x20m = 200m²
            - Hướng: Đông Nam, mát mẻ quanh năm
            - Đường nhựa 16m, hạ tầng hoàn thiện
            - Khu dân cư an ninh, yên tĩnh
            - Gần trường học quốc tế, bệnh viện FV
            - Sổ đỏ chính chủ, xây dựng tự do
            - Giá bán: 35 tỷ (thương lượng)`,
        images: [
            'https://file4.batdongsan.com.vn/crop/350x232/2024/12/18/20241218150239-d5c7_wm.jpg',
            'https://file4.batdongsan.com.vn/crop/350x232/2024/12/18/20241218150239-8a8b_wm.jpg',
        ],
        contact: {
            id: 4,
            name: 'Lê Văn C',
            email: 'levanc@example.com',
            password: '123456',
            role: 'user',
            created_at: new Date(),
            updated_at: new Date(),
            nickname: 'Văn C',
            avatar: 'https://via.placeholder.com/150',
            phone: '0907654321',
        },
        detail: {
            type: 'Đất nền',
            land_area: '200 m²',
            price_per_meter: '175 tr/m²',
            legal_papers: 'Sổ đỏ chính chủ',
            bedrooms_count: 0,
            floors_count: 0,
        },
    },
]

export default properties
