const express = require("express");
const router = express.Router();

// import the handler
const {signup , Login , sendOTP , changePassword } = require("../controllers/Auth");

const{resetPasswordToken , resetPassword} = require("../controllers/ResetPassword");

const {auth} = require("../middleware/auth");


// define the api route

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

console.log("auth =>", auth);
console.log("changePassword =>", changePassword);
console.log("resetPassword =>", resetPassword);
console.log("resetPasswordToken =>", resetPasswordToken);

router.post("/signup" , signup);
router.post("/Login" , Login);
router.post("/sendOTP" , sendOTP);
router.post("/changePassword" , auth , changePassword);

// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

router.post("/resetPassword" , resetPassword);
router.post("/resetPasswordToken" , resetPasswordToken);

module.exports = router;

