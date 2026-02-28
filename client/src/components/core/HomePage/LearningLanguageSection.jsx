import React from 'react'
import HighlightText from './HighlightText'
import Know_your_progress from "../../../assest/images/Know_your_progress.png";
import Compare_with_others from "../../../assest/images/Compare_with_others.png";
import Plan_your_lessons from "../../../assest/images/Plan_your_lessons.png";
import CTAButton from '../HomePage/CTAButton';
const LearningLanguageSection = () => {
  return (
    <div className='mt-16 sm:mt-24 lg:mt-[150px] w-full'>
      <div className='w-full flex flex-col gap-5'>
        <div className='text-2xl sm:text-3xl lg:text-4xl font-semibold text-center'>
            Your Knife Swiss for
            <HighlightText text={" Learning Languages"} />
        </div>

            <div className="text-center text-richblack-700 font-medium mx-auto leading-6 text-sm sm:text-base mt-3 w-full md:w-[80%] lg:w-[70%]">
              Using spin making learning multiple languages easy. with 20+
              languages realistic voice-over, progress tracking, custom schedule
              and more.
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-0 items-center justify-center mt-5 lg:hidden'>
                <img src={Know_your_progress} alt="know your progress" className='object-contain w-full max-w-[280px] mx-auto' />
                <img src={Compare_with_others} alt="compare with others" className='object-contain w-full max-w-[280px] mx-auto' />
                <img src={Plan_your_lessons} alt="plan your lessons" className='object-contain w-full max-w-[280px] mx-auto' />
            </div>

            <div className='hidden lg:flex flex-row items-center justify-center mt-5'>
                <img src={Know_your_progress} alt="know your progress" className='object-contain -mr-32' />
                <img src={Compare_with_others} alt="compare with others" className='object-contain -mt-12' />
                <img src={Plan_your_lessons} alt="plan your lessons" className='object-contain -ml-36' />
            </div>
            
      </div>
      <div className="w-fit mx-auto lg:mb-20 mb-8 -mt-5">
            <CTAButton active={true} linkto={"/signup"}>
              <div className="">Learn More</div>
            </CTAButton>
          </div>
    </div>
  )
}

export default LearningLanguageSection
