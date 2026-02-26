const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const {passwordUpdated} = require("../mail/templates/passwordUpdate");
const { passwordResetTemplate } = require("../mail/templates/PasswordResetTemplate");
require("dotenv").config();



exports.resetPasswordToken = async (req, res) => {
  try {
    // 1️⃣ Get email from request
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // 2️⃣ Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email",
      });
    }

    // 3️⃣ Generate reset token
    const token = crypto.randomUUID();

    // 4️⃣ Save token & expiry in DB
    await User.findByIdAndUpdate(
      user._id,
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000, // 5 minutes
      },
      { new: true }
    );

    // 5️⃣ Create reset URL
    const resetUrl = `${process.env.FRONTEND_BASE_URL}/update-password/${token}`;

    // 6️⃣ Prepare email body
    const mailBody = passwordResetTemplate(user.firstName, resetUrl);

    // 7️⃣ Send email
    await mailSender(
      user.email,
      "Reset Your Password | StudyNotion",
      mailBody
    );

    // 8️⃣ Success response
    return res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });

  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending reset password email",
    });
  }
};



// Reset password 
//  qus --> how it is diffrent from changePassword in reset password user not know the old password and user not loggedIn
// and it is used to recover acount while change password used for security reason and authentication


exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmpassword, token } = req.body;

    // 1️⃣ Validate all fields are provided
    if (!password || !confirmpassword || !token) {
      return res.status(400).json({
        success: false,
        message: "All fields (password, confirm password, token) are required",
      });
    }

    // 2️⃣ Check if password and confirmPassword match
    if (password !== confirmpassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password do not match",
      });
    }

    // 3️⃣ Find user by token
    const userDetails = await User.findOne({ token });

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "Invalid token",
      });
    }

    // 4️⃣ Check if token is expired
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.status(403).json({
        success: false,
        message: "Token is expired. Please request a new password reset",
      });
    }

    // 5️⃣ Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6️⃣ Update the user with new password and clear token fields
    userDetails.password = hashedPassword;
    userDetails.token = undefined;
    userDetails.resetPasswordExpires = undefined;
    await userDetails.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });

  } catch (err) {
    console.error("Reset Password Error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while resetting the password",
      error: err.message,
    });
  }
};