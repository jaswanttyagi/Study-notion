import React from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import "../App.css";

import HighlightText from '../components/core/HomePage/HighlightText'
import CTAButton from '../components/core/HomePage/CTAButton'
import Banner from "../assest/images/banner.mp4"
import CodeBlocks from '../components/core/HomePage/CodeBlocks'
import TimelineSection from '../components/core/HomePage/TimelineSection'
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection'
import InstructorSection from '../components/core/HomePage/InstructorSection'
import ExploreSection from '../components/core/HomePage/ExploreSection';
import Footer from "../components/core/HomePage/common/Footer"
import ReviewSlider from "../components/core/HomePage/common/ReviewSlider"

const Home = () => {
  return (
    <div>
      {/* section 1 */}
      <section className='relative mt-16 p-1 mx-auto flex flex-col w-11/12 items-center text-white justify-between max-w-maxContent'>
        <Link to={"/signup"}>
          <div className='mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit'>
            <div className='flex flex-row items-center gap-2 rounded-full px-10 py-3 group-hover:bg-richblack-900'>
              <p>Become an instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>

        <div className='text-center lg:text-4xl text-3xl font-semibold mt-7'>Empower your future with
          <HighlightText text={"Coding Skills"} />
        </div>

        <div className="mt-3 lg:w-[90%] w-[110%] text-center lg:text-lg  font-bold text-richblack-300">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.
        </div>

        {/* buttons */}
        <div className='flex flex-row gap-7 mt-8'>
          <CTAButton active={true} linkto={"/signup"}>Learn More</CTAButton>

          <CTAButton active={false} linkto={"/login"}>Book a Demo</CTAButton>
        </div>

        {/* video */}
        <div className='shadow-blue-200 shadow-[10px_-7px_60px_-5px]  mx-6 my-12'>
          <video className='shadow-[20px_20px_rgba(255,255,255)] ' muted loop autoPlay="true">
            <source src={Banner} type="video/mp4" />
          </video>
        </div>

        {/* code section1 */}

        <div>
          <CodeBlocks
            position={"flex lg:flex-row md:flex-col relative left-[-2%] "}
            heading={
              <div className='w-full lg:text-4xl text-3xl font-semibold'>
                Unlock Your <HighlightText text={"Coding Potential "} />
                with Our Online Courses
              </div>
            }
            subheading={
              "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }
            ctabtn1={
              {
                btnText: "Try it Yourself",
                linkto: "/signup",
                active: true,
              }
            }
            ctabtn2={
              {
                btnText: "Learn More",
                linkto: "/login",
                active: false,
              }
            }

            codeColor={"text-yellow-25"}
            codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
            backgroundGradient={<div className="codeblock1 absolute"></div>}
          />
        </div>

        {/* code section 2 */}
        <div>
          <CodeBlocks
            position={"lg:flex-row-reverse md:flex-col  relative right-[5%]"}
            heading={
              <div className='w-[130%] text-4xl font-semibold'>
                Start<HighlightText text={"Coding in Seconds "} />
                with Our Online Courses
              </div>
            }
            subheading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson. Easy to learn and fun too!"
            }
            ctabtn1={
              {
                btnText: "Continue Lesson",
                linkto: "/signup",
                active: true,
              }
            }
            ctabtn2={
              {
                btnText: "Learn More",
                linkto: "/login",
                active: false,
              }
            }

            codeColor={"text-white"}
            codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
            backgroundGradient={<div className="codeblock2 absolute"></div>}
          />
        </div>

        <ExploreSection />
      </section>

      {/* section2 */}

      <section className='bg-pure-greys-5 text-richblack-700'>
        {/* for buttons */}
        <div className='homepage_bg h-[310px]'>
          <div className='w-11/12 max-w-maxContent flex flex-col items-center gap-5 mx-auto'>
            <div className='h-[150px]'></div>

            <div className='flex flex-row gap-7 text-white'>
              {/* buttons */}
              <div className='flex flex-row gap-7 mt-8'>
                <CTAButton active={true} linkto={"/signup"}>
                  <div className='flex gap-2 items-center'>
                    Explore Full Catalog
                    <FaArrowRight />
                  </div>
                </CTAButton>

                <CTAButton active={false} linkto={"/signup"}>
                  <div className='flex gap-2 items-center'>
                    Learn More
                    <FaArrowRight />
                  </div>
                </CTAButton>
              </div>
            </div>
          </div>
        </div>

        {/* for content */}
        <div className='flex flex-col mx-auto w-11/12 items-center justify-between max-w-maxContent gap-7'>
          <div className=' flex flex-row justify-between gap-7 mb-10 mt-[95px] lg:mt-20 lg:flex-row lg:gap-0'>
            <div className="text-4xl font-semibold lg:w-[45%] ">
              Get the skills you need for a{" "}
              <HighlightText text={"job that is in demand."} />
            </div>

            <div className='flex flex-col w-[40%] gap-10 items-start'>
              <div className='text-[16px]'>
                The modern StudyNotion is the dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
              </div>

              <CTAButton active={true} linkto={"/signup"}>
                <div className='flex gap-2 items-center justify-center'>
                  Learn More
                  <FaArrowRight />
                </div>
              </CTAButton>
            </div>
          </div>

          <TimelineSection />
          <LearningLanguageSection />
        </div>
      </section>

      {/* section 3 */}

      <section className='w-11/12 mx-auto max-w-maxContent gap-8 first-letter flex flex-col items-center justify-between bg-richblack-900 text-white'>
        <InstructorSection />
        <h2 className='text-center text-4xl font-semibold mt-10'>Reviews from Other Learners</h2>
        <ReviewSlider />
      </section>

      {/* footer */}
      <Footer />
    </div>
  )
}

export default Home
