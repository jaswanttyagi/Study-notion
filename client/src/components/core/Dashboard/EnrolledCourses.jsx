import { useEffect, useMemo, useState } from "react"
import ProgressBar from "@ramonak/react-progress-bar"
import { FiBookOpen, FiClock, FiPlayCircle, FiTrendingUp } from "react-icons/fi"
import { useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"

import { getUserEnrolledCourses } from "../../../services/operations/profileApI"

export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const location = useLocation()

  const [enrolledCourses, setEnrolledCourses] = useState(null)

  const openCoursePlayer = (course) => {
    const firstSectionId = course?.courseContent?.[0]?._id
    const firstSubSectionId = course?.courseContent?.[0]?.subSection?.[0]?._id

    if (firstSectionId && firstSubSectionId) {
      navigate(`/view-course/${course?._id}/section/${firstSectionId}/sub-section/${firstSubSectionId}`)
      return
    }

    navigate(`/course/${course?._id}`)
  }

  const getEnrolledCourses = async () => {
    try {
      const res = await getUserEnrolledCourses(token)
      setEnrolledCourses(res)
    } catch (error) {
      console.log("Could not fetch enrolled courses.", error)
    }
  }

  useEffect(() => {
    getEnrolledCourses()
  }, [token, location.pathname, location.search, location.key])

  const totalCourses = enrolledCourses?.length || 0
  const avgProgress = useMemo(() => {
    if (!Array.isArray(enrolledCourses) || enrolledCourses.length === 0) return 0
    const total = enrolledCourses.reduce((sum, course) => sum + (Number(course?.progressPercentage) || 0), 0)
    return Math.round(total / enrolledCourses.length)
  }, [enrolledCourses])

  return (
    <div className="relative mx-auto w-full max-w-[1120px] space-y-6 text-richblack-5">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-3xl">
        <div className="absolute left-0 top-10 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-cyan-300/30 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.18),transparent_55%),linear-gradient(145deg,#0b1220,#111827,#0f172a)] p-6 shadow-[0_24px_70px_-45px_rgba(34,211,238,0.75)] sm:p-8">
        <div className="absolute -right-20 -top-16 h-56 w-56 rounded-full border border-cyan-300/20" />

        <div className="relative">
          <h1 className="text-2xl font-bold sm:text-3xl">Enrolled Courses</h1>
          <p className="mt-2 text-sm text-richblack-200">Track progress and jump straight into your learning modules.</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-cyan-200/30 bg-richblack-900/70 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-widest text-richblack-300">Total Courses</p>
              <p className="mt-1 text-2xl font-semibold text-yellow-50">{totalCourses}</p>
            </div>
            <div className="rounded-xl border border-cyan-200/30 bg-richblack-900/70 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-widest text-richblack-300">Average Progress</p>
              <p className="mt-1 text-2xl font-semibold text-yellow-50">{avgProgress}%</p>
            </div>
            <div className="rounded-xl border border-cyan-200/30 bg-richblack-900/70 p-4 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
              <p className="text-xs uppercase tracking-widest text-richblack-300">Learning Mode</p>
              <p className="mt-1 text-lg font-semibold text-cyan-100">Focus + Consistency</p>
            </div>
          </div>
        </div>
      </div>

      {!enrolledCourses ? (
        <div className="grid min-h-[260px] place-items-center rounded-2xl border border-richblack-700 bg-richblack-800">
          <div className="spinner"></div>
        </div>
      ) : !enrolledCourses.length ? (
        <div className="grid min-h-[260px] place-items-center rounded-2xl border border-dashed border-richblack-700 bg-richblack-800 p-6 text-center">
          <div>
            <h2 className="text-2xl font-semibold">No enrolled courses yet</h2>
            <p className="mt-2 text-richblack-300">Once you enroll, your courses and progress will appear here.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {enrolledCourses.map((course) => {
            const progress = Number(course?.progressPercentage) || 0
            const courseDescription = course?.courseDescription || "No description available"

            return (
              <div
                key={course?._id}
                className="group rounded-2xl border border-cyan-300/20 bg-[linear-gradient(165deg,rgba(15,23,42,0.95),rgba(17,24,39,0.92))] p-[1px] shadow-[0_20px_60px_-45px_rgba(34,211,238,0.8)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_-45px_rgba(34,211,238,1)]"
              >
                <div className="h-full rounded-2xl border border-richblack-700/80 bg-richblack-900/95 p-4 sm:p-5">
                  <div className="relative mb-4 overflow-hidden rounded-lg">
                    <img
                      src={course?.thumbnail}
                      alt="course_img"
                      className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs text-richblack-50">
                      <FiBookOpen /> Course
                    </div>
                  </div>

                  <h3 className="line-clamp-1 text-lg font-semibold">{course?.courseName}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-richblack-300">{courseDescription}</p>

                  <div className="mt-4 space-y-2 text-sm text-richblack-200">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-2"><FiClock /> Duration</span>
                      <span className="font-medium text-richblack-50">{course?.totalDuration || "N/A"}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-2"><FiTrendingUp /> Progress</span>
                      <span className="font-semibold text-yellow-50">{progress}%</span>
                    </div>
                    <ProgressBar
                      completed={progress}
                      height="8px"
                      isLabelVisible={false}
                      bgColor="#22d3ee"
                      baseBgColor="#2C333F"
                      borderRadius="999px"
                    />
                  </div>

                  <button
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-yellow-50 px-4 py-2 font-semibold text-richblack-900 transition-all hover:brightness-95"
                    onClick={() => openCoursePlayer(course)}
                  >
                    <FiPlayCircle /> Continue Learning
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
