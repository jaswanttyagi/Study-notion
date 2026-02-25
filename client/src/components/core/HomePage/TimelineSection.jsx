import React from 'react'
import Logo1 from "../../../assest/TimeLineLogo/Logo1.svg"
import Logo2 from "../../../assest/TimeLineLogo/Logo2.svg"
import Logo3 from "../../../assest/TimeLineLogo/Logo3.svg"
import Logo4 from "../../../assest/TimeLineLogo/Logo4.svg"
import TimelineImage from "../../../assest/images/timelineImage.png"
const TimelineSection = () => {
    const Timeline = [
        {
            Logo: Logo1,
            Heading: "LeaderShip",
            Description: "Fully commited to the success of our students"
        },  
        {
            Logo: Logo2,
            Heading: "Responsibility",
            Description: "Students will always be our top priority",
        },
        {
            Logo: Logo3,
            Heading: "Flexibility",
            Description: "The ability to switch is an important skills",
        },
        {
            Logo: Logo4,
            Heading: "Solve the problem",
            Description: "Code your way to a solution",
        },
    ];
    return (
        <div>
            <div className='flex flex-row gap-15 items-center'>
                {/* left box div */}
                <div className='w-[45%] flex flex-col gap-5'>
                    {
                        Timeline.map((element, index) => {
                            return (
                                <div className='flex flex-row gap-6' key={index}>
                                    <div className='w-[50px] h-[50px] bg-white flex items-center'>
                                        <img src={element.Logo} alt="" />
                                    </div>

                                    <div>
                                        <h2 className='text-[18px] font-semibold'>{element.Heading}</h2>
                                        <p className='text-base'>{element.Description}</p>
                                    </div>

                                </div>
                            )
                        })
                    }

                </div>

                {/* right box div */}

                <div className='relative shadow-blue-200'>
                    <img src={TimelineImage} alt="TimelineImage" />

                    <div className='absolute bg-caribbeangreen-700 flex flex-row text-white uppercase py-10 left-[-10%] translate-x-[30%] translate-y-[-35%]'>

                        <div className='flex flex-row gap-5 items-center border-caribbeangreen-300 px-7'>
                            <p className='text-3xl font-bold'>10</p>
                            <p className='text-caribbeangreen-300 text-sm'>Years of Experience</p>
                        </div>

                        <div className='flex  gap-5 items-center  px-7'>
                            <p className='text-3xl font-bold'>250</p>
                            <p className='text-caribbeangreen-300 text-sm'>Type of Courses</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TimelineSection
