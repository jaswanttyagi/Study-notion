import { FaStar } from "react-icons/fa"
import { RiDeleteBin6Line } from "react-icons/ri"
import { useDispatch, useSelector } from "react-redux"
import { IoCheckmarkCircle } from "react-icons/io5"

import { removeFromCart } from "../../../../Slices/cartSlice"

export default function RenderCartCourses({
  selectedCourseIds,
  onToggleSelection,
  onSelectAll,
  onDeselectAll,
}) {
  const { cart } = useSelector((state) => state.cart)
  const dispatch = useDispatch()

  const getAverageRating = (reviews = []) => {
    if (!Array.isArray(reviews) || reviews.length === 0) return 0
    const total = reviews.reduce((sum, review) => sum + (review?.rating || 0), 0)
    return total / reviews.length
  }

  return (
    <div className="rounded-2xl border border-richblack-700 bg-richblack-800 p-4 sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-richblack-700 pb-4">
        <div>
          <p className="text-lg font-semibold">Courses</p>
          <p className="text-xs text-richblack-300">Select the courses you want to purchase now.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onSelectAll}
            className="rounded-md border border-richblack-600 px-3 py-1.5 text-sm text-richblack-50 transition-all hover:border-yellow-100 hover:text-yellow-50"
          >
            Select All
          </button>
          <button
            onClick={onDeselectAll}
            className="rounded-md border border-richblack-600 px-3 py-1.5 text-sm text-richblack-50 transition-all hover:border-yellow-100 hover:text-yellow-50"
          >
            Deselect All
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {cart.map((course) => {
          const isSelected = selectedCourseIds.includes(course._id)
          const avgRating = getAverageRating(course?.ratingAndReviews)
          const rounded = Math.round(avgRating)

          return (
            <div
              key={course._id}
              className={`rounded-xl border p-3 transition-all sm:p-4 ${
                isSelected
                  ? "border-yellow-100 bg-richblack-900"
                  : "border-richblack-700 bg-richblack-900/50 hover:border-richblack-500"
              }`}
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-yellow-50"
                    checked={isSelected}
                    onChange={() => onToggleSelection(course._id)}
                  />
                  <span className="text-richblack-50">Select</span>
                </label>

                {isSelected && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50/15 px-2 py-1 text-xs font-medium text-yellow-50">
                    <IoCheckmarkCircle /> Selected
                  </span>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)_auto] md:items-start">
                <img
                  src={course?.thumbnail}
                  alt={course?.courseName}
                  className="h-[148px] w-full rounded-lg object-cover md:w-[220px]"
                />

                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold text-richblack-5">{course?.courseName}</p>
                  <p className="mt-1 text-sm text-richblack-300">{course?.category?.name || "General"}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-semibold text-yellow-50">{avgRating.toFixed(1)}</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar
                          key={i}
                          className={i < rounded ? "text-yellow-50" : "text-richblack-500"}
                        />
                      ))}
                    </div>
                    <span className="text-richblack-400">{course?.ratingAndReviews?.length || 0} Ratings</span>
                  </div>
                </div>

                <div className="flex flex-row items-center justify-between gap-3 md:flex-col md:items-end">
                  <button
                    onClick={() => dispatch(removeFromCart(course._id))}
                    className="inline-flex items-center gap-1 rounded-md border border-richblack-600 bg-richblack-700 px-3 py-2 text-sm text-pink-200 transition-all hover:border-pink-200"
                  >
                    <RiDeleteBin6Line />
                    Remove
                  </button>
                  <p className="text-2xl font-semibold text-yellow-100">Rs. {course?.price}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
