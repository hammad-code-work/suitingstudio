// utils/sendEmail.js — Nodemailer Email Utility
const nodemailer = require('nodemailer');

// ── Create transporter only if email is configured ────────
const createTransporter = () => {
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER.includes('your_email')) {
    return null; // email not configured yet
  }
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: { rejectUnauthorized: false },
  });
};

// @desc Send order notification email to admin
const sendOrderNotificationToAdmin = async (order) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.log('ℹ️  Email not configured — skipping admin notification');
    return;
  }

  const itemsHtml = order.orderItems
    .map(
      (item) => `
      <tr>
        <td style="padding:8px;border:1px solid #ddd;">${item.title}</td>
        <td style="padding:8px;border:1px solid #ddd;">${item.size}</td>
        <td style="padding:8px;border:1px solid #ddd;">${item.quantity}</td>
        <td style="padding:8px;border:1px solid #ddd;">$${item.price}</td>
      </tr>`
    )
    .join('');

  const mailOptions = {
    from: `"SuitingStudio Orders" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: `🛍️ New Order Received — ${order.customerName}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
        <div style="background:#1a1a2e;color:#fff;padding:20px 28px;">
          <h2 style="margin:0;">🧵 SuitingStudio — New Order!</h2>
        </div>
        <div style="padding:24px;background:#f9f9f9;">
          <h3>Order ID: <code style="background:#eee;padding:2px 8px;border-radius:4px;">#${order._id}</code></h3>
          <p><strong>Customer:</strong> ${order.customerName}</p>
          <p><strong>Email:</strong> ${order.customerEmail}</p>
          <p><strong>Phone:</strong> ${order.customerPhone}</p>
          <p><strong>Address:</strong> ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.country}</p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>

          <h3 style="border-top:1px solid #ddd;padding-top:16px;">Order Items</h3>
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="background:#1a1a2e;color:#fff;">
                <th style="padding:8px;text-align:left;">Product</th>
                <th style="padding:8px;text-align:left;">Size</th>
                <th style="padding:8px;text-align:left;">Qty</th>
                <th style="padding:8px;text-align:left;">Price</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>

          <div style="text-align:right;margin-top:16px;">
            <strong style="font-size:18px;">Total: $${order.totalAmount}</strong>
          </div>
        </div>
        <div style="padding:12px;background:#eee;text-align:center;font-size:12px;color:#888;">
          Login to Admin Panel → http://localhost:3000/admin/orders/${order._id}
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Admin notification sent for order ${order._id}`);
  } catch (err) {
    console.error('❌ Admin email failed:', err.message);
  }
};

// @desc Send order confirmation to customer
const sendOrderConfirmationToCustomer = async (order) => {
  const transporter = createTransporter();
  if (!transporter) return;

  const mailOptions = {
    from: `"SuitingStudio" <${process.env.EMAIL_USER}>`,
    to: order.customerEmail,
    subject: `✅ Order Confirmed — SuitingStudio #${order._id.toString().slice(-8).toUpperCase()}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
        <div style="background:#1a1a2e;color:#fff;padding:20px 28px;">
          <h2 style="margin:0;">✦ SuitingStudio</h2>
        </div>
        <div style="padding:24px;">
          <h2>Thank you, ${order.customerName}! 🎉</h2>
          <p>Your order has been placed successfully.</p>

          <div style="background:#f5f3ef;padding:16px;border-radius:8px;margin:20px 0;">
            <p style="margin:0 0 8px;"><strong>Order ID:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
            <p style="margin:0 0 8px;"><strong>Total Amount:</strong> $${order.totalAmount}</p>
            <p style="margin:0 0 8px;"><strong>Payment:</strong> ${order.paymentMethod.toUpperCase()}</p>
            <p style="margin:0;"><strong>Status:</strong> ${order.orderStatus}</p>
          </div>

          <p>We will notify you once your order is shipped.</p>
          <p>For any queries, contact us at: <a href="mailto:${process.env.ADMIN_EMAIL}">${process.env.ADMIN_EMAIL}</a></p>
        </div>
        <div style="padding:12px;background:#eee;text-align:center;font-size:12px;color:#888;">
          © ${new Date().getFullYear()} SuitingStudio. All rights reserved.
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Confirmation sent to ${order.customerEmail}`);
  } catch (err) {
    console.error('❌ Customer email failed:', err.message);
  }
};

module.exports = { sendOrderNotificationToAdmin, sendOrderConfirmationToCustomer };