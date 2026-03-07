import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux"
import { sendOTP } from "../services/operations/authAPI"
import { setSignupData } from "../Slices/authSlice"

const Signupform = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showconfirmpassword, setShowconfirmpassword] = useState(false);
  const [accountType, setAccountType] = useState("Student"); // Student or Instructor

  function changeHandler(event) {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value
    }));
  }

  function submitHandler(event) {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const signupData = {
      ...formData,
      accountType,
    }

    dispatch(setSignupData(signupData));
    dispatch(sendOTP(formData.email, navigate));
  }

  return (
    <div>
      <div className="mt-8 flex w-full max-w-full rounded-full bg-richblack-700 p-1 sm:max-w-max">
        <button
          type="button"
          className={`${accountType === "Student"
            ? "bg-richblack-900 text-white shadow-[0_8px_20px_rgba(0,0,0,0.35)]"
            : "bg-transparent text-richblack-200 "
            } flex-1 rounded-full px-4 py-2 text-sm transition-all sm:flex-none sm:px-5`}
          onClick={() => setAccountType("Student")}
        >
          Student
        </button>
        <button
          type="button"
          className={`${accountType === "Instructor"
            ? "bg-richblack-900 text-white shadow-[0_8px_20px_rgba(0,0,0,0.35)]"
            : "bg-transparent text-richblack-200 "
            } flex-1 rounded-full px-4 py-2 text-sm transition-all sm:flex-none sm:px-5`}
          onClick={() => setAccountType("Instructor")}
        >
          Instructor
        </button>
      </div>

      <form onSubmit={submitHandler} className='mt-6 space-y-5'>
        <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
          <label className='w-full'>
            <p className='mb-2 text-sm leading-[1.375rem] text-richblack-25'>First Name <sup className='text-pink-200'>*</sup></p>
            <input required type="text" name="firstName" placeholder="Enter first name" value={formData.firstName} onChange={changeHandler}
              className='w-full rounded-xl border border-richblack-600 bg-richblack-700 px-4 py-3 text-white outline-none transition-colors duration-200 placeholder:text-richblack-300 focus:border-yellow-100' />
          </label>

          <label className='w-full'>
            <p className='mb-2 text-sm leading-[1.375rem] text-richblack-25'>Last Name <sup className='text-pink-200'>*</sup></p>
            <input required type="text" name="lastName" placeholder="Enter last name" value={formData.lastName} onChange={changeHandler}
              className='w-full rounded-xl border border-richblack-600 bg-richblack-700 px-4 py-3 text-white outline-none transition-colors duration-200 placeholder:text-richblack-300 focus:border-yellow-100' />
          </label>
        </div>

        <div>
          <label className='w-full'>
            <p className='mb-2 text-sm leading-[1.375rem] text-richblack-25'>
              Email Address <sup className='text-pink-200'>*</sup>
            </p>

            <input required type="email" value={formData.email} name="email" onChange={changeHandler} placeholder="Enter email Address"
              className='w-full rounded-xl border border-richblack-600 bg-richblack-700 px-4 py-3 text-white outline-none transition-colors duration-200 placeholder:text-richblack-300 focus:border-yellow-100' />
          </label>
        </div>

        <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
          <label className='relative w-full'>
            <p className='mb-2 text-sm leading-[1.375rem] text-richblack-25'>Create Password <sup className='text-pink-200'>*</sup></p>
            <input required type={showPassword ? ("text") : ("password")} name="password" placeholder="Create your password" value={formData.password} onChange={changeHandler}
              className='w-full rounded-xl border border-richblack-600 bg-richblack-700 px-4 py-3 pr-12 text-white outline-none transition-colors duration-200 placeholder:text-richblack-300 focus:border-yellow-100' />
            <span className='absolute right-4 top-[44px] cursor-pointer text-white/80' onClick={() => setShowPassword((prev) => !prev)}>{showPassword ? <AiOutlineEye fontSize={20} fill='#AFB2BF' /> : <AiOutlineEyeInvisible fontSize={20} fill='#AFB2BF' />}</span>
          </label>

          <label className='relative w-full'>
            <p className='mb-2 text-sm leading-[1.375rem] text-richblack-25'>Confirm Password <sup className='text-pink-200'>*</sup></p>
            <input required type={showconfirmpassword ? ("text") : ("password")} name="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={changeHandler}
              className='w-full rounded-xl border border-richblack-600 bg-richblack-700 px-4 py-3 pr-12 text-white outline-none transition-colors duration-200 placeholder:text-richblack-300 focus:border-yellow-100' />
            <span className='absolute right-4 top-[44px] cursor-pointer text-white/80' onClick={() => setShowconfirmpassword((prev) => !prev)}>{showconfirmpassword ? <AiOutlineEye fontSize={20} fill='#AFB2BF' /> : <AiOutlineEyeInvisible fontSize={20} fill='#AFB2BF' />}</span>
          </label>
        </div>
        <button type='submit' className="w-full cursor-pointer rounded-xl bg-yellow-300 px-4 py-3 font-medium text-richblack-900 transition-all duration-200 hover:-translate-y-0.5 hover:bg-yellow-200">Create Account</button>
      </form>
    </div>
  )
}

export default Signupform
