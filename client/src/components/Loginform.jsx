import React from 'react'
import { useState } from 'react';
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import {login} from "../services/operations/authAPI"

const Loginform = ({setIsLoggedIn}) => {
    const navigate = useNavigate(); 
    const dispatch = useDispatch();
    const[formData , setformData] = useState({email : "" , password : ""});
    const[showPassword , setshowPassword] = useState(false);
    // const {email , password} = formData;

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
    <form onSubmit={submitHandler} className='flex flex-col w-full gap-y-4 mt-6'>
        <label className='w-full'>
            <p className='text-[0.875rem] text-white mb-1 leading-[1.375rem] ml-[-21rem]'>
                Email Address <sup className='text-pink-200'>*</sup>
            </p>

            <input required type="email" value={formData.email} name="email" onChange={changeHandler} placeholder="Enter email id" 
            className='bg-[oklch(27.9% 0.041 260.031)] w-full py-[8px] px-[12px] rounded-[8px] border border-white text-white'
            />
        </label>


         <label className='w-full relative'>
            <p className='text-[0.875rem] text-white mb-1 leading-[1.375rem] ml-[-23rem]'>
               Password <sup className='text-pink-200'>*</sup>
            </p>

            <input required type={showPassword ? ("text") : ("password")}
             value={formData.password} name="password" onChange={changeHandler} placeholder="Enter password"
             className='bg-[oklch(27.9% 0.041 260.031)] w-full py-[8px] px-[12px] rounded-[8px] border border-white text-white'

             />
             
             <span className='absolute right-3 top-[38px] cursor-pointer text-white' onClick={() => setshowPassword((prev) => !prev)}>{showPassword ? <AiOutlineEye fontSize={20} fill='#AFB2BF' />  : <AiOutlineEyeInvisible />}</span>

             <Link to="/forgot-password"><p className="text-xs mt-1 text-blue-100 max-w-max ml-auto">Forgot Password</p></Link>
             
        </label>

        <button type='submit' className="bg-yellow-300 py-[8px] px-[12px] rounded-[8px] mt-6 font-medium text-richblack-900">Sign in</button>
    </form>
  )
}

export default Loginform
