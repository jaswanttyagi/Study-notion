import React from 'react'
import frameimg from "../assest/images/frame.png"
import Signupform from './Signupform'
import Loginform from './Loginform'
import { FcGoogle } from 'react-icons/fc'
const Template = ({title , desc1 , desc2 , image , formtype , setIsLoggedIn}) => {
  return (
    <div className=' flex max-w-[1160px] py-12 mx-auto gap-x-12 justify-between'>
      
    <div className='w-11/12 max-w-[450px]'>
    <h1  className="text-white font-semibold text-[1.875rem] leading-[2.375rem] text-justify">{title}</h1>
    <p className="text-[1.125rem] mt-4 leading-[1.625rem] mr-22">
    <span className='text-white italic '>{desc1}</span>
    <br />
    <span className='text-blue-300 italic'>{desc2}</span>
    </p>

    {formtype === "signup" ? (<Signupform setIsLoggedIn={setIsLoggedIn}></Signupform>) : (<Loginform setIsLoggedIn={setIsLoggedIn}></Loginform>)}
    
    <div className='flex w-full items-center my-4 gap-x-2'>
        <div className='w-full h-[1px] bg-white'></div>
        <p className='text-blue-300'>OR</p>
        <div className='w-full h-[1px] bg-white'></div>
    </div>
    <button className='w-full flex justify-center items-center rounded-[8px] font-medium text-white border border-blue-300 py-[8px] px-[12px] gap-x-2 mt-6'> <FcGoogle></FcGoogle> <p> Sign up with google </p></button>

    </div>
    {/* div for images */}
    <div className='relative w-11/12 max-w-[450px]'>
        <img src={frameimg} width={558} height={584} loading='lazy' alt="" />
        <img src={image} width={558} height={490} loading='lazy' className='absolute -top-4 right-4' alt="" />
    </div>
    </div>
  )
}

export default Template
