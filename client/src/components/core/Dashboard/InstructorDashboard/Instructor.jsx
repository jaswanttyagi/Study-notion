import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { fetchInstructorCourses } from '../../../../services/operations/courseDetailsAPI'
import { getInstructorData } from '../../../../services/operations/profileApI'
import InstructorChart from './InstructorChart'

export default function Instructor() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)

  const [loading, setLoading] = useState(false)
  const [instructorData, setInstructorData] = useState([])
  const [courses, setCourses] = useState([])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const instructorApiData = await getInstructorData(token)
        const result = await fetchInstructorCourses(token)

        setInstructorData(Array.isArray(instructorApiData) ? instructorApiData : [])
        setCourses(Array.isArray(result) ? result : [])
      } catch (error) {
        console.log('INSTRUCTOR DASHBOARD ERROR', error)
      } finally {
        setLoading(false)
      }
    })()
  }, [token])

  const totalAmount = instructorData.reduce(
    (acc, curr) => acc + (Number(curr?.totalAmountGenerated) || 0),
    0
  )

  const totalStudents = instructorData.reduce(
    (acc, curr) => acc + (Number(curr?.totalStudentsEnrolled) || 0),
    0
  )

  return (
    <div className="relative p-4 text-richblack-5 sm:p-6 lg:p-8">
      <div className="pointer-events-none absolute -left-10 top-6 h-40 w-40 rounded-full bg-blue-200/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 top-16 h-44 w-44 rounded-full bg-yellow-50/10 blur-3xl" />

      <div className="relative mb-6 rounded-2xl border border-richblack-700 bg-gradient-to-r from-richblack-800 via-richblack-800 to-richblack-900 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.35)] sm:p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-richblack-300">Instructor Command Center</p>
        <h1 className="mt-2 text-2xl font-bold text-richblack-5 sm:text-3xl">Welcome, {user?.firstName}</h1>
        <p className="mt-1 font-medium text-richblack-200">Monitor revenue, student growth, and course traction in one place.</p>
      </div>

      {loading ? (
        <div className="mt-8 spinner"></div>
      ) : courses.length > 0 ? (
        <div className="relative">
          <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-richblack-700 bg-richblack-800 p-5 shadow-[0_12px_35px_rgba(0,0,0,0.25)]">
              <p className="text-xs uppercase tracking-wide text-richblack-300">Total Courses</p>
              <p className="mt-2 text-3xl font-bold text-yellow-50">{courses.length}</p>
            </div>
            <div className="rounded-2xl border border-richblack-700 bg-richblack-800 p-5 shadow-[0_12px_35px_rgba(0,0,0,0.25)]">
              <p className="text-xs uppercase tracking-wide text-richblack-300">Total Students</p>
              <p className="mt-2 text-3xl font-bold text-caribbeangreen-100">{totalStudents}</p>
            </div>
            <div className="rounded-2xl border border-richblack-700 bg-richblack-800 p-5 shadow-[0_12px_35px_rgba(0,0,0,0.25)] sm:col-span-2 xl:col-span-1">
              <p className="text-xs uppercase tracking-wide text-richblack-300">Total Income</p>
              <p className="mt-2 text-3xl font-bold text-blue-100">Rs. {totalAmount}</p>
            </div>
          </div>

          <div className="my-4 flex h-auto flex-col gap-4 xl:h-[480px] xl:flex-row">
            {totalAmount > 0 || totalStudents > 0 ? (
              <InstructorChart courses={instructorData} />
            ) : (
              <div className="flex-1 rounded-2xl border border-richblack-700 bg-richblack-800 p-6">
                <p className="text-lg font-bold text-richblack-5">Visualize</p>
                <p className="mt-4 text-xl font-medium text-richblack-50">Not Enough Data To Visualize</p>
              </div>
            )}

            <div className="flex min-w-[260px] flex-col rounded-2xl border border-richblack-700 bg-gradient-to-b from-richblack-800 to-richblack-900 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
              <p className="text-lg font-bold text-richblack-5">Deep Stats</p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-sm uppercase tracking-wide text-richblack-300">Total Courses</p>
                  <p className="text-3xl font-semibold text-richblack-50">{courses.length}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-wide text-richblack-300">Total Students</p>
                  <p className="text-3xl font-semibold text-richblack-50">{totalStudents}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-wide text-richblack-300">Total Income</p>
                  <p className="text-3xl font-semibold text-richblack-50">Rs. {totalAmount}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-richblack-700 bg-richblack-800 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.32)]">
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-richblack-5">Top Performing Courses</p>
              <Link to="/dashboard/my-courses">
                <p className="text-xs font-semibold text-yellow-50">View All</p>
              </Link>
            </div>

            <div className="my-4 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {courses.slice(0, 3).map((course) => {
                const studentsCount = (course?.studentsEnrolled || course?.studentEnrolled || []).length
                const completionRatio = totalStudents > 0 ? Math.min((studentsCount / totalStudents) * 100, 100) : 0
                return (
                  <div
                    key={course?._id}
                    className="group rounded-xl border border-richblack-700 bg-richblack-900 p-3 transition hover:-translate-y-1 hover:border-richblack-500 hover:shadow-[0_18px_30px_rgba(0,0,0,0.35)]"
                  >
                    <img
                      src={course?.thumbnail}
                      alt={course?.courseName}
                      className="h-[201px] w-full rounded-lg object-cover"
                    />
                    <div className="mt-3 w-full">
                      <p className="text-sm font-medium text-richblack-50">{course?.courseName}</p>
                      <div className="mt-1 flex items-center space-x-2">
                        <p className="text-xs font-medium text-richblack-300">{studentsCount} students</p>
                        <p className="text-xs font-medium text-richblack-300">|</p>
                        <p className="text-xs font-medium text-richblack-300">Rs. {course?.price}</p>
                      </div>
                      <div className="mt-3">
                        <div className="mb-1 flex items-center justify-between text-[11px] text-richblack-300">
                          <span>Engagement</span>
                          <span>{completionRatio.toFixed(0)}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-richblack-700">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-yellow-50 to-blue-100"
                            style={{ width: `${completionRatio}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-20 rounded-2xl border border-richblack-700 bg-richblack-800 p-6 py-20 shadow-[0_14px_36px_rgba(0,0,0,0.3)]">
          <p className="text-center text-2xl font-bold text-richblack-5">You have not created any courses yet</p>
          <Link to="/dashboard/add-course">
            <p className="mt-1 text-center text-lg font-semibold text-yellow-50">Create a course</p>
          </Link>
        </div>
      )}
    </div>
  )
}
