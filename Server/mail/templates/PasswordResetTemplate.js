exports.passwordResetTemplate = (name, resetUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Password Reset</title>
    </head>
    <body style="font-family: Arial;">
      <h2>Hello ${name},</h2>
      <p>You requested to reset your password.</p>
      <p>Click the link below to reset it:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 5 minutes.</p>
      <br/>
      <p>If you didn’t request this, ignore this email.</p>
    </body>
    </html>
  `;
};
