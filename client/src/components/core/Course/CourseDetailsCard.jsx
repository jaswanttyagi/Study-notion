import React from "react"
import { toast } from "react-hot-toast"
import { BsFillCaretRightFill } from "react-icons/bs"
import { FaShareSquare } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { addToCart } from "../../../Slices/cartSlice"
import { ACCOUNT_TYPE } from "../../../utils/constants"

function CourseDetailsCard({ course, setConfirmationModal, handleBuyCourse }) {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { thumbnail: ThumbnailImage, price: CurrentPrice } = course

  const enrolledStudents = Array.isArray(course?.studentsEnrolled)
    ? course.studentsEnrolled
    : Array.isArray(course?.studentEnrolled)
      ? course.studentEnrolled
      : []

  const isStudentEnrolled = Boolean(
    user?._id &&
      enrolledStudents.some((student) => {
        const studentId = typeof student === "string" ? student : student?._id
        return studentId === user._id
      })
  )

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard")
    } catch (error) {
      toast.error("Could not copy link")
    }
  }

  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor. You can't buy a course.")
      return
    }

    if (token) {
      dispatch(addToCart(course))
      return
    }

    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to add To Cart",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  return (
    <div className="rounded-lg bg-richblack-700 p-5 text-richblack-5 shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
      <img
        src={ThumbnailImage}
        alt={course?.courseName}
        className="h-[220px] w-full rounded-xl object-cover"
      />

      <p className="mt-4 text-5xl font-semibold text-richblack-5">Rs. {CurrentPrice}</p>

      <div className="mt-5 flex flex-col gap-3">
        <button
          className="w-full rounded-lg bg-yellow-50 py-3 text-2xl font-semibold text-richblack-900"
          onClick={isStudentEnrolled ? () => navigate("/dashboard/enrolled-courses") : handleBuyCourse}
        >
          {isStudentEnrolled ? "Go To Course" : "Buy Now"}
        </button>

        {!isStudentEnrolled && (
          <button
            className="w-full rounded-lg bg-richblack-800 py-3 text-2xl font-semibold text-richblack-5"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        )}
      </div>

      <p className="mt-6 text-center text-xl text-richblack-25">30-Day Money-Back Guarantee</p>

      <div className="mt-6">
        <p className="mb-3 text-5xl font-semibold">This Course Includes :</p>
        <div className="space-y-2">
          {course?.instructions?.map((item, index) => (
            <p className="flex items-start gap-2 text-3xl text-caribbeangreen-100" key={index}>
              <BsFillCaretRightFill className="mt-1 shrink-0" />
              <span>{item}</span>
            </p>
          ))}
        </div>
      </div>

      <button className="mx-auto mt-5 flex items-center gap-2 text-4xl text-yellow-100" onClick={handleShare}>
        <FaShareSquare size={22} />
        <span>Share</span>
      </button>
    </div>
  )
}

export default CourseDetailsCard
