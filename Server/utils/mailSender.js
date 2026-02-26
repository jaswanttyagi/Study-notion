const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config();

const mailSender = async (email, title, body) => {
  try {
    const mailPass = (process.env.MAIL_PASS || "").replace(/\s+/g, "");
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST, // smtp.gmail.com
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: mailPass,
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
    if (Array.isArray(info.rejected) && info.rejected.length > 0) {
      throw new Error(`Email rejected for: ${info.rejected.join(", ")}`);
    }
    return info;

  } catch (err) {
    console.log("Mail error:", err.message);
    throw err;
  }
};

module.exports = mailSender;
