import React from 'react'
import Instructor from "../../../assest/images/Instructor.png";
import HighlightText from './HighlightText'
import CTAButton from './CTAButton';
import { FaArrowRight } from 'react-icons/fa';


const InstructorSection = () => {
  return (
    <div className='mt-16'>
      <div className='flex flex-row items-center gap-20'>

        <div className='w-[50%]'>
            <img src={Instructor} alt="" className='shadow-white shadow-[-20px_-20px_0_0]'/>
        </div>
        <div className='w-[50%] flex flex-col gap-10'>

              <h1 className="lg:w-[50%] text-4xl font-semibold ">
              Become an
              <HighlightText text={"instructor"} />
            </h1>

            <p className="font-medium text-[16px] text-justify w-[90%] text-richblack-300">
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
