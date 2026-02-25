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
      <div className="flex bg-[#171717] p-1 gap-x-1 rounded-full max-w-max mt-5">
        <button
          type="button"
          className={`${accountType === "Student"
            ? "bg-black text-white"
            : "bg-transparent text-richblack-200 "
            } py-2 px-5 rounded-full transition-all`}
          onClick={() => setAccountType("Student")}
        >
          Student
        </button>
        <button
          type="button"
          className={`${accountType === "Instructor"
            ? "bg-black text-white"
            : "bg-transparent text-richblack-200 "
            } py-2 px-5 rounded-full transition-all`}
          onClick={() => setAccountType("Instructor")}
        >
          Instructor
        </button>
      </div>

      <form onSubmit={submitHandler}>
        <div className='flex gap-x-5 justify-between mt-5'>
          <label>
            <p className='text-[0.875rem] text-white mb-1 leading-[1.375rem] '>first name <sup className='text-pink-200'>*</sup></p>
            <input required type="text" name="firstName" placeholder="Enter first name" value={formData.firstName} onChange={changeHandler}
              className='bg-[oklch(27.9% 0.041 260.031)] w-full py-[8px] px-[12px] rounded-[8px] border border-white text-white' />
          </label>

          <label>
            <p className='text-[0.875rem] text-white mb-1 leading-[1.375rem] '>last name <sup className='text-pink-200'>*</sup></p>
            <input required type="text" name="lastName" placeholder="Enter last name" value={formData.lastName} onChange={changeHandler}
              className='bg-[oklch(27.9% 0.041 260.031)] w-full py-[8px] px-[12px] rounded-[8px] border border-white text-white' />
          </label>
        </div>

        <div className='mt-2'>
          <label className='w-full'>
            <p className='text-[0.875rem] text-white mb-1 leading-[1.375rem]'>
              Email Address <sup className='text-pink-200'>*</sup>
            </p>

            <input required type="email" value={formData.email} name="email" onChange={changeHandler} placeholder="Enter email Address"
              className='bg-[oklch(27.9% 0.041 260.031)] w-full py-[8px] px-[12px] rounded-[8px] border border-white text-white' />
          </label>
        </div>

        <div className='flex gap-x-5 justify-between'>
          <label className='relative mt-2'>
            <p className='text-[0.875rem] text-white mb-1 leading-[1.375rem] '>Create Password <sup className='text-pink-200'>*</sup></p>
            <input required type={showPassword ? ("text") : ("password")} name="password" placeholder="Create your password" value={formData.password} onChange={changeHandler}
              className='bg-[oklch(27.9% 0.041 260.031)] w-full py-[8px] px-[12px] rounded-[8px] border border-white text-white' />
            <span className='absolute right-3 top-[38px] cursor-pointer text-white' onClick={() => setShowPassword((prev) => !prev)}>{showPassword ? <AiOutlineEye fontSize={20} fill='#AFB2BF' /> : <AiOutlineEyeInvisible fontSize={20} fill='#AFB2BF' />}</span>
          </label>

          <label className='relative mt-2'>
            <p className='text-[0.875rem] text-white mb-1 leading-[1.375rem] '>Confirm Password <sup className='text-pink-200'>*</sup></p>
            <input required type={showconfirmpassword ? ("text") : ("password")} name="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={changeHandler}
              className='bg-[oklch(27.9% 0.041 260.031)] w-full py-[8px] px-[12px] rounded-[8px] border border-white text-white' />
            <span className='absolute right-1 top-[38px] cursor-pointer text-white' onClick={() => setShowconfirmpassword((prev) => !prev)}>{showconfirmpassword ? <AiOutlineEye fontSize={20} fill='#AFB2BF' /> : <AiOutlineEyeInvisible fontSize={20} fill='#AFB2BF' />}</span>
          </label>
        </div>
        <button type='submit' className="w-full bg-yellow-300 py-[8px] px-[12px] rounded-[8px] mt-6 font-medium text-richblack-900 cursor-pointer">Create Account</button>
      </form>
    </div>
  )
}

export default Signupform
