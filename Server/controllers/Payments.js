const Course = require("../models/Courses");
const mailSender = require("../utils/mailSender");
const User = require("../models/User");
const crypto = require("crypto");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");
const { instance } = require("../config/Razorpay");
const { default: mongoose } = require("mongoose");
const CourseProgress = require("../models/CourseProgress");
require("dotenv").config();

// capture the payment and initate the razorpay order

// Capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
  const { courses } = req.body
  const userId = req.user.id
  if (!Array.isArray(courses) || courses.length === 0) {
    return res.json({ success: false, message: "Please Provide Course ID" })
  }

  let total_amount = 0

  for (const course_id of courses) {
    let course
    try {
      // Find the course by its ID
      course = await Course.findById(course_id)

      // If the course is not found, return an error
      if (!course) {
        return res
          .status(200)
          .json({ success: false, message: "Could not find the Course" })
      }

      // Check if the user is already enrolled in the course
      if (course.studentEnrolled.some((id) => id.toString() === userId)) {
        return res
          .status(200)
          .json({ success: false, message: "Student is already Enrolled" })
      }

      // Add the price of the course to the total amount
      total_amount += course.price
    } catch (error) {
      console.log(error)
      return res.status(500).json({ success: false, message: error.message })
    }
  }

  const options = {
    amount: total_amount * 100,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
  }

  try {
    // Initiate the payment using Razorpay
    const paymentResponse = await instance.orders.create(options)
    console.log(paymentResponse)
    res.json({
      success: true,
      data: paymentResponse,
    })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ success: false, message: "Could not initiate order." })
  }
}


// verify the payment
exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id
  const razorpay_payment_id = req.body?.razorpay_payment_id
  const razorpay_signature = req.body?.razorpay_signature
  const courses = req.body?.courses

  const userId = req.user.id

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !Array.isArray(courses) ||
    courses.length === 0 ||
    !userId
  ) {
    return res.status(200).json({ success: false, message: "Payment Failed" })
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex")

  if (expectedSignature === razorpay_signature) {
    try {
      await enrollStudents(courses, userId)
      return res.status(200).json({ success: true, message: "Payment Verified" })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        success: false,
        message: "Payment verified but enrollment failed",
        error: error.message,
      })
    }
  }

  return res.status(200).json({ success: false, message: "Payment Failed" })
}



exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body

  const userId = req.user.id

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" })
  }

  try {
    const enrolledStudent = await User.findById(userId)

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    )
    return res.status(200).json({
      success: true,
      message: "Payment success email sent",
    })
  } catch (error) {
    console.log("error in sending mail", error)
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" })
  }
}


const enrollStudents = async (courses, userId) => {
  if (!courses || !userId) {
    throw new Error("Please Provide Course ID and User ID")
  }

  for (const courseId of courses) {
    // Find the course and enroll the student in it
    const enrolledCourse = await Course.findOneAndUpdate(
      { _id: courseId },
      { $addToSet: { studentEnrolled: userId } },
      { new: true }
    )

    if (!enrolledCourse) {
      throw new Error("Course not found")
    }

    console.log("Updated course: ", enrolledCourse)

    const courseProgressDoc = await CourseProgress.findOneAndUpdate(
      { courseID: courseId, userId: userId },
      {
        $setOnInsert: {
          courseID: courseId,
          userId: userId,
          completedVideos: [],
        },
      },
      { upsert: true, new: true }
    )

    // Find the student and add the course to their list of enrolled courses
    const enrolledStudent = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          courses: courseId,
          courseProgress: courseProgressDoc._id,
        },
      },
      { new: true }
    )

    if (!enrolledStudent) {
      throw new Error("Student not found")
    }

    console.log("Enrolled student: ", enrolledStudent)
    // Send an email notification to the enrolled student
    const emailResponse = await mailSender(
      enrolledStudent.email,
      `Successfully Enrolled into ${enrolledCourse.courseName}`,
      courseEnrollmentEmail(
        enrolledCourse.courseName,
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
      )
    )

    console.log("Email sent successfully: ", emailResponse.response)
  }
}
