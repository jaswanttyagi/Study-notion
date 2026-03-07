import React from 'react'
import Template from "../components/Template"
import MobileAuthPage from "../components/MobileAuthPage"
import signupImg from "../assest/images/signup.png"
import useIsSmallDevice from "../hooks/useIsSmallDevice"

const Signup = ({ setIsLoggedIn }) => {
  const isSmallDevice = useIsSmallDevice();

  if (isSmallDevice) {
    return (
      <MobileAuthPage
        title="Join the millions learning to code with StudyNotion for free"
        desc1="Build skills for today, tomorrow, and beyond."
        desc2="Education to future-proof your career."
        image={signupImg}
        formtype="signup"
      />
    );
  }

  return (
    <div>
       <Template
      title="Join the millions learning to code with StudyNotion for free"
      desc1="Build skills for today, tomorrow, and beyond."
      desc2="Education to future-proof your career."
      image={signupImg}
      formtype="signup"
      setIsLoggedIn={setIsLoggedIn}/>
    </div>
  )
}

export default Signup
