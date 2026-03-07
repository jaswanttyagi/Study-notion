import React from 'react'
import { useState } from 'react';
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {login} from "../services/operations/authAPI"

const Loginform = ({setIsLoggedIn}) => {
    const navigate = useNavigate(); 
    const dispatch = useDispatch();
    const[formData , setformData] = useState({email : "" , password : ""});
    const[showPassword , setshowPassword] = useState(false);
   function changeHandler(event){
        setformData((prevData)=>(
            {
                ...prevData,
            [event.target.name] : event.target.value
            }
          
        ))
    }
    function submitHandler(event){
    event.preventDefault();
    
    dispatch(login(formData.email, formData.password, navigate));
}

  return (
    <form onSubmit={submitHandler} className='mt-8 flex w-full flex-col gap-y-5'>
        <label className='w-full'>
            <p className='mb-2 text-sm leading-[1.375rem] text-richblack-25'>
                Email Address <sup className='text-pink-200'>*</sup>
            </p>

            <input required type="email" value={formData.email} name="email" onChange={changeHandler} placeholder="Enter email id" 
            className='w-full rounded-xl border border-richblack-600 bg-richblack-700 px-4 py-3 text-white outline-none transition-colors duration-200 placeholder:text-richblack-300 focus:border-yellow-100'
            />
        </label>


         <label className='relative w-full'>
            <p className='mb-2 text-sm leading-[1.375rem] text-richblack-25'>
               Password <sup className='text-pink-200'>*</sup>
            </p>

            <input required type={showPassword ? ("text") : ("password")}
             value={formData.password} name="password" onChange={changeHandler} placeholder="Enter password"
             className='w-full rounded-xl border border-richblack-600 bg-richblack-700 px-4 py-3 pr-12 text-white outline-none transition-colors duration-200 placeholder:text-richblack-300 focus:border-yellow-100'

             />
             
             <span className='absolute right-4 top-[44px] cursor-pointer text-white/80' onClick={() => setshowPassword((prev) => !prev)}>{showPassword ? <AiOutlineEye fontSize={20} fill='#AFB2BF' />  : <AiOutlineEyeInvisible fontSize={20} fill='#AFB2BF' />}</span>

             <Link to="/forgot-password"><p className="ml-auto mt-2 max-w-max text-xs text-blue-100">Forgot Password</p></Link>
             
        </label>

        <button type='submit' className="mt-3 rounded-xl bg-yellow-300 px-4 py-3 font-medium text-richblack-900 transition-all duration-200 hover:-translate-y-0.5 hover:bg-yellow-200">Sign in</button>
    </form>
  )
}

export default Loginform
