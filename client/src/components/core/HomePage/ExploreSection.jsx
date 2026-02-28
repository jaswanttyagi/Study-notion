import React, { useState } from 'react'
import { HomePageExplore } from '../../../data/homepage-explore';
import HighlightText from './HighlightText';
import CourseCard from './CourseCard';

const tabName = ["Free",
    "New to coding",
    "Most popular",
    "Skills paths",
    "Carrer paths",
];
const ExploreSection = () => {
    const [currentTab, setCurrentTab] = useState(tabName[0]);
    const [courses, setCourses] = useState(HomePageExplore[0].courses);
    const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);

    const setMycards = (value) => {
        setCurrentTab(value);
        const result = HomePageExplore.filter((course) => course.tag === value);
        setCourses(result[0].courses);
        setCurrentCard(result[0].courses[0].heading);
    }
    return (
        <div>
            <div>
                <div className="text-4xl font-semibold text-center my-10">
                    Unlock the
                    <HighlightText text={"Power of Code"} />
                    <p className="text-center text-richblack-300 text-lg font-semibold mt-1">
                        Learn to Build Anything You Can Imagine
                    </p>
                </div>
            </div>

            {/* tabs */}
            <div className="flex flex-row items-center justify-center gap-2 flex-wrap rounded-full bg-richblack-800">
                {
                    tabName.map((value, index) => {
                        return (
                            <div
                                key={index}
                                onClick={() => setMycards(value)}
                                className={`text-[16px] flex flex-row items-center gap-2 rounded-full 
            transition-all duration-200 cursor-pointer px-7 py-2
            ${currentTab === value
                                        ? "bg-richblack-900 text-richblack-5 font-medium"
                                        : "text-richblack-200"
                                    }
            hover:bg-richblack-900 hover:text-richblack-5`}
                            >
                                {value}
                            </div>
                        );
                    })
                }
            </div>

            {/* cards */}
             <div className='lg:h-[200px]'>

                <div className='absolute flex flex-row gap-10 justify-between w-full lg:left-[-0%] mt-10'>
                    {
                        courses.map( (value , index)=>{
                            return(
                                <CourseCard
                                key={index}
                                cardData={value}
                                currentCard={currentCard}
                                setCurrentCard={setCurrentCard}
                                />
                            )
                        })
                    }
                </div>
             </div>

        </div>
    )
}

export default ExploreSection
