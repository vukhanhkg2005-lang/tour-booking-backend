require("dotenv").config({ path: "../Backend tour booking/.env" });
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
const Tour = require("./models/Tour");
const User = require("./models/User");
const Booking = require("./models/Booking");
const Invoice = require("./models/Invoice");
const Ticket = require("./models/Ticket");

const tours = [
  {
    name: "Ha Long Bay Luxury Cruise & Kayaking",
    destination: "Ha Long Bay, Quang Ninh",
    price: 399,
    durationDays: 2,
    maxParticipants: 16,
    currentParticipants: 0,
    startDate: new Date("2026-06-15T08:00:00Z"),
    image: "/images/halong_cover.jpg",
    description: "Explore the breathtaking limestone karsts of Ha Long Bay aboard a 5-star luxury cruise ship. Includes kayaking, cooking class, overnight accommodation, and gourmet dining."
  },
  {
    name: "Sapa Trekking & H'mong Ethnic Homestay",
    destination: "Sapa, Lao Cai",
    price: 249,
    durationDays: 3,
    maxParticipants: 12,
    currentParticipants: 0,
    startDate: new Date("2026-06-20T08:00:00Z"),
    image: "/images/sapa_cover.jpg",
    description: "Trek through the stunning terraced rice fields of Sapa. Visit local ethnic minority villages, learn their custom crafts, and enjoy an authentic warm homestay experience."
  },
  {
    name: "Ha Giang Loop Ultimate Motorbike Tour",
    destination: "Ha Giang Loop",
    price: 499,
    durationDays: 4,
    maxParticipants: 10,
    currentParticipants: 0,
    startDate: new Date("2026-07-01T08:00:00Z"),
    image: "/images/hagiang_cover.jpg",
    description: "Conquer the legendary mountain loops of Ha Giang with an experienced rider guide. Enjoy spectacular views of the Ma Pi Leng Pass, rock plateaus, and vibrant border markets."
  },
  {
    name: "Hue Imperial Citadel Heritage Walking Tour",
    destination: "Hue City",
    price: 149,
    durationDays: 1,
    maxParticipants: 20,
    currentParticipants: 0,
    startDate: new Date("2026-06-18T09:00:00Z"),
    image: "/images/hue_cover.jpg",
    description: "Step back in time to the Nguyen Dynasty. Guided historical tour of the Hue Imperial Citadel, royal tombs, and a scenic dragon boat cruise along the tranquil Perfume River."
  },
  {
    name: "Hoi An Ancient Town Cooking & Lanterns",
    destination: "Hoi An, Quang Nam",
    price: 189,
    durationDays: 2,
    maxParticipants: 15,
    currentParticipants: 0,
    startDate: new Date("2026-06-25T14:00:00Z"),
    image: "/images/hoian_cover.jpg",
    description: "Stroll the glowing lantern-lit streets of Hoi An. Includes a traditional lantern-making workshop, a boat ride on the Thu Bon River, and a hands-on Vietnamese cooking masterclass."
  },
  {
    name: "Golden Bridge & Ba Na Hills Full Day",
    destination: "Da Nang City",
    price: 129,
    durationDays: 1,
    maxParticipants: 25,
    currentParticipants: 0,
    startDate: new Date("2026-06-12T07:30:00Z"),
    image: "/images/banahills_cover.jpg",
    description: "Walk between the giant stone hands at the world-famous Golden Bridge. Ride one of the longest cable cars in the world, explore the French Village, and visit beautiful flower gardens."
  },
  {
    name: "Phong Nha-Ke Bang Caves Expedition",
    destination: "Phong Nha, Quang Binh",
    price: 599,
    durationDays: 3,
    maxParticipants: 8,
    currentParticipants: 0,
    startDate: new Date("2026-07-05T08:00:00Z"),
    image: "/images/phongnha_cover.jpg",
    description: "An adventurous journey into the UNESCO world heritage karst caves. Explore Paradise Cave, take a boat inside Phong Nha Cave, and swim through dark river caves equipped with headlights."
  },
  {
    name: "Nha Trang Bay Snorkeling & Island Tour",
    destination: "Nha Trang, Khanh Hoa",
    price: 159,
    durationDays: 1,
    maxParticipants: 18,
    currentParticipants: 0,
    startDate: new Date("2026-06-14T08:30:00Z"),
    image: "/images/nhatrang_cover.jpg",
    description: "Cruise around the gorgeous islands of Nha Trang Bay. Enjoy swimming and snorkeling at Mun Island coral reefs, visit a floating fishing village, and relax on premium sand beaches."
  },
  {
    name: "Da Lat Romantic Pine Forests & Waterfalls",
    destination: "Da Lat, Lam Dong",
    price: 219,
    durationDays: 2,
    maxParticipants: 14,
    currentParticipants: 0,
    startDate: new Date("2026-06-22T08:00:00Z"),
    image: "/images/dalat_cover.jpg",
    description: "Escape the tropical heat in the cool highland city of Da Lat. Tour roaring waterfalls, peaceful clay tunnels, French villas, and lush strawberry gardens."
  },
  {
    name: "Mui Ne White Sand Dunes & Coastal jeep Tour",
    destination: "Mui Ne, Phan Thiet",
    price: 179,
    durationDays: 2,
    maxParticipants: 12,
    currentParticipants: 0,
    startDate: new Date("2026-06-19T05:00:00Z"),
    image: "/images/muine_cover.jpg",
    description: "Witness the magnificent sunrise over the White Sand Dunes of Mui Ne. Ride ATVs, walk along the unique Fairy Stream, and visit a traditional fishing harbor."
  },
  {
    name: "Mekong Delta Floating Markets & River Life",
    destination: "Can Tho, Mekong Delta",
    price: 199,
    durationDays: 2,
    maxParticipants: 16,
    currentParticipants: 0,
    startDate: new Date("2026-06-28T07:00:00Z"),
    image: "/images/mekong_cover.jpg",
    description: "Immerse yourself in the bustling water lifestyle of the Mekong Delta. Take a boat to Cai Rang Floating Market, sample fresh tropical fruits, and cycle through small village paths."
  },
  {
    name: "Phu Quoc Island Luxury Sunsets & Beach Resort",
    destination: "Phu Quoc, Kien Giang",
    price: 799,
    durationDays: 4,
    maxParticipants: 8,
    currentParticipants: 0,
    startDate: new Date("2026-07-10T09:00:00Z"),
    image: "/images/phuquoc_cover.jpg",
    description: "Unwind on the pristine white sand beaches of Phu Quoc Island. Includes snorkeling in the southern islands, a premium sunset cruise, and five-star resort accommodations."
  },
  {
    name: "Con Dao Archipelago Wildlife & Heritage Escape",
    destination: "Con Dao Island, Ba Ria - Vung Tau",
    price: 649,
    durationDays: 3,
    maxParticipants: 10,
    currentParticipants: 0,
    startDate: new Date("2026-07-15T08:00:00Z"),
    image: "/images/condao_cover.jpg",
    description: "Discover the hidden paradise of Con Dao. Tour the historical Con Dao prison ruins, snorkel in rich coral reef areas, and hike inside pristine tropical national parks."
  },
  {
    name: "Hanoi Street Food & Old Quarter Highlights",
    destination: "Hanoi Capital",
    price: 89,
    durationDays: 1,
    maxParticipants: 15,
    currentParticipants: 0,
    startDate: new Date("2026-06-11T17:30:00Z"),
    image: "/images/hanoi_cover.jpg",
    description: "Savor the world-renowned street foods of Hanoi. Guided walk through the 36 old streets, eating hot Bun Cha, crispy Banh Mi, sweet egg coffee, and traditional desserts."
  },
  {
    name: "Ho Chi Minh City Modern Energy & Cu Chi Tunnels",
    destination: "Ho Chi Minh City",
    price: 139,
    durationDays: 1,
    maxParticipants: 20,
    currentParticipants: 0,
    startDate: new Date("2026-06-16T08:00:00Z"),
    image: "/images/hcmc_cover.jpg",
    description: "Experience the vibrant energy of Saigon. Learn history by exploring the intricate underground network of Cu Chi Tunnels, and tour iconic Independence Palace and Notre Dame Cathedral."
  },
  {
    name: "Ba Be Lake & Ban Gioc Waterfall Explorer",
    destination: "Cao Bang & Bac Kan",
    price: 349,
    durationDays: 3,
    maxParticipants: 12,
    currentParticipants: 0,
    startDate: new Date("2026-07-22T08:00:00Z"),
    image: "/images/babe_cover.jpg",
    description: "Explore the giant Ban Gioc Waterfall bordering China and the peaceful, emerald waters of Ba Be Lake. Take a boat ride through Puong Cave and enjoy ethnic Tay village culture."
  },
  {
    name: "Cat Ba Island & Lan Ha Bay Premium Cruise",
    destination: "Cat Ba Island, Hai Phong",
    price: 299,
    durationDays: 2,
    maxParticipants: 18,
    currentParticipants: 0,
    startDate: new Date("2026-07-18T09:00:00Z"),
    image: "/images/catba_cover.jpg",
    description: "Sail through the pristine, less-crowded Lan Ha Bay adjacent to Ha Long Bay. Explore Cat Ba National Park, kayak inside dark caves, and relax on the secluded beaches of Monkey Island."
  },
  {
    name: "Ninh Binh - Trang An & Tam Coc Landscape",
    destination: "Ninh Binh Province",
    price: 99,
    durationDays: 1,
    maxParticipants: 22,
    currentParticipants: 0,
    startDate: new Date("2026-06-29T08:00:00Z"),
    image: "/images/ninhbinh_cover.jpg",
    description: "Tour the spectacular inland Ha Long Bay. Float in a hand-rowed bamboo boat through Trang An cave complexes, climb 500 stone steps at Hang Mua for panoramic views, and cycle along rice paddies."
  },
  {
    name: "Quy Nhon Ky Co Beach & Eo Gio Wind Strait",
    destination: "Quy Nhon, Binh Dinh",
    price: 229,
    durationDays: 2,
    maxParticipants: 14,
    currentParticipants: 0,
    startDate: new Date("2026-07-08T08:30:00Z"),
    image: "/images/quynhon_cover.jpg",
    description: "Discover the pristine coastlines of Quy Nhon. Walk along the windy cliffs of Eo Gio, swim at the crystal-clear Ky Co beach, and explore ancient Cham Towers."
  },
  {
    name: "Tay Ninh Cao Dai Temple & Ba Den Mountain",
    destination: "Tay Ninh Province",
    price: 79,
    durationDays: 1,
    maxParticipants: 30,
    currentParticipants: 0,
    startDate: new Date("2026-06-26T07:00:00Z"),
    image: "/images/tayninh_cover.jpg",
    description: "Witness the magnificent ceremony of the Cao Dai faith. Ride a modern cable car up the holy Ba Den Mountain to visit the towering bronze Buddha statue and sacred temples."
  }
];

