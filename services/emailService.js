const nodemailer = require("nodemailer");

// Create dynamic transporter
let transporter;

const initTransporter = async () => {
  if (transporter) return transporter;

  // Use SMTP configs from process.env if available
  if (
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  ) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log("SMTP Mail Transporter Configured from environment variables");
  } else {
    // Fallback: Create ethereal test account for demonstration/development
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log(`SMTP dynamic test account created! Ethereal Login: ${testAccount.user}`);
    } catch (err) {
      // Offline fallback: log only
      transporter = {
        sendMail: async (options) => {
          console.log("--- MOCK EMAIL SENT ---");
          console.log(`To: ${options.to}`);
          console.log(`Subject: ${options.subject}`);
          console.log(`Body Snippet: ${options.html.substring(0, 150)}...`);
          console.log("------------------------");
          return { messageId: "mock-id-12345" };
        }
      };
      console.log("SMTP offline simulation loaded");
    }
  }
  return transporter;
};

// Send booking confirmation invoice
const sendBookingConfirmation = async (customerEmail, booking, tour) => {
  const mailTransporter = await initTransporter();
  const totalPrice = (tour.price || 0) * booking.participants;
  const formattedPrice = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalPrice);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Hóa Đơn Đặt Tour Du Lịch</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f6f9fc; margin: 0; padding: 20px; }
        .invoice-box { max-width: 600px; margin: auto; padding: 30px; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f0f4f8; padding-bottom: 20px; margin-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #1e3a8a; }
        .invoice-details { text-align: right; font-size: 14px; color: #64748b; }
        .title { font-size: 20px; font-weight: bold; color: #0f172a; margin-top: 0; }
        .customer-info { background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 25px; font-size: 14px; color: #334155; }
        .customer-info table { width: 100%; border-collapse: collapse; }
        .customer-info td { padding: 4px 0; }
        .customer-info td.label { font-weight: bold; color: #475569; width: 120px; }
        .tour-details-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
        .tour-details-table th { background: #f1f5f9; color: #475569; font-weight: bold; text-align: left; padding: 12px; font-size: 14px; }
        .tour-details-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #334155; }
        .total-row td { font-weight: bold; font-size: 16px; color: #1e3a8a; border-bottom: none; padding-top: 15px; }
        .footer { text-align: center; font-size: 12px; color: #94a3b8; margin-top: 30px; border-top: 1px solid #f0f4f8; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="invoice-box">
        <div class="header">
          <div class="logo">VIETNAM TOURS</div>
          <div class="invoice-details">
            <strong>Mã booking:</strong> ${booking._id.toString().toUpperCase()}<br>
            <strong>Ngày đặt:</strong> ${new Date(booking.createdAt).toLocaleDateString("vi-VN")}
          </div>
        </div>

        <h2 class="title">Xác Nhận Đặt Tour & Hóa Đơn Thanh Toán</h2>
        <p>Cảm ơn bạn đã lựa chọn Vietnam Tours. Booking của bạn đã được xác nhận thành công!</p>

        <div class="customer-info">
          <table>
            <tr>
              <td class="label">Người đặt:</td>
              <td>${booking.user?.name || booking.user?.email || "Khách hàng"}</td>
            </tr>
            <tr>
              <td class="label">Hình thức:</td>
              <td>Thanh toán chuyển khoản / Thẻ nội địa</td>
            </tr>
            <tr>
              <td class="label">Trạng thái:</td>
              <td><span style="color: #10b981; font-weight: bold;">ĐÃ XÁC NHẬN</span></td>
            </tr>
          </table>
        </div>

        <table class="tour-details-table">
          <thead>
            <tr>
              <th>Tour / Địa danh</th>
              <th style="text-align: center;">Số lượng</th>
              <th style="text-align: right;">Đơn giá</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>${tour.name}</strong><br>
                <span style="font-size: 12px; color: #64748b;">Khởi hành: ${new Date(booking.bookingDate).toLocaleDateString("vi-VN")}</span>
              </td>
              <td style="text-align: center;">${booking.participants} Khách</td>
              <td style="text-align: right;">${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(tour.price)}</td>
            </tr>
            <tr class="total-row">
              <td colspan="2" style="text-align: right;">Tổng thanh toán:</td>
              <td style="text-align: right;">${formattedPrice}</td>
            </tr>
          </tbody>
        </table>

        <div class="footer">
          <p>Chúc bạn có một chuyến đi thật vui vẻ và ý nghĩa!</p>
          <p>Hotline hỗ trợ: +84 123 456 789 | Email: support@vietnamtours.com</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const info = await mailTransporter.sendMail({
      from: '"Vietnam Tours Support" <noreply@vietnamtours.com>',
      to: customerEmail,
      subject: `[Vietnam Tours] Xác nhận Booking & Hóa đơn #${booking._id.toString().substring(16).toUpperCase()}`,
      html: htmlContent,
    });
    console.log(`Booking invoice email sent successfully to ${customerEmail}. Message ID: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error("Failed to send booking confirmation email:", err);
  }
};

// Send support ticket response notification
const sendTicketReplyNotification = async (customerEmail, ticketSubject, staffReply) => {
  const mailTransporter = await initTransporter();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Phản Hồi Yêu Cầu Hỗ Trợ</title>
      <style>
        body { font-family: sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: auto; padding: 25px; background: #ffffff; border-radius: 8px; border-top: 4px solid #3b82f6; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .title { color: #1e3a8a; font-size: 20px; font-weight: bold; margin-bottom: 15px; }
        .ticket-box { background: #f1f5f9; padding: 15px; border-radius: 6px; margin: 20px 0; font-size: 14px; color: #334155; }
        .footer { text-align: center; font-size: 12px; color: #64748b; margin-top: 25px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2 class="title">Chúng tôi đã phản hồi yêu cầu hỗ trợ của bạn</h2>
        <p>Chào bạn,</p>
        <p>Bộ phận hỗ trợ chăm sóc khách hàng của Vietnam Tours đã gửi phản hồi cho yêu cầu:</p>
        <p><strong>Chủ đề:</strong> "${ticketSubject}"</p>
        
        <div class="ticket-box">
          <strong>Nội dung phản hồi của nhân viên:</strong><br>
          <p style="white-space: pre-wrap; margin-top: 8px; color: #1e293b; font-style: italic;">${staffReply}</p>
        </div>

        <p>Nếu bạn còn bất kỳ thắc mắc nào, hãy liên hệ trực tiếp với chúng tôi qua hotline.</p>
        <div class="footer">
          <p>Vietnam Tours Support Team | Hotline: +84 123 456 789</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const info = await mailTransporter.sendMail({
      from: '"Vietnam Tours Support" <support@vietnamtours.com>',
      to: customerEmail,
      subject: `[Vietnam Tours] Phản hồi yêu cầu hỗ trợ: ${ticketSubject}`,
      html: htmlContent,
    });
    console.log(`Ticket reply notification email sent successfully to ${customerEmail}`);
    return info;
  } catch (err) {
    console.error("Failed to send ticket reply email:", err);
  }
};

// Send pre-trip departure reminder
const sendDepartureReminder = async (customerEmail, tourName, startDate) => {
  const mailTransporter = await initTransporter();
  const formattedDate = new Date(startDate).toLocaleDateString("vi-VN");

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Nhắc Nhở Khởi Hành</title>
      <style>
        body { font-family: sans-serif; background-color: #fbf7f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: auto; padding: 25px; background: #ffffff; border-radius: 8px; border-top: 4px solid #ea580c; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .title { color: #ea580c; font-size: 20px; font-weight: bold; margin-bottom: 15px; }
        .reminder-box { border-left: 4px solid #ea580c; background: #fff7ed; padding: 15px; border-radius: 0 6px 6px 0; margin: 20px 0; font-size: 14px; }
        .footer { text-align: center; font-size: 12px; color: #64748b; margin-top: 25px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2 class="title">Chuẩn bị hành lý sẵn sàng cho ngày mai!</h2>
        <p>Chào bạn,</p>
        <p>Chỉ còn 1 ngày nữa là hành trình khám phá đầy hứa hẹn của bạn sẽ bắt đầu!</p>

        <div class="reminder-box">
          <strong>Thông tin tour:</strong><br>
          <strong>Tên tour:</strong> ${tourName}<br>
          <strong>Ngày khởi hành:</strong> Ngày mai, ${formattedDate}<br>
          <strong>HDV hỗ trợ:</strong> Hướng dẫn viên Vietnam Tours sẽ liên hệ trực tiếp cho bạn qua số điện thoại để hẹn điểm đón chính xác.
        </div>

        <h3 style="color: #475569;">Gợi ý chuẩn bị hành trình:</h3>
        <ul style="font-size: 14px; color: #475569; padding-left: 20px;">
          <li>Mang theo giấy tờ tùy thân hợp lệ (CCCD, Hộ chiếu, Visa).</li>
          <li>Quần áo phù hợp với khí hậu điểm đến và giày thể thao êm chân.</li>
          <li>Sạc dự phòng, kem chống nắng, và một số loại thuốc cá nhân cơ bản.</li>
          <li>Đến điểm hẹn trước giờ khởi hành ít nhất 15 phút.</li>
        </ul>

        <div class="footer">
          <p>Nếu bạn có bất cứ thay đổi khẩn cấp nào, hãy gọi hotline hỗ trợ khẩn cấp 24/7 của chúng tôi.</p>
          <p>Vietnam Tours | Hotline: +84 123 456 789 | support@vietnamtours.com</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const info = await mailTransporter.sendMail({
      from: '"Vietnam Tours Support" <reminders@vietnamtours.com>',
      to: customerEmail,
      subject: `[Vietnam Tours] Nhắc nhở khởi hành Tour: ${tourName} vào ngày mai!`,
      html: htmlContent,
    });
    console.log(`Departure reminder email sent successfully to ${customerEmail}`);
    return info;
  } catch (err) {
    console.error("Failed to send departure reminder email:", err);
  }
};

module.exports = {
  sendBookingConfirmation,
  sendTicketReplyNotification,
  sendDepartureReminder
};
