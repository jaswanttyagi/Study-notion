import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { FiCheckCircle } from "react-icons/fi"

import IconBtn from "../../../core/HomePage/common/Iconbtn"
import { buyCourse } from "../../../../services/operations/studentFeaturesAPI"

export default function RenderTotalAmount({ selectedCourses, selectedTotal }) {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleBuyCourse = () => {
    const courses = selectedCourses.map((course) => course._id)
    if (!courses.length) {
      return
    }
    buyCourse(token, courses, user, navigate, dispatch)
  }

  return (
    <div className="w-full rounded-2xl border border-richblack-700 bg-richblack-800 p-5 sm:p-6 lg:sticky lg:top-20">
      <p className="text-lg font-semibold text-richblack-5">Price Summary</p>

      <div className="mt-5 space-y-3 text-sm">
        <div className="flex items-center justify-between text-richblack-300">
          <span>Selected Courses</span>
          <span className="font-semibold text-richblack-50">{selectedCourses.length}</span>
        </div>

        <div className="flex items-center justify-between text-richblack-300">
          <span>Total Amount</span>
          <span className="text-2xl font-semibold text-yellow-100">Rs. {selectedTotal}</span>
        </div>
      </div>

      <div className="my-5 h-px w-full bg-richblack-700" />

      <div className="mb-5 space-y-2">
        <p className="text-xs uppercase tracking-wide text-richblack-300">Selected courses</p>
        <div className="max-h-[180px] space-y-2 overflow-y-auto pr-1">
          {selectedCourses.length ? (
            selectedCourses.map((course) => (
              <div key={course._id} className="flex items-start gap-2 text-sm text-richblack-100">
                <FiCheckCircle className="mt-0.5 shrink-0 text-caribbeangreen-200" />
                <span className="line-clamp-2">{course.courseName}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-richblack-400">No course selected.</p>
          )}
        </div>
      </div>

      <IconBtn
        text={selectedCourses.length ? "Buy Selected Courses" : "Select Courses to Buy"}
        onClick={handleBuyCourse}
        disabled={!selectedCourses.length}
        customClasses="w-full justify-center disabled:opacity-60"
      />
    </div>
  )
}
