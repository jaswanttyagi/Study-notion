const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (email, title, body) => {
  const mailHost = (process.env.MAIL_HOST || "smtp.gmail.com").trim();
  const envPort = Number(process.env.MAIL_PORT || 0);
  const mailUser = (process.env.MAIL_USER || "").trim();
  const mailPass = (process.env.MAIL_PASS || "").replace(/\s+/g, "");

  const candidates = [];
  if (envPort === 465 || envPort === 587) {
    candidates.push({ port: envPort, secure: envPort === 465 });
  }
  if (!candidates.find((c) => c.port === 587)) candidates.push({ port: 587, secure: false });
  if (!candidates.find((c) => c.port === 465)) candidates.push({ port: 465, secure: true });

  let lastErr;
  for (const candidate of candidates) {
    try {
      const transporter = nodemailer.createTransport({
        host: mailHost,
        port: candidate.port,
        secure: candidate.secure,
        requireTLS: !candidate.secure,
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

      console.log("Email sent:", info.messageId, "via:", candidate.port, "accepted:", info.accepted, "rejected:", info.rejected);

      if (Array.isArray(info.rejected) && info.rejected.length > 0) {
        throw new Error(`Email rejected for: ${info.rejected.join(", ")}`);
      }
      return info;
    } catch (err) {
      lastErr = err;
      console.log(`Mail attempt failed on port ${candidate.port}:`, {
        message: err?.message,
        code: err?.code,
        command: err?.command,
        response: err?.response,
        responseCode: err?.responseCode,
      });
    }
  }

  const mailError = new Error(lastErr?.message || "SMTP delivery failed");
  mailError.code = lastErr?.code || "SMTP_ERROR";
  mailError.responseCode = lastErr?.responseCode;
  throw mailError;
};

module.exports = mailSender;
