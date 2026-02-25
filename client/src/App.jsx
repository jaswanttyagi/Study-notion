import React, { useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/core/HomePage/common/Navbar'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import OpenRoute from './components/core/Auth/OpenRoute'
import PrivateRoute from './components/PrivateRoute'
import UpdatePassword from './pages/UpdatePassword'
import VerifyEmail from './pages/VerifyEmail'
import Dashboard from "./pages/Dashboard";
import About from './pages/About'
import Contact from './pages/Contact'
import MyProfile from './components/core/Dashboard/MyProfile'
import { useDispatch, useSelector } from 'react-redux'
import Error from "./pages/Error"
import Setting from "./components/core/Dashboard/setting/index"
import { getUserDetails } from "./services/operations/profileApI"
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses"
import Cart from "./components/core/Dashboard/Cart/index"
import { ACCOUNT_TYPE } from './utils/constants'
import AddCourse from './components/core/Dashboard/AddCourse/index'
import MyCourses from './components/core/Dashboard/MyCourses'
import EditCourse from './components/core/Dashboard/EditCourse/index.jsx'
import CourseDetails from './pages/courseDetails'
import ViewCourse from './pages/ViewCourse'
import Catalog from './pages/Catalog'
import Instructor from './components/core/Dashboard/InstructorDashboard/Instructor.jsx'

const App = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      dispatch(getUserDetails(token, navigate))
    }
  }, [dispatch, token, navigate])
  return (
    <div className='w-screen min-h-screen bg-richblack-900 flex flex-col font-inter'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home></Home>} />
        <Route
          path="/signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />

        <Route
          path="/login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />

        <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />


        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />

        <Route path="/dashboard" element={
          <PrivateRoute isLoggedIn={token} ><Dashboard /></PrivateRoute>
        }>
          <Route path="my-profile" element={<MyProfile />} />
          {/* <Route path="instructor" element={<InstructorDashboard />} /> */}
          <Route path="/dashboard/settings" element = {<Setting></Setting>}></Route>
          <Route path="/dashboard/cart" element={<Cart />} />
          
          {/* <Route path="my-courses" element={<MyCourses />} /> */}
          {/* <Route path="add-course" element={<AddCourse />} /> */}
          {
            user?.accountType ===ACCOUNT_TYPE.STUDENT && (
              <>
            <Route path="/dashboard/enrolled-courses" element={<EnrolledCourses />} />
              </>
            )
          }
          {/* for instructor */}
          {
            user?.accountType ===ACCOUNT_TYPE.INSTRUCTOR && (
              <>
               <Route path="instructor" element={<Instructor />} />
            <Route path="/dashboard/add-course" element={<AddCourse />} />
            <Route path="/dashboard/my-courses" element={<MyCourses />} />
            <Route path="/dashboard/edit-course/:courseId" element={<EditCourse />} />
              </>
            )
          }

        </Route>


        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/catalog/:catalogName" element={<Catalog />} />
        <Route path="/course/:courseId" element={<CourseDetails />} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />
        <Route
          path="/view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
          element={
            <PrivateRoute isLoggedIn={token}>
              <ViewCourse />
            </PrivateRoute>
          }
        />

        <Route path='*' element={<Error></Error>}></Route>


      </Routes>
    </div>
  )
}

export default App
