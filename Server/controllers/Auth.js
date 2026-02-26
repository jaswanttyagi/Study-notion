const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const Profile = require("../models/Profile");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const otpTemplate = require("../mail/templates/emialVerificationTemplate");
require("dotenv").config();
// send otp
exports.sendOTP = async (req, res) => {
  try {
    const email = req.body?.email?.trim()?.toLowerCase();
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }
    // check if User already exist 
    const checkUserPresent = await User.findOne({ email }).lean();
    // if user exist then return response ==> user already exist
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User Already Registered",
      })
    }
    // generate otp
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    // check otp is unique or not

    let result = await OTP.findOne({ otp: otp });
    // otp toh atlast generate krna hi hai hr hal me isliye yha if else vala funda nhi lga skte hai ki result hai toh vapas chle jao
    //  -->  ye while loop tab chlega jab otp unique nhi hoga
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });

    }
    const otpPayload = { email, otp };
    // create an entry for OTP
    await OTP.create(otpPayload);
    // calling otpTemplate and sending
    const emailBody = otpTemplate(otpPayload.otp);
    const otpFallbackToResponse =
      (process.env.OTP_FALLBACK_TO_RESPONSE || "false").toLowerCase() === "true";
    try {
      const mailInfo = await mailSender(
        email,
        "OTP Verification Email",
        emailBody
      );

      if (!mailInfo || !Array.isArray(mailInfo.accepted) || !mailInfo.accepted.includes(email)) {
        throw new Error("Email delivery not accepted by SMTP provider");
      }
    } catch (mailErr) {
      console.error("sendOTP mail failure:", mailErr?.message || mailErr);
      if (otpFallbackToResponse) {
        return res.status(200).json({
          success: true,
          message: "OTP generated. Email failed.",
          mailDelivered: false,
        });
      }
      return res.status(500).json({
        success: false,
        message: "OTP created but email delivery failed. Please try again.",
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP Sent Sucessfully",
      mailDelivered: true,
    })

  } catch (err) {
    console.log("sendOTP error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to generate OTP",
    })
  }
};

//  signUp

exports.signup = async (req, res) => {
  try {
    // Destructure fields
    const {
      firstName,
      lastName,
      email: rawEmail,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    const email = rawEmail?.trim()?.toLowerCase();
    // Validate fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All Fields are required",
      });
    }

    // Password match check
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password do not match",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please login.",
      });
    }

    // 🔥 Get latest OTP
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);

    if (recentOtp.length === 0) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    // 🔥 Convert both to string & trim
    const enteredOtp = otp.toString().trim();
    const dbOtp = recentOtp[0].otp.toString().trim();

   

    // OTP match check
    if (enteredOtp !== dbOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Approval logic
    let approved = accountType === "Instructor" ? false : true;

    // Create profile
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      approved,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    // 🔥 Delete OTP after use
    await OTP.deleteMany({ email });

    return res.status(200).json({
      success: true,
      user,
      message: "Signup successful",
    });

  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    });
  }
};


// Login
exports.Login = async (req, res) => {
  try {
    const email = req.body?.email?.trim()?.toLowerCase();
    const { password } = req.body;

    // validate data

    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "Fill the Details correctly",
      })
    }
    // check if user is not registerd
    const user = await User.findOne({ email })
      .populate("additionalDetails")
      .lean();
    //  if user not exist in login case then return (means user is not registered)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not Exist"
      })
    }
    // generate JWT 
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      }
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });
      user.token = token; // request ki body ke sath hi token bhej rhe hai yha
      user.password = undefined;

      // create the cookie
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),  //3* 24 * 60 * 60 *1000 => this show cookie expires in 3 days
        httpOnly: true,
      }
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "LoggedIn sucessfully",
      });
    }
    else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }

  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({
      success: false,
      message: "Login Failure Please Try Again Later !! ...",
    });
  }
}
// jab user login krlega tb use khud hi ek userId mil jayegi


// Change password

exports.changePassword = async (req, res) => {
  try {
    // get user from req body
    const userId = req.user.id;
    // get oldpass , newpass , confirmnewpass
    const{email , oldpassword , newpassword , confirmnewPassword} = req.body
    // validation
    if(!oldpassword || !newpassword || !confirmnewPassword){
      res.status(401).json({
        success:false,
        message:"All fields are required",
      });
    }
    if(newpassword !== confirmnewPassword){
      res.status(401).json({
        success:false,
        message:"newpassword not match with confirmnewPassword",
      });
    }
    // get user --> check the user is login or not 
    const user = await User.findById({userId});
    // Compare oldPassword with stored password (bcrypt.compare)
    const isMatch = await bcrypt.compare(oldpassword , user.password );
    if(!isMatch){
      return res.status(403).json({
        success:false,
        message:"Please enter the correct old password",
      })
    }

    // update newpass in db

    const hashedPassword = await bcrypt.hash(newpassword , 10);
    user.password = hashedPassword;
    await user.save();

    // send mail-password updated
    await mailSender(
      user.email,
      "Password Changed Successfully",
      "Your password has been updated securely."
    );

    // return response
    res.status(200).json({
      success:true,
      message:"Password Changed sucessfully",
    });

  } catch (err) {
    res.status(500).json({
      success:false,
      message:err.message,
    });
  }
};
