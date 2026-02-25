import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

import {
  resetCourseState,
  setCourse,
  setEditCourse,
  setStep,
} from "../../../../Slices/courseSlice"
import { deleteCourse } from "../../../../services/operations/courseDetailsAPI"
import RenderSteps from "./RenderSteps"

export default function AddCourse() {
  const dispatch = useDispatch()
  const { course } = useSelector((state) => state.course)
  const { token } = useSelector((state) => state.auth)

  useEffect(() => {
    const savedDraftCourse = localStorage.getItem("draftCourse")
    if (!savedDraftCourse) {
      dispatch(resetCourseState())
      return
    }

    try {
      const parsedDraft = JSON.parse(savedDraftCourse)
      if (!parsedDraft?._id) {
        localStorage.removeItem("draftCourse")
        dispatch(resetCourseState())
        return
      }
      if (parsedDraft?.status === "Published") {
        localStorage.removeItem("draftCourse")
        dispatch(resetCourseState())
        return
      }

      const shouldResumeDraft = window.confirm(
        "You have an unfinished draft course. Do you want to continue editing it?"
      )

      if (shouldResumeDraft) {
        dispatch(setCourse(parsedDraft))
        dispatch(setEditCourse(true))
        dispatch(setStep(2))
        return
      }

      // User chose fresh start -> remove stale draft from DB and local storage
      if (token) {
        deleteCourse({ courseId: parsedDraft._id }, token)
      }
      localStorage.removeItem("draftCourse")
      dispatch(resetCourseState())
    } catch {
      localStorage.removeItem("draftCourse")
      dispatch(resetCourseState())
    }
  }, [dispatch, token])

  useEffect(() => {
    const cleanupDraftOnCrash = async () => {
      if (!course?._id || course?.status === "Published" || !token) return

      await deleteCourse({ courseId: course._id }, token)
      localStorage.removeItem("draftCourse")
      dispatch(resetCourseState())
    }

    const handleRuntimeError = () => {
      cleanupDraftOnCrash()
    }

    window.addEventListener("error", handleRuntimeError)
    window.addEventListener("unhandledrejection", handleRuntimeError)

    return () => {
      window.removeEventListener("error", handleRuntimeError)
      window.removeEventListener("unhandledrejection", handleRuntimeError)
    }
  }, [course, dispatch, token])

  return (
    <>
      <div className="flex w-full items-start gap-x-6">
        <div className="flex flex-1 flex-col">
          <h1 className="mb-14 text-3xl font-medium text-richblack-5">
            Add Course
          </h1>
          <div className="flex-1">
            <RenderSteps />
          </div>
        </div>
        {/* Course Upload Tips */}
        <div className="sticky top-10 hidden max-w-[400px] flex-1 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 xl:block">
          <p className="mb-8 text-lg text-richblack-5">⚡ Course Upload Tips</p>
          <ul className="ml-5 list-item list-disc space-y-4 text-xs text-richblack-5">
            <li>Set the Course Price option or make it free.</li>
            <li>Standard size for the course thumbnail is 1024x576.</li>
            <li>Video section controls the course overview video.</li>
            <li>Course Builder is where you create & organize a course.</li>
            <li>
              Add Topics in the Course Builder section to create lessons,
              quizzes, and assignments.
            </li>
            <li>
              Information from the Additional Data section shows up on the
              course single page.
            </li>
            <li>Make Announcements to notify any important</li>
            <li>Notes to all enrolled students at once.</li>
          </ul>
        </div>
      </div>
    </>
  )
}
