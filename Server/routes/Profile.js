const express = require("express");
const router = express.Router();

const {auth , isInstructor } = require("../middleware/auth");
const {deleteAccount , updateProfile , getAllUserDetails , updateDisplayPicture , getEnrolledCourses , instructorDashboard} = 
require("../controllers/Profile");

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delet User Account

router.delete("/deleteAccount" , auth, deleteAccount);
router.put("/updateProfile", auth ,  updateProfile);
router.get("/getAllUserDetails" , auth , getAllUserDetails);

// Get Enrolled Courses

router.post("/updateDisplayPicture" ,auth ,updateDisplayPicture);
router.get("/getEnrolledCourses" ,auth ,getEnrolledCourses);
router.get("/instructorDashboard" , auth , isInstructor,instructorDashboard);

module.exports = router;
