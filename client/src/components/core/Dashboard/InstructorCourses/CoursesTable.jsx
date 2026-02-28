import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"
import { COURSE_STATUS } from '../../../../utils/constants';
import { deleteCourse, fetchInstructorCourses } from '../../../../services/operations/courseDetailsAPI';
import { useNavigate } from 'react-router-dom';
import { FaCheck } from "react-icons/fa"
import { FiEdit2 } from "react-icons/fi"
import { HiClock } from "react-icons/hi"
import { RiDeleteBin6Line } from "react-icons/ri"
import ConfirmationModal from '../../HomePage/common/ConfirmationModal';
import { formattedDate } from '../../../../utils/formattedDate';


export default function CoursesTable({ courses, setCourses }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState(null)
  const TRUNCATE_LENGTH = 30

  const getDisplayDuration = (duration) => {
    if (!duration) return "2hr 30min"
    const normalized = String(duration).trim().toLowerCase()
    if (
      normalized === "0m" ||
      normalized === "0min" ||
      normalized === "0h 0m" ||
      normalized === "0s"
    ) {
      return "2hr 30min"
    }
    return duration
  }

  const handleCourseDelete = async (courseId) => {
    setLoading(true)
    await deleteCourse({ courseId: courseId }, token)
    const result = await fetchInstructorCourses(token)
    if (result) {
      setCourses(result)
    }
    setConfirmationModal(null)
    setLoading(false)
  }

  const handleTiltMove = (event) => {
    const card = event.currentTarget
    const frame = card.querySelector(".course-media-frame")
    if (!frame) return

    const rect = card.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height

    const rotateY = (px - 0.5) * 8
    const rotateX = (0.5 - py) * 6

    frame.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`
    card.style.setProperty("--shine-x", `${px * 100}%`)
    card.style.setProperty("--shine-y", `${py * 100}%`)
  }

  const handleTiltLeave = (event) => {
    const card = event.currentTarget
    const frame = card.querySelector(".course-media-frame")
    if (!frame) return
    frame.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)"
    card.style.setProperty("--shine-x", `50%`)
    card.style.setProperty("--shine-y", `50%`)
  }

  return (
    <>
      <div className="w-full overflow-x-auto rounded-2xl border border-richblack-700/60 bg-richblack-800/20 p-2 shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
        <Table className="courses-table w-full min-w-[300px] rounded-xl border border-richblack-800/80">
          <Thead>
            <Tr className="hidden gap-x-10 rounded-t-md border-b border-b-richblack-700 bg-richblack-900/70 px-6 py-3 md:flex">
              <Th className="flex-1 text-left text-sm font-medium uppercase text-richblack-100">
                Courses
              </Th>
              <Th className="text-left text-sm font-medium uppercase text-richblack-100">
                Duration
              </Th>
              <Th className="text-left text-sm font-medium uppercase text-richblack-100">
                Price
              </Th>
              <Th className="text-left text-sm font-medium uppercase text-richblack-100">
                Actions
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {courses?.length === 0 ? (
              <Tr>
                <Td className="py-10 text-center text-2xl font-medium text-richblack-100">
                  No courses found
                </Td>
              </Tr>
            ) : (
              courses?.map((course, index) => (
                <Tr
                  key={course._id}
                  className="course-row-3d course-reveal relative flex flex-col gap-5 border-b border-richblack-700/70 px-3 py-5 sm:px-4 md:flex-row md:gap-x-8 md:px-6 md:py-7 lg:items-center"
                  style={{ "--row-index": index }}
                  onMouseMove={handleTiltMove}
                  onMouseLeave={handleTiltLeave}
                >
                  <Td className="flex flex-1 flex-col gap-4 sm:gap-5 md:flex-row">
                    <div className="course-media-frame relative mx-auto aspect-[16/9] w-full sm:mx-0 sm:w-[280px] md:w-[320px] lg:w-[360px]">
                      <div className="course-media-shine pointer-events-none absolute inset-0 z-10" />
                      <img
                        src={course?.thumbnail}
                        alt={course?.courseName}
                        className="h-full w-full rounded-xl object-contain p-2"
                      />
                    </div>
                    <div className="flex flex-col justify-between gap-2 pt-1">
                      <p className="text-base font-semibold text-richblack-5 drop-shadow-[0_1px_0_rgba(255,255,255,0.04)] sm:text-lg">
                        {course.courseName}
                      </p>
                      <p className="text-xs leading-5 text-richblack-300">
                        {course.courseDescription.split(" ").length >
                        TRUNCATE_LENGTH
                          ? course.courseDescription
                              .split(" ")
                              .slice(0, TRUNCATE_LENGTH)
                              .join(" ") + "..."
                          : course.courseDescription}
                      </p>
                      <p className="text-[12px] text-richblack-25">
                        Created: {formattedDate(course.createdAt)}
                      </p>
                      {course.status === COURSE_STATUS.DRAFT ? (
                        <p className="flex w-fit flex-row items-center gap-2 rounded-full border border-richblack-500 bg-richblack-700/80 px-2 py-[2px] text-[12px] font-medium text-pink-100">
                          <HiClock size={14} />
                          Drafted
                        </p>
                      ) : (
                        <p className="flex w-fit flex-row items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-2 py-[2px] text-[12px] font-medium text-yellow-100">
                          <div className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-100 text-richblack-700">
                            <FaCheck size={8} />
                          </div>
                          Published
                        </p>
                      )}
                    </div>
                  </Td>
                  <Td className="text-sm font-medium text-richblack-100 md:min-w-[120px]">
                    <span className="mb-1 block text-xs uppercase text-richblack-300 md:hidden">Duration</span>
                    {getDisplayDuration(course?.totalDuration)}
                  </Td>
                  <Td className="text-sm font-medium text-richblack-100 md:min-w-[110px]">
                    <span className="mb-1 block text-xs uppercase text-richblack-300 md:hidden">Price</span>
                    Rs. {course.price}
                  </Td>
                  <Td className="text-sm font-medium text-richblack-100 md:min-w-[120px]">
                    <span className="mb-1 block text-xs uppercase text-richblack-300 md:hidden">Actions</span>
                    <div className="flex items-center gap-2">
                    <button
                      disabled={loading}
                      onClick={() => {
                        navigate(`/dashboard/edit-course/${course._id}`)
                      }}
                      title="Edit"
                      className="rounded-lg border border-richblack-600/80 bg-richblack-700/70 px-2 py-1 transition-all duration-200 hover:-translate-y-[1px] hover:scale-105 hover:border-caribbeangreen-400/40 hover:text-caribbeangreen-300"
                    >
                      <FiEdit2 size={20} />
                    </button>
                    <button
                      disabled={loading}
                      onClick={() => {
                        setConfirmationModal({
                          text1: "Do you want to delete this course?",
                          text2:
                            "All the data related to this course will be deleted",
                          btn1Text: !loading ? "Delete" : "Loading...  ",
                          btn2Text: "Cancel",
                          btn1Handler: !loading
                            ? () => handleCourseDelete(course._id)
                            : () => {},
                          btn2Handler: !loading
                            ? () => setConfirmationModal(null)
                            : () => {},
                        })
                      }}
                      title="Delete"
                      className="rounded-lg border border-richblack-600/80 bg-richblack-700/70 px-2 py-1 transition-all duration-200 hover:-translate-y-[1px] hover:scale-105 hover:border-pink-300/40 hover:text-[#ff5555]"
                    >
                      <RiDeleteBin6Line size={20} />
                    </button>
                    </div>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}
