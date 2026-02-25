import React, { useEffect, useState } from "react"
import { HiOutlineGlobeAlt } from "react-icons/hi"
import { BiInfoCircle } from "react-icons/bi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-hot-toast"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import "swiper/css"

import ConfirmationModal from "../components/core/HomePage/common/ConfirmationModal"
import Footer from "../components/core/HomePage/common/Footer"
import RatingStars from "../components/core/HomePage/common/RatingStars"
import CourseAccordionBar from "../components/core/Course/CourseAccordionBar"
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard"
import CourseReviewModal from "../components/core/Course/CourseReviewModal"
import { formattedDate } from "../utils/formattedDate"
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI"
import { buyCourse } from "../services/operations/studentFeaturesAPI"
import { addToCart } from "../Slices/cartSlice"
import GetAvgRating from "../utils/Avgrating"
import Error from "./Error"
import { ACCOUNT_TYPE } from "../utils/constants"

function CourseDetails() {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { loading } = useSelector((state) => state.profile)
  const { paymentLoading } = useSelector((state) => state.course)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { courseId } = useParams()

  const [response, setResponse] = useState(null)
  const [confirmationModal, setConfirmationModal] = useState(null)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)

  const refreshCourseDetails = async () => {
    try {
      const res = await fetchCourseDetails(courseId)
      setResponse(res)
    } catch (error) {
      console.log("Could not fetch Course Details")
    }
  }

  useEffect(() => {
    refreshCourseDetails()
  }, [courseId])

  const [avgReviewCount, setAvgReviewCount] = useState(0)
  useEffect(() => {
    const count = GetAvgRating(response?.data?.courseDetails.ratingAndReviews)
    setAvgReviewCount(count)
  }, [response])

  const [isActive, setIsActive] = useState([])
  const handleActive = (id) => {
    setIsActive(!isActive.includes(id) ? isActive.concat([id]) : isActive.filter((e) => e !== id))
  }

  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0)
  useEffect(() => {
    let lectures = 0
    response?.data?.courseDetails?.courseContent?.forEach((sec) => {
      lectures += sec.subSection.length || 0
    })
    setTotalNoOfLectures(lectures)
  }, [response])

  if (loading || !response) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!response.success) {
    return <Error />
  }

  const courseDetails = response?.data?.courseDetails || {}
  const {
    courseName,
    courseDescription,
    whatYouWillLearn,
    courseContent = [],
    ratingAndReviews,
    instructor = {},
    createdAt,
  } = courseDetails

  const reviews = Array.isArray(ratingAndReviews) ? ratingAndReviews : []
  const enrolledStudents = Array.isArray(courseDetails?.studentsEnrolled)
    ? courseDetails.studentsEnrolled
    : Array.isArray(courseDetails?.studentEnrolled)
      ? courseDetails.studentEnrolled
      : []

  const isCurrentUserEnrolled = Boolean(
    user?._id &&
      enrolledStudents.some((student) => {
        const studentId = typeof student === "string" ? student : student?._id
        return studentId === user._id
      })
  )

  const currentUserReview = reviews.find((item) => {
    const reviewUserId = typeof item?.user === "string" ? item.user : item?.user?._id
    return reviewUserId === user?._id
  })

  const handleBuyCourse = () => {
    if (token) {
      buyCourse(token, [courseId], user, navigate, dispatch)
      return
    }

    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to Purchase Course.",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  const handleAddToCart = () => {
    if (isCurrentUserEnrolled) {
      toast.error("You are already enrolled in this course")
      return
    }

    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor. You can't buy a course.")
      return
    }

    if (token) {
      dispatch(addToCart(courseDetails))
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

  if (paymentLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  const renderReviewCard = (review, index) => {
    const reviewer = review?.user || {}
    const rating = Number(review?.rating) || 0

    return (
      <div key={review?._id || index} className="rounded-lg border border-richblack-700 bg-richblack-800 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={
                reviewer?.image
                  ? reviewer.image
                  : `https://api.dicebear.com/5.x/initials/svg?seed=${reviewer?.firstName || "User"} ${reviewer?.lastName || ""}`
              }
              alt="Reviewer"
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-richblack-5">
                {`${reviewer?.firstName || ""} ${reviewer?.lastName || ""}`.trim() || "Learner"}
              </p>
              <p className="text-xs text-richblack-300">{review?.createdAt ? formattedDate(review.createdAt) : ""}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-yellow-50">{rating.toFixed(1)}</span>
            <RatingStars Review_Count={rating} Star_Size={16} />
          </div>
        </div>
        <p className="text-sm text-richblack-100">{review?.review || "No review provided"}</p>
      </div>
    )
  }

  return (
    <>
      <div className="w-full bg-richblack-800">
        <div className="mx-auto grid w-11/12 max-w-maxContent gap-10 py-12 text-white lg:grid-cols-[1fr_420px] lg:gap-8 lg:pb-24">
          <div className="space-y-5">
            <h1 className="text-3xl font-semibold lg:text-5xl">{courseName}</h1>
            <p className="text-lg text-richblack-200">{courseDescription}</p>

            <div className="flex flex-wrap items-center gap-2 text-lg">
              <span className="font-semibold text-yellow-50">{avgReviewCount}</span>
              <RatingStars Review_Count={avgReviewCount} Star_Size={22} />
              <span className="text-richblack-5">({reviews.length} reviews)</span>
              <span className="text-richblack-5">{enrolledStudents.length} students enrolled</span>
            </div>

            <p className="text-2xl text-richblack-5 md:text-4xl">Created By {`${instructor.firstName || ""} ${instructor.lastName || ""}`}</p>

            <div className="flex flex-wrap items-center gap-3 text-xl text-richblack-5 md:text-3xl">
              <div className="flex items-center gap-2">
                <BiInfoCircle />
                <p>Created at {formattedDate(createdAt)}</p>
              </div>
              <span>|</span>
              <div className="flex items-center gap-2">
                <HiOutlineGlobeAlt />
                <p>English</p>
              </div>
            </div>

            {isCurrentUserEnrolled && !currentUserReview && (
              <button
                className="rounded-md bg-yellow-50 px-4 py-2 text-sm font-semibold text-richblack-900"
                onClick={() => setReviewModalOpen(true)}
              >
                Write a Review
              </button>
            )}
            {!isCurrentUserEnrolled && <p className="text-sm text-richblack-300">Buy course to share your experience.</p>}
            {isCurrentUserEnrolled && currentUserReview && <p className="text-sm text-caribbeangreen-100">You have already reviewed this course.</p>}
          </div>

          <div className="mx-auto w-full max-w-[420px] lg:self-start">
            <CourseDetailsCard
              course={{
                ...courseDetails,
                studentsEnrolled: enrolledStudents,
              }}
              setConfirmationModal={setConfirmationModal}
              handleBuyCourse={handleBuyCourse}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row lg:pr-[448px]">
        <div className="w-full">
          <div className="rounded-md border border-richblack-700 bg-richblack-900 p-8">
            <h2 className="text-4xl font-semibold">What you'll learn</h2>
            <p className="mt-4 whitespace-pre-line text-2xl text-richblack-100 md:text-3xl">{whatYouWillLearn}</p>
          </div>

          <div className="mt-8 rounded-md border border-richblack-700 bg-richblack-800 p-8">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-3xl font-semibold">Course Content</h2>
              <button className="text-sm font-semibold text-yellow-50" onClick={() => setIsActive([])}>
                Collapse all sections
              </button>
            </div>

            <div className="mb-6 flex flex-wrap gap-4 text-sm text-richblack-300">
              <span>{courseContent.length} section(s)</span>
              <span>{totalNoOfLectures} lecture(s)</span>
              <span>{response.data?.totalDuration} total length</span>
            </div>

            <div className="space-y-3">
              {courseContent?.map((course, index) => (
                <CourseAccordionBar
                  course={course}
                  key={index}
                  isActive={isActive}
                  handleActive={handleActive}
                />
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-md border border-richblack-700 bg-richblack-800 p-8">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-3xl font-semibold">Ratings & Reviews</h2>
              <div className="flex items-center gap-2">
                <span className="text-yellow-50">{avgReviewCount}</span>
                <RatingStars Review_Count={avgReviewCount} Star_Size={18} />
                <span className="text-sm text-richblack-300">({reviews.length})</span>
              </div>
            </div>

            {reviews.length === 0 ? (
              <p className="text-sm text-richblack-300">No reviews yet for this course.</p>
            ) : reviews.length === 1 ? (
              renderReviewCard(reviews[0], 0)
            ) : (
              <Swiper
                slidesPerView={1}
                spaceBetween={16}
                loop={true}
                autoplay={{ delay: 2000, disableOnInteraction: false, pauseOnMouseEnter: false }}
                modules={[Autoplay]}
              >
                {reviews.map((review, index) => (
                  <SwiperSlide key={review?._id || index}>{renderReviewCard(review, index)}</SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>

          <div className="my-8 rounded-md border border-richblack-700 bg-richblack-800 p-8">
            <h2 className="text-3xl font-semibold">Author</h2>
            <div className="mt-5 flex items-center gap-4">
              <img
                src={
                  instructor.image
                    ? instructor.image
                    : `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName || "Author"} ${instructor.lastName || ""}`
                }
                alt="Author"
                className="h-14 w-14 rounded-full object-cover"
              />
              <p className="text-xl font-semibold">{`${instructor.firstName || ""} ${instructor.lastName || ""}`}</p>
            </div>
            <p className="mt-4 text-sm leading-6 text-richblack-100">
              {instructor?.additionalDetails?.about || "Instructor bio not available."}
            </p>
          </div>
        </div>
      </div>

      <Footer />

      {reviewModalOpen && (
        <CourseReviewModal
          courseId={courseId}
          token={token}
          onClose={() => setReviewModalOpen(false)}
          onReviewSubmitted={refreshCourseDetails}
        />
      )}

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}

export default CourseDetails
