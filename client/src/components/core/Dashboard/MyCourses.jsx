import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { fetchInstructorCourses } from '../../../services/operations/courseDetailsAPI';
import Iconbtn from '../HomePage/common/Iconbtn';
import { VscAdd } from "react-icons/vsc"
import CoursesTable from './InstructorCourses/CoursesTable';

const MyCourses = () => {
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [courses , setCourses] = useState([]);

    useEffect( ()=>{
        // here we call the getInstructorCourse API
        const fetchCourses = async()=>{
            const result = await fetchInstructorCourses(token);
            if(result){
                setCourses(result);
            }
        }
        fetchCourses();

    },[token])

  const publishedCount = courses?.filter((course) => course?.status === "Published")?.length || 0
  const draftCount = courses?.length - publishedCount
  const averagePrice =
    courses?.length > 0
      ? Math.round(
          courses.reduce((acc, course) => acc + Number(course?.price || 0), 0) / courses.length
        )
      : 0

  return (
     <div className="space-y-8">
      <div className="course-hero relative overflow-hidden rounded-2xl border border-richblack-700/70 p-6 sm:p-8">
        <div className="course-hero-glow pointer-events-none absolute -left-16 -top-20 h-52 w-52 rounded-full" />
        <div className="course-hero-glow pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full" />

        <div className="relative z-10 mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.25em] text-richblack-300">Instructor Control Panel</p>
            <h1 className="text-3xl font-semibold text-richblack-5 sm:text-4xl">My Courses</h1>
            <p className="mt-2 text-sm text-richblack-300">
              Manage catalog, monitor status, and ship polished learning experiences.
            </p>
          </div>
          <Iconbtn
            text="Add Course"
            onclick={() => navigate("/dashboard/add-course")}
            customClasses="shadow-[0_12px_30px_rgba(250,204,21,0.25)]"
          >
            <VscAdd />
          </Iconbtn>
        </div>

        <div className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="course-kpi-card">
            <p className="text-xs uppercase tracking-widest text-richblack-300">Total Courses</p>
            <p className="mt-2 text-3xl font-semibold text-richblack-5">{courses?.length || 0}</p>
          </div>
          <div className="course-kpi-card">
            <p className="text-xs uppercase tracking-widest text-richblack-300">Published</p>
            <p className="mt-2 text-3xl font-semibold text-caribbeangreen-100">{publishedCount}</p>
          </div>
          <div className="course-kpi-card">
            <p className="text-xs uppercase tracking-widest text-richblack-300">Avg Price</p>
            <p className="mt-2 text-3xl font-semibold text-yellow-50">Rs. {averagePrice}</p>
            <p className="mt-1 text-xs text-richblack-300">Drafts: {draftCount < 0 ? 0 : draftCount}</p>
          </div>
        </div>
      </div>

      {courses && <CoursesTable courses={courses} setCourses={setCourses} />}
    </div>
  )
}

export default MyCourses
