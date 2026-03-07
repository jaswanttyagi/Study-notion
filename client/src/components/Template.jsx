import React from 'react'
import frameimg from "../assest/images/frame.png"
import Signupform from './Signupform'
import Loginform from './Loginform'
import { FcGoogle } from 'react-icons/fc'

const Template = ({ title, desc1, desc2, image, formtype, setIsLoggedIn }) => {
  return (
    <div className='mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-[1200px] flex-col gap-10 px-4 py-8 sm:px-6 md:py-12 lg:flex-row lg:items-center lg:justify-between lg:gap-14'>
      <div className='w-full lg:max-w-[480px] lg:flex-shrink-0'>
        <div className='rounded-[28px] border border-richblack-700/60 bg-richblack-800/80 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-8'>
          <h1 className="max-w-[18ch] text-left text-3xl font-semibold leading-tight text-white sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 max-w-[42ch] text-base leading-7 sm:text-lg">
            <span className='text-white italic'>{desc1}</span>
            <br />
            <span className='text-blue-300 italic'>{desc2}</span>
          </p>

          {formtype === "signup" ? (
            <Signupform setIsLoggedIn={setIsLoggedIn}></Signupform>
          ) : (
            <Loginform setIsLoggedIn={setIsLoggedIn}></Loginform>
          )}

          <div className='my-6 flex w-full items-center gap-3'>
            <div className='h-px w-full bg-richblack-600'></div>
            <p className='text-xs font-semibold uppercase tracking-[0.28em] text-blue-200'>or</p>
            <div className='h-px w-full bg-richblack-600'></div>
          </div>
          <button className='flex w-full items-center justify-center gap-2 rounded-xl border border-blue-300/40 bg-richblack-900/70 px-4 py-3 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-richblack-900'>
            <FcGoogle></FcGoogle>
            <p>{formtype === "signup" ? "Sign up with Google" : "Sign in with Google"}</p>
          </button>
        </div>
      </div>

      <div className='flex w-full justify-center lg:max-w-[560px] lg:flex-1 lg:justify-end'>
        <div className='group relative w-full max-w-[520px] [perspective:1600px]'>
          <div className='absolute -left-4 top-8 h-24 w-24 rounded-full bg-blue-400/20 blur-2xl sm:-left-8 sm:h-32 sm:w-32'></div>
          <div className='absolute -right-2 bottom-10 h-28 w-28 rounded-full bg-yellow-200/20 blur-2xl sm:-right-6 sm:h-36 sm:w-36'></div>
          <div className='relative rounded-[28px] border border-white/10 bg-gradient-to-br from-richblack-700/50 via-richblack-800/70 to-richblack-900/90 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.45)] transition-transform duration-500 [transform-style:preserve-3d] sm:p-5 lg:rotate-y-[-10deg] lg:rotate-x-[6deg] lg:group-hover:rotate-y-[-3deg] lg:group-hover:rotate-x-[2deg]'>
            <div className='absolute left-4 top-4 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/80 backdrop-blur-sm [transform:translateZ(60px)] sm:left-6 sm:top-6'>
              {formtype === "signup" ? "Launch profile" : "Return to dashboard"}
            </div>
            <div className='absolute bottom-4 right-4 rounded-2xl border border-blue-200/15 bg-richblack-900/70 px-4 py-3 text-right backdrop-blur-md [transform:translateZ(80px)] sm:bottom-6 sm:right-6'>
              <p className='text-[10px] uppercase tracking-[0.28em] text-blue-200/70'>Study Flow</p>
              <p className='mt-1 text-lg font-semibold text-white'>Fast onboarding</p>
            </div>
            <img src={frameimg} width={558} height={584} loading='lazy' className='w-full rounded-[22px] opacity-90' alt="Decorative frame" />
            <img src={image} width={558} height={490} loading='lazy' className='absolute left-3 top-3 w-[calc(100%-24px)] rounded-[22px] object-cover shadow-[0_25px_50px_rgba(15,23,42,0.45)] [transform:translateZ(40px)] sm:left-5 sm:top-5 sm:w-[calc(100%-40px)]' alt={`${formtype} visual`} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Template
