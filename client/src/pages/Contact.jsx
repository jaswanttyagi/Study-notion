import React from "react"

import Footer from "../components/core/HomePage/common/Footer"
import ContactDetails from "../components/core/HomePage/contactPage/ContactDetails"
import ContactForm from "../components/core/HomePage/contactPage/ContactForm"
// import ReviewSlider from "../components/common/ReviewSlider"

const Contact = () => {
  return (
    <div>
      <div className="mx-auto mt-20 lg:flex w-11/12 max-w-maxContent lg:flex-row sm:flex  sm:flex-col justify-between gap-10 text-white ">
        {/* Contact Details */}
        <div className="lg:w-[40%]">
          <ContactDetails />
        </div>

        {/* Contact Form */}
        <div className="lg:w-[60%]">
          <ContactForm />
        </div>
      </div>
      <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
        {/* Reviws from Other Learner */}
        <h1 className="text-center text-4xl font-semibold mt-8">
          Reviews from other learners
        </h1>
        {/* <ReviewSlider /> */}
      </div>
      <Footer />
    </div>
  )
}

export default Contact
