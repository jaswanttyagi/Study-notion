const nodemailer = require("nodemailer");
require("dotenv").config();

const sendViaBrevoApi = async (email, title, body) => {
  const apiKey = (process.env.BREVO_API_KEY || "").trim();
  if (!apiKey) return null;

  const senderEmail = (process.env.MAIL_FROM || process.env.MAIL_USER || "").trim();
  if (!senderEmail) {
    const configError = new Error("Missing MAIL_FROM for Brevo API sender");
    configError.code = "SMTP_CONFIG_MISSING";
    throw configError;
  }

  const senderName = (process.env.MAIL_FROM_NAME || "StudyNotion | EdTech").trim();

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email }],
      subject: title,
      htmlContent: body,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Brevo API request failed");
    const apiError = new Error(errorText || "Brevo API request failed");
    apiError.code = "BREVO_API_ERROR";
    apiError.responseCode = response.status;
    throw apiError;
  }

  const data = await response.json().catch(() => ({}));
  return {
    messageId: data?.messageId || data?.message || "brevo-api",
    accepted: [email],
    rejected: [],
  };
};

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

const getMailDiagnostics = () => {
  const rawHost =
    process.env.MAIL_HOST || process.env.SMTP_HOST || "smtp.gmail.com";
  const rawPort = process.env.MAIL_PORT || "";
  const rawUser =
    process.env.MAIL_USER ||
    process.env.SMTP_USER ||
    process.env.EMAIL_USER ||
    "";
  const rawPass =
    process.env.MAIL_PASS ||
    process.env.SMTP_PASS ||
    process.env.EMAIL_PASS ||
    "";

  return {
    host: String(rawHost).trim(),
    configuredPort: rawPort ? Number(rawPort) : null,
    hasUser: Boolean(String(rawUser).trim()),
    hasPass: Boolean(String(rawPass).trim()),
    hasBrevoApiKey: Boolean((process.env.BREVO_API_KEY || "").trim()),
    candidatePorts:
      Number(rawPort) === 465 || Number(rawPort) === 587
        ? [Number(rawPort), ...(Number(rawPort) === 587 ? [465] : [587])]
        : [587, 465],
  };
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

  // Fallback path: if SMTP ports are blocked/timing out, try Brevo HTTPS API.
  try {
    const brevoInfo = await sendViaBrevoApi(email, title, body);
    if (brevoInfo) {
      console.log("Email sent via Brevo API:", brevoInfo.messageId);
      return brevoInfo;
    }
  } catch (brevoErr) {
    lastErr = brevoErr;
    console.log("Brevo API fallback failed:", {
      message: brevoErr?.message,
      code: brevoErr?.code,
      responseCode: brevoErr?.responseCode,
    });
  }

  const mailError = new Error(lastErr?.message || "SMTP delivery failed");
  mailError.code = lastErr?.code || "SMTP_ERROR";
  mailError.responseCode = lastErr?.responseCode;
  throw mailError;
};

const verifyBrevoApiConnection = async () => {
  const apiKey = (process.env.BREVO_API_KEY || "").trim();
  if (!apiKey) return null;

  const response = await fetch("https://api.brevo.com/v3/account", {
    method: "GET",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "Brevo account check failed");
    const err = new Error(text || "Brevo account check failed");
    err.code = "BREVO_API_ERROR";
    err.responseCode = response.status;
    throw err;
  }

  return { ok: true, provider: "brevo-api", port: 443, secure: true };
};

const verifyMailConnection = async () => {
  const { mailHost, mailUser, mailPass, candidates } = getMailConfig();

  let lastErr;
  const attempts = [];
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
      attempts.push({
        host: mailHost,
        port: candidate.port,
        secure: candidate.secure,
        code: err?.code || null,
        responseCode: err?.responseCode || null,
        message: err?.message || "SMTP verify failed",
      });
    }
  }

  // Health fallback: if SMTP verify fails, but Brevo API key is present and works, mark healthy.
  try {
    const brevoHealth = await verifyBrevoApiConnection();
    if (brevoHealth) return brevoHealth;
  } catch (err) {
    lastErr = err;
    attempts.push({
      host: "api.brevo.com",
      port: 443,
      secure: true,
      code: err?.code || null,
      responseCode: err?.responseCode || null,
      message: err?.message || "Brevo account check failed",
    });
  }

  const verifyError = new Error(lastErr?.message || "SMTP verify failed");
  verifyError.code = lastErr?.code || "SMTP_ERROR";
  verifyError.responseCode = lastErr?.responseCode;
  verifyError.attempts = attempts;
  throw verifyError;
};

mailSender.verifyConnection = verifyMailConnection;
mailSender.getDiagnostics = getMailDiagnostics;
module.exports = mailSender;
