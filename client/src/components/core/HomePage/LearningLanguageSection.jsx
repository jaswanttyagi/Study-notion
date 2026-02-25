import React from 'react'
import HighlightText from './HighlightText'
import Know_your_progress from "../../../assest/images/Know_your_progress.png";
import Compare_with_others from "../../../assest/images/Compare_with_others.png";
import Plan_your_lessons from "../../../assest/images/Plan_your_lessons.png";
import CTAButton from '../HomePage/CTAButton';
const LearningLanguageSection = () => {
  return (
    <div className='mt-[150px]'>
      <div className='w-11/12 flex flex-col gap-5'>
        <div className='text-4xl font-semibold text-center'>
            Your Knife Swiss for
            <HighlightText text={" Learning Languages"} />
        </div>

            <div className="text-center text-richblack-700 font-medium  mx-auto leading-6 text-base mt-3 w-[70%]">
              Using spin making learning multiple languages easy. with 20+
              languages realistic voice-over, progress tracking, custom schedule
              and more.
            </div>

            <div className='flex flex-row items-center justify-center mt-5'>
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
