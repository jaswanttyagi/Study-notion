const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (email, title, body) => {
  try {
    const mailHost = (process.env.MAIL_HOST || "smtp.gmail.com").trim();
    const mailPort = Number(process.env.MAIL_PORT || 587);
    const secure = mailPort === 465;
    const mailUser = (process.env.MAIL_USER || "").trim();
    const mailPass = (process.env.MAIL_PASS || "").replace(/\s+/g, "");

    const transporter = nodemailer.createTransport({
      host: mailHost,
      port: mailPort,
      secure,
      requireTLS: !secure,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      auth: {
        user: mailUser,
        pass: mailPass,
      },
    });

    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"StudyNotion | EdTech" <${mailUser}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log("Email sent:", info.messageId, "accepted:", info.accepted, "rejected:", info.rejected);

    if (Array.isArray(info.rejected) && info.rejected.length > 0) {
      throw new Error(`Email rejected for: ${info.rejected.join(", ")}`);
    }

    return info;
  } catch (err) {
    console.log("Mail error:", {
      message: err?.message,
      code: err?.code,
      command: err?.command,
      response: err?.response,
      responseCode: err?.responseCode,
    });
    const mailError = new Error(err?.message || "SMTP delivery failed");
    mailError.code = err?.code || "SMTP_ERROR";
    mailError.responseCode = err?.responseCode;
    throw mailError;
  }
};

module.exports = mailSender;
