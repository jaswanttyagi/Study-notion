import React from 'react'
import Instructor from "../../../assest/images/Instructor.png";
import HighlightText from './HighlightText'
import CTAButton from './CTAButton';
import { FaArrowRight } from 'react-icons/fa';


const InstructorSection = () => {
  return (
    <div className='mt-8 sm:mt-12 lg:mt-16 w-full'>
      <div className='flex flex-col lg:flex-row items-center gap-8 lg:gap-16'>

        <div className='w-full lg:w-[50%]'>
            <img src={Instructor} alt="Instructor" className='w-full max-w-[560px] mx-auto shadow-white shadow-[-10px_-10px_0_0] sm:shadow-[-20px_-20px_0_0]'/>
        </div>
        <div className='w-full lg:w-[50%] flex flex-col gap-6 sm:gap-8 lg:gap-10'>

              <h1 className="w-full text-2xl sm:text-3xl lg:text-4xl font-semibold ">
              Become an
              <HighlightText text={"instructor"} />
            </h1>

            <p className="font-medium text-[15px] sm:text-[16px] text-justify w-full lg:w-[90%] text-richblack-300">
              Instructors from around the world teach millions of students on
              StudyNotion. We provide the tools and skills to teach what you
              love.
            </p>

             <div className="w-fit">
              <CTAButton active={true} linkto={"/signup"}>
                <div className="flex items-center gap-3">
                  Start Teaching Today
                  <FaArrowRight />
                </div>
              </CTAButton>
            </div>

        </div>
      </div>
    </div>
  )
}

export default InstructorSection
