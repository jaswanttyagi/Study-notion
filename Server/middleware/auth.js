// NOTE  --> middleware ka kam tbhi hai jb user login ho


const jwt = require("jsonwebtoken");
// is jwt me token and payload bhi hai means jsonwebtoken aa gya menas ye data bhi iske sath hi aa gya
// like we use many place like --> req.user.accountType so accountType is present in payload when you create jwt.sign in Auth.js in controller folder 
const User = require("../models/User");
require("dotenv").config();

// Auth middleware: checks JWT token
exports.auth = async (req, res, next) => {
    try {
const token =
  req.cookies?.token || 
  req.header("Authorization")?.replace("Bearer ", "");
    //    if token is missing then retrun response
    if(!token){
        return res.status(401).json({
            success:false,
            message:"token is missing",
        });
    }
    // verify the token
    try{
        const decode = jwt.verify(token , process.env.JWT_SECRET);
        console.log(decode);
        req.user = decode;
    }catch(err){
        return res.status(401).json({
            success:false,
            message:"Token not verified",
        });
    }
    next(); // this next() help  go to the next middleware 
    } catch (err) {
        console.log(err);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

// Role middleware: Student
exports.isStudent = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Student") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Student role required."
            });
        }
        next();
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error validating student role"
        });
    }
};

// role middleware : Instructor
exports.isInstructor = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Instructor") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Instructor role required."
            });
        }
        next();
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error validating Instructor role"
        });
    }
};

// Role middleware: Admin
exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin role required."
            });
        }
        next();
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error validating Admin role"
        });
    }
};
