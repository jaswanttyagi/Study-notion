import React from 'react'
import ContactUsForm from "../HomePage/contactPage/ContactUsForm"

const ContactFormSection = () => {
  return (
    <div className='mx-auto'>
        <h1 className='font-semibold text-4xl text-center'>Get in Touch</h1>
        <p className="text-center text-richblack-300 mt-3">We&apos;d love to here for you, Please fill out this form.</p>

        <div>
            <ContactUsForm></ContactUsForm>
        </div>
      
    </div>
  )
}

export default ContactFormSection
