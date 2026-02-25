import React, { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { toast } from "react-hot-toast"
import { FiChevronLeft, FiPlayCircle } from "react-icons/fi"

import { getFullDetailsOfCourse, markLectureAsComplete } from "../services/operations/courseDetailsAPI"
import IconBtn from "../components/core/HomePage/common/Iconbtn"

function ViewCourse() {
  const { courseId, sectionId, subSectionId } = useParams()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)

  const [loading, setLoading] = useState(true)
  const [courseData, setCourseData] = useState(null)
  const [completedVideos, setCompletedVideos] = useState([])
  const [markingComplete, setMarkingComplete] = useState(false)
  const [completionChecked, setCompletionChecked] = useState(false)
  const [videoEnded, setVideoEnded] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true)
        const result = await getFullDetailsOfCourse(courseId, token)
        if (!result?.courseDetails) {
          throw new Error("Could not load course")
        }
        setCourseData(result.courseDetails)
        setCompletedVideos(Array.isArray(result.completedVideos) ? result.completedVideos : [])
      } catch (error) {
        console.log("VIEW COURSE LOAD ERROR", error)
        toast.error("Could not load course content")
      } finally {
        setLoading(false)
      }
    }

    if (courseId && token) {
      fetchCourse()
    }
  }, [courseId, token])

  const sections = useMemo(
    () => (Array.isArray(courseData?.courseContent) ? courseData.courseContent : []),
    [courseData]
  )

  const currentSection =
    sections.find((section) => section?._id === sectionId) || sections[0] || null

  const currentSubSection =
    (Array.isArray(currentSection?.subSection)
      ? currentSection.subSection.find((item) => item?._id === subSectionId)
      : null) ||
    (Array.isArray(currentSection?.subSection) ? currentSection.subSection[0] : null) ||
    null

  useEffect(() => {
    if (!courseId || !sections.length) return
    if (!currentSection?._id || !currentSubSection?._id) return
    if (sectionId === currentSection._id && subSectionId === currentSubSection._id) return

    navigate(
      `/view-course/${courseId}/section/${currentSection._id}/sub-section/${currentSubSection._id}`,
      { replace: true }
    )
  }, [courseId, currentSection, currentSubSection, navigate, sectionId, subSectionId, sections.length])

  const isCompleted = completedVideos.includes(currentSubSection?._id)

  useEffect(() => {
    setCompletionChecked(isCompleted)
  }, [currentSubSection?._id, isCompleted])

  const onLectureClick = (targetSectionId, targetSubSectionId) => {
    setVideoEnded(false)
    navigate(`/view-course/${courseId}/section/${targetSectionId}/sub-section/${targetSubSectionId}`)
  }

  const onMarkComplete = async () => {
    if (!currentSubSection?._id || markingComplete) return
    setMarkingComplete(true)
    try {
      const success = await markLectureAsComplete(
        { courseId, subsectionId: currentSubSection._id },
        token
      )
      if (success) {
        setCompletedVideos((prev) =>
          prev.includes(currentSubSection._id) ? prev : [...prev, currentSubSection._id]
        )
      }
    } finally {
      setMarkingComplete(false)
    }
  }

  const totalLectures = useMemo(
    () => sections.reduce((sum, sec) => sum + (Array.isArray(sec?.subSection) ? sec.subSection.length : 0), 0),
    [sections]
  )

  const flattenedLectures = useMemo(() => {
    return sections.flatMap((section) =>
      (Array.isArray(section?.subSection) ? section.subSection : []).map((lecture) => ({
        sectionId: section?._id,
        subSectionId: lecture?._id,
        title: lecture?.title || "Lecture",
      }))
    )
  }, [sections])

  const currentLectureIndex = useMemo(
    () => flattenedLectures.findIndex((item) => item.subSectionId === currentSubSection?._id),
    [flattenedLectures, currentSubSection?._id]
  )

  const nextLecture =
    currentLectureIndex >= 0 ? flattenedLectures[currentLectureIndex + 1] || null : null

  useEffect(() => {
    setVideoEnded(false)
  }, [currentSubSection?._id])

  const onRewatch = () => {
    if (!videoRef.current) return
    videoRef.current.currentTime = 0
    videoRef.current.play()
    setVideoEnded(false)
  }

  const onPlayNext = () => {
    if (!nextLecture) return
    setVideoEnded(false)
    navigate(`/view-course/${courseId}/section/${nextLecture.sectionId}/sub-section/${nextLecture.subSectionId}`)
  }

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!courseData) {
    return (
      <div className="mx-auto w-11/12 max-w-maxContent py-8 text-richblack-5">
        Could not load course.
      </div>
    )
  }

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden bg-richblack-900 text-white">
      <div className="pointer-events-none absolute -left-12 top-10 h-40 w-40 rounded-full bg-blue-200/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-28 h-52 w-52 rounded-full bg-yellow-50/10 blur-3xl" />

      <div className="relative grid lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="border-b border-richblack-700 bg-gradient-to-b from-richblack-800 to-richblack-900 lg:min-h-[calc(100vh-3.5rem)] lg:border-b-0 lg:border-r">
          <div className="border-b border-richblack-700/80 p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-2">
              <button
                onClick={() => navigate("/dashboard/enrolled-courses")}
                className="inline-flex items-center gap-2 rounded-md border border-richblack-600 bg-richblack-700 px-3 py-2 text-sm text-richblack-50 transition hover:bg-richblack-600"
              >
                <FiChevronLeft />
                Back
              </button>
              <button
                onClick={() => navigate(`/course/${courseId}`)}
                className="rounded-md bg-yellow-50 px-4 py-2 text-sm font-semibold text-richblack-900 transition hover:brightness-95"
              >
                Add Review
              </button>
            </div>

            <h2 className="line-clamp-2 text-lg font-semibold leading-snug">{courseData?.courseName}</h2>
            <p className="mt-1 text-xs text-richblack-300">
              {completedVideos.length}/{totalLectures} lectures completed
            </p>
          </div>

          <div className="max-h-[60vh] overflow-y-auto lg:max-h-[calc(100vh-11rem)]">
            {sections.map((section) => (
              <details key={section?._id} open className="border-b border-richblack-700/80">
                <summary className="cursor-pointer bg-richblack-700/80 px-4 py-3 text-sm font-semibold text-richblack-50">
                  {section?.sectionName}
                </summary>

                <div className="bg-richblack-800/90">
                  {(Array.isArray(section?.subSection) ? section.subSection : []).map((item) => {
                    const active = item?._id === currentSubSection?._id
                    const completed = completedVideos.includes(item?._id)

                    return (
                      <button
                        key={item?._id}
                        onClick={() => onLectureClick(section._id, item._id)}
                        className={`flex w-full items-center gap-2 border-b border-richblack-700/80 px-4 py-3 text-left text-sm transition ${
                          active
                            ? "bg-gradient-to-r from-yellow-50 to-yellow-100 text-richblack-900"
                            : "bg-richblack-800 text-richblack-100 hover:bg-richblack-700/80"
                        }`}
                      >
                        <FiPlayCircle className="shrink-0" />
                        <span className="line-clamp-1">{item?.title}</span>
                        {completed && (
                          <span className="ml-auto rounded-full bg-caribbeangreen-800 px-2 py-0.5 text-[10px] font-semibold text-caribbeangreen-100">
                            Done
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </details>
            ))}
          </div>
        </aside>

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mb-4 rounded-xl border border-richblack-700 bg-richblack-800/70 p-4 shadow-[0_10px_28px_rgba(0,0,0,0.28)] backdrop-blur-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-richblack-300">Now Playing</p>
                <h1 className="text-xl font-semibold sm:text-2xl">{currentSubSection?.title || "Lecture"}</h1>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-2 rounded-md border border-richblack-600 bg-richblack-800 px-3 py-2 text-sm text-richblack-100">
                  <input
                    type="checkbox"
                    checked={completionChecked}
                    disabled={isCompleted || markingComplete}
                    onChange={(e) => setCompletionChecked(e.target.checked)}
                  />
                  Mark completed
                </label>
                <IconBtn
                  text={isCompleted ? "Completed" : markingComplete ? "Saving..." : "Update Progress"}
                  onClick={onMarkComplete}
                  disabled={isCompleted || !completionChecked || markingComplete}
                  customClasses="disabled:opacity-60"
                />
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-richblack-700 bg-black shadow-[0_20px_45px_rgba(0,0,0,0.45)]">
            {currentSubSection?.videoUrl ? (
              <>
                <video
                  key={currentSubSection._id}
                  ref={videoRef}
                  controls
                  className="aspect-video w-full"
                  src={currentSubSection.videoUrl}
                  onEnded={() => setVideoEnded(true)}
                />

                {videoEnded && (
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-richblack-900/90 via-richblack-900/40 to-transparent p-4 sm:p-6">
                    <div className="w-full rounded-xl border border-richblack-600 bg-richblack-800/90 p-4 backdrop-blur-sm">
                      <p className="text-sm font-semibold text-richblack-5">Video completed</p>
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <button
                          onClick={onRewatch}
                          className="rounded-md border border-richblack-500 bg-richblack-700 px-4 py-2 text-sm font-semibold text-richblack-50 hover:bg-richblack-600"
                        >
                          Rewatch
                        </button>
                        {nextLecture ? (
                          <>
                            <div className="text-sm text-richblack-200">
                              Up next: <span className="font-semibold text-yellow-50">{nextLecture.title}</span>
                            </div>
                            <button
                              onClick={onPlayNext}
                              className="rounded-md bg-yellow-50 px-4 py-2 text-sm font-semibold text-richblack-900 hover:brightness-95"
                            >
                              Play Next
                            </button>
                          </>
                        ) : (
                          <div className="text-sm text-richblack-300">You have reached the last lecture.</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="grid aspect-video w-full place-items-center text-richblack-300">
                Video not available for this lecture.
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <IconBtn text="Back to Enrolled" onClick={() => navigate("/dashboard/enrolled-courses")} outline={true} />
            <IconBtn text="Back to Course" onClick={() => navigate(`/course/${courseId}`)} outline={true} />
          </div>
        </main>
      </div>
    </div>
  )
}

export default ViewCourse