async function seedTours() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Delete existing tours
    await Tour.deleteMany({});
    console.log("Deleted existing tours...");

    // Insert new tours
    await Tour.insertMany(tours);
    console.log("Successfully seeded 20 spectacular Vietnam tours! 🇻🇳");
    
    // Seed default users for testing
    const defaultUsers = [
      { name: "Nguyễn Anh Tuấn", email: "customer@gmail.com", password: "password123", role: "CUSTOMER", phone: "0912345678", address: "123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh" },
      { name: "Trần Thị Hồng Mai", email: "staff@gmail.com", password: "password123", role: "OPERATOR", phone: "0987654321", address: "456 Đường Nguyễn Trãi, Thanh Xuân, Hà Nội" },
      { name: "Phạm Minh Đức", email: "accountant@gmail.com", password: "password123", role: "ACCOUNTANT", phone: "0945678901", address: "789 Đường Trần Hưng Đạo, Hải Châu, Đà Nẵng" },
      { name: "Lê Hoàng Nam", email: "admin@gmail.com", password: "password123", role: "ADMIN", phone: "0909090909", address: "88 Đường Hùng Vương, Ba Đình, Hà Nội" },
      { name: "Vũ Tiến Đạt", email: "guide@gmail.com", password: "password123", role: "GUIDE", phone: "0909123456", address: "99 Đường Lê Lai, Quận 1, TP. Hồ Chí Minh" }
    ];

    // Remove existing test accounts first to avoid duplicates
    for (const u of defaultUsers) {
      await User.deleteOne({ email: u.email });
    }
    const createdUsers = await User.create(defaultUsers);
    console.log("Successfully seeded 4 test role accounts! 🔑");

    // Fetch the inserted tours
    const insertedTours = await Tour.find({});
    const customer = createdUsers.find(u => u.role === "CUSTOMER");
    const accountant = createdUsers.find(u => u.role === "ACCOUNTANT");

    // Delete existing Bookings and Invoices
    await Booking.deleteMany({});
    await Invoice.deleteMany({});
    console.log("Deleted existing bookings and invoices...");

    // Generate 40 random bookings over the last 12 months
    const bookingsData = [];
    const now = new Date();
    
    for (let i = 0; i < 40; i++) {
      const randomTour = insertedTours[Math.floor(Math.random() * insertedTours.length)];
      
      // Random date in the last 12 months
      const pastDate = new Date(now.getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000);
      
      const participants = Math.floor(Math.random() * 4) + 1; // 1 to 4 participants
      const statusOptions = ["CONFIRMED", "COMPLETED", "PENDING"];
      const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
      
      bookingsData.push({
        user: customer._id,
        tour: randomTour._id,
        bookingDate: pastDate,
        status: status,
        paymentStatus: status === "PENDING" ? "UNPAID" : "PAID",
        participants: participants
      });
    }

    const insertedBookings = await Booking.insertMany(bookingsData);
    
    // Generate invoices for PAID bookings
    const invoicesData = [];
    for (const booking of insertedBookings) {
      if (booking.paymentStatus === "PAID") {
        const tour = insertedTours.find(t => t._id.toString() === booking.tour.toString());
        const amount = tour.price * booking.participants;
        
        invoicesData.push({
          booking: booking._id,
          accountant: accountant._id,
          amount: amount,
          status: "PAID",
          issuedAt: booking.bookingDate
        });
      }
    }
    
    await Invoice.insertMany(invoicesData);
    console.log(`Successfully seeded ${insertedBookings.length} bookings and ${invoicesData.length} invoices! 💰`);
    
    // Recalculate currentParticipants for all tours in the database based on the seeded bookings
    console.log("Recalculating currentParticipants for all tours...");
    const tourList = await Tour.find({});
    for (const tour of tourList) {
      const activeBookings = bookingsData.filter(b => b.tour.toString() === tour._id.toString() && b.status !== "CANCELLED");
      const total = activeBookings.reduce((sum, b) => sum + b.participants, 0);
      await Tour.findByIdAndUpdate(tour._id, { currentParticipants: total });
    }
    console.log("Tour participant levels recalculated successfully!");

    // Delete existing tickets
    await Ticket.deleteMany({});
    console.log("Deleted existing support tickets...");

    // Seed 6 support tickets
    const supportTickets = [
      {
        user: customer._id,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        subject: "Không nhận được email xác nhận đặt tour",
        message: "Chào admin, tôi đã thanh toán tour du lịch Hạ Long nhưng chưa nhận được email xác nhận hay hóa đơn. Vui lòng kiểm tra giúp tôi.",
        category: "Booking",
        priority: "High",
        status: "New"
      },
      {
        user: customer._id,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        subject: "Hỏi về chính sách hoàn tiền",
        message: "Tôi muốn tìm hiểu thêm về chính sách hoàn hủy tour nếu gặp lý do bất khả kháng như thiên tai hay dịch bệnh.",
        category: "General Inquiry",
        priority: "Medium",
        status: "Resolved",
        reply: "Chào anh Tuấn, chính sách hoàn hủy của chúng tôi hỗ trợ hoàn tiền 100% trong trường hợp thiên tai được cơ quan chức năng công bố. Anh có thể xem chi tiết ở mục Điều khoản dịch vụ."
      },
      {
        user: customer._id,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        subject: "Lỗi hiển thị hóa đơn trên Profile",
        message: "Tôi vào mục lịch sử đặt tour để tải hóa đơn PDF nhưng trang bị quay tròn không tải được.",
        category: "Technical",
        priority: "Low",
        status: "In Progress",
        reply: "Cảm ơn anh đã phản hồi, đội ngũ kỹ thuật đang kiểm tra và khắc phục lỗi này."
      },
      {
        user: null,
        customerName: "Hoàng Lê Dung",
        customerEmail: "dung.hl@gmail.com",
        customerPhone: "0967888999",
        subject: "Yêu cầu hoàn tiền tour Sapa",
        message: "Tôi đã hủy tour Sapa trước 10 ngày nhưng chưa thấy tiền hoàn về tài khoản ngân hàng. Xin giải quyết sớm giúp tôi.",
        category: "Refund",
        priority: "High",
        status: "New"
      },
      {
        user: null,
        customerName: "Vũ Hải Đăng",
        customerEmail: "haidang.vu@yahoo.com",
        customerPhone: "0901234567",
        subject: "Tư vấn tour gia đình 6 người đi Đà Nẵng",
        message: "Tôi muốn đặt tour đi Đà Nẵng vào tháng tới cho gia đình có người lớn tuổi và trẻ nhỏ, cần tư vấn lịch trình nhẹ nhàng không tốn nhiều sức di chuyển.",
        category: "General Inquiry",
        priority: "Medium",
        status: "New"
      },
      {
        user: null,
        customerName: "Nguyễn Thị Lan",
        customerEmail: "lannth@gmail.com",
        customerPhone: "0934567890",
        subject: "Phản hồi về chất lượng xe di chuyển",
        message: "Xe đưa đón tour Ba Bể hơi cũ và điều hòa không mát lắm, mong công ty nâng cấp xe để chặng đi dài được thoải mái hơn.",
        category: "Feedback",
        priority: "Medium",
        status: "In Progress",
        reply: "Chào chị Lan, chúng tôi vô cùng xin lỗi về trải nghiệm này. Công ty đã ghi nhận và làm việc với bên nhà xe đối tác để nâng cấp và bảo dưỡng toàn bộ hệ thống điều hòa trên xe."
      }
    ];

    await Ticket.insertMany(supportTickets);
    console.log("Successfully seeded 6 support tickets! 🎫");

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seedTours();
