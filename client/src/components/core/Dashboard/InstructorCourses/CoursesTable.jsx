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

  return (
    <>
      <div className="w-full overflow-x-auto">
        <Table className="courses-table w-full min-w-[300px] rounded-xl border border-richblack-800">
          <Thead>
            <Tr className="hidden gap-x-10 rounded-t-md border-b border-b-richblack-800 px-6 py-2 md:flex">
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
              courses?.map((course) => (
                <Tr
                  key={course._id}
                  className="flex flex-col gap-4 border-b border-richblack-800 px-4 py-6 md:flex-row md:gap-x-10 md:px-6 md:py-8"
                >
                  <Td className="flex flex-1 flex-col gap-4 sm:flex-row sm:gap-x-4">
                    <img
                      src={course?.thumbnail}
                      alt={course?.courseName}
                      className="h-[180px] w-full rounded-lg object-cover sm:h-[148px] sm:w-[220px]"
                    />
                    <div className="flex flex-col justify-between gap-2">
                      <p className="text-lg font-semibold text-richblack-5">
                        {course.courseName}
                      </p>
                      <p className="text-xs text-richblack-300">
                        {course.courseDescription.split(" ").length >
                        TRUNCATE_LENGTH
                          ? course.courseDescription
                              .split(" ")
                              .slice(0, TRUNCATE_LENGTH)
                              .join(" ") + "..."
                          : course.courseDescription}
                      </p>
                      <p className="text-[12px] text-white">
                        Created: {formattedDate(course.createdAt)}
                      </p>
                      {course.status === COURSE_STATUS.DRAFT ? (
                        <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-pink-100">
                          <HiClock size={14} />
                          Drafted
                        </p>
                      ) : (
                        <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-yellow-100">
                          <div className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-100 text-richblack-700">
                            <FaCheck size={8} />
                          </div>
                          Published
                        </p>
                      )}
                    </div>
                  </Td>
                  <Td className="text-sm font-medium text-richblack-100">
                    <span className="mb-1 block text-xs uppercase text-richblack-300 md:hidden">Duration</span>
                    {getDisplayDuration(course?.totalDuration)}
                  </Td>
                  <Td className="text-sm font-medium text-richblack-100">
                    <span className="mb-1 block text-xs uppercase text-richblack-300 md:hidden">Price</span>
                    Rs. {course.price}
                  </Td>
                  <Td className="text-sm font-medium text-richblack-100">
                    <span className="mb-1 block text-xs uppercase text-richblack-300 md:hidden">Actions</span>
                    <button
                      disabled={loading}
                      onClick={() => {
                        navigate(`/dashboard/edit-course/${course._id}`)
                      }}
                      title="Edit"
                      className="px-2 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300"
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
                      className="px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]"
                    >
                      <RiDeleteBin6Line size={20} />
                    </button>
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
