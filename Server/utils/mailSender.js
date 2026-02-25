const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config();

const mailSender = async (email, title, body) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST, // smtp.gmail.com
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"StudyNotion | EdTech" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,

      // ✅ THIS IS THE MAIN FIX
      html: body,

      // ✅ IMAGE ATTACHMENT WITH CID
    });

    console.log("Email sent:", info.messageId);
    return info;

  } catch (err) {
    console.log("Mail error:", err.message);
  }
};

module.exports = mailSender;
