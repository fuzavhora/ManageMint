const nodemailer = require('nodemailer');
dotenv = require('dotenv').config();

const sendMail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"ManageMint" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    }); 

    console.log("✅ Email sent successfully to", to);

  } catch (err) {
    console.error("❌ Failed to send email:", err.message);
    throw new Error("Email sending failed");
  }
};

module.exports = sendMail;
