const nodemailer = require("nodemailer");
require("dotenv").config();

const getMailConfig = () => {
  const mailHost = (process.env.MAIL_HOST || process.env.SMTP_HOST || "smtp.gmail.com").trim();
  const envPort = Number(process.env.MAIL_PORT || 0);
  const mailUser = (
    process.env.MAIL_USER ||
    process.env.SMTP_USER ||
    process.env.EMAIL_USER ||
    ""
  ).trim();
  const mailPass = (
    process.env.MAIL_PASS ||
    process.env.SMTP_PASS ||
    process.env.EMAIL_PASS ||
    ""
  ).replace(/\s+/g, "");
  const mailFrom = (process.env.MAIL_FROM || mailUser).trim();

  if (!mailUser || !mailPass) {
    const configError = new Error("Missing SMTP credentials");
    configError.code = "SMTP_CONFIG_MISSING";
    throw configError;
  }

  const candidates = [];
  if (envPort === 465 || envPort === 587) {
    candidates.push({ port: envPort, secure: envPort === 465 });
  }
  if (!candidates.find((c) => c.port === 587)) candidates.push({ port: 587, secure: false });
  if (!candidates.find((c) => c.port === 465)) candidates.push({ port: 465, secure: true });

  return { mailHost, mailUser, mailPass, mailFrom, candidates };
};

const mailSender = async (email, title, body) => {
  const { mailHost, mailUser, mailPass, mailFrom, candidates } = getMailConfig();

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
        from: `"StudyNotion | EdTech" <${mailFrom}>`,
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

const verifyMailConnection = async () => {
  const { mailHost, mailUser, mailPass, candidates } = getMailConfig();

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
      return { ok: true, port: candidate.port, secure: candidate.secure };
    } catch (err) {
      lastErr = err;
    }
  }

  const verifyError = new Error(lastErr?.message || "SMTP verify failed");
  verifyError.code = lastErr?.code || "SMTP_ERROR";
  verifyError.responseCode = lastErr?.responseCode;
  throw verifyError;
};

mailSender.verifyConnection = verifyMailConnection;
module.exports = mailSender;
