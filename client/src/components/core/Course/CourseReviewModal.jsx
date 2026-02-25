import React, { useState } from "react"
import { RxCross2 } from "react-icons/rx"
import { FaStar } from "react-icons/fa"
import { toast } from "react-hot-toast"

import Iconbtn from "../HomePage/common/Iconbtn"
import { createRating } from "../../../services/operations/courseDetailsAPI"

function CourseReviewModal({ courseId, token, onClose, onReviewSubmitted }) {
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const submitReview = async () => {
    if (!rating) {
      toast.error("Please select a rating")
      return
    }

    if (!review.trim()) {
      toast.error("Please write a review")
      return
    }

    setSubmitting(true)
    const result = await createRating(
      {
        courseId,
        rating,
        review: review.trim(),
      },
      token
    )
    setSubmitting(false)

    if (result?.success) {
      onReviewSubmitted?.()
      onClose?.()
      return
    }

    const message = (result?.message || "").toLowerCase()
    if (result?.status === 403 && message.includes("already")) {
      // Keep UI in sync when backend says review already exists.
      onReviewSubmitted?.()
      onClose?.()
    }
  }

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-black/40 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[500px] rounded-lg border border-richblack-400 bg-richblack-800">
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">Add Your Review</p>
          <button onClick={() => (!submitting ? onClose?.() : {})}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>

        <div className="space-y-6 px-6 py-8">
          <div>
            <p className="mb-2 text-sm text-richblack-100">Your Rating</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => setRating(value)}
                  className="text-2xl"
                  disabled={submitting}
                >
                  <FaStar className={value <= rating ? "text-yellow-100" : "text-richblack-500"} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-richblack-100" htmlFor="reviewText">
              Your Review
            </label>
            <textarea
              id="reviewText"
              rows={5}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="form-style w-full resize-none"
              placeholder="Write what you liked about this course"
              disabled={submitting}
            />
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={submitting}
              className="cursor-pointer rounded-md bg-richblack-200 py-[8px] px-[20px] font-semibold text-richblack-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <Iconbtn
              text={submitting ? "Submitting..." : "Submit Review"}
              onClick={submitReview}
              disabled={submitting}
              customClasses="disabled:opacity-60"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseReviewModal
