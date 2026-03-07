import React from 'react'
import Template from "../components/Template"
import MobileAuthPage from "../components/MobileAuthPage"
import loginImg from "../assest/images/login.png"
import useIsSmallDevice from "../hooks/useIsSmallDevice"

const Login = ({ setIsLoggedIn }) => {
  const isSmallDevice = useIsSmallDevice();

  if (isSmallDevice) {
    return (
      <MobileAuthPage
        title="Welcome Back"
        desc1="Build skills for today, tomorrow, and beyond."
        desc2="Education to future-proof your career."
        image={loginImg}
        formtype="login"
      />
    );
  }

  return (
    <div>
       <Template
      title="Welcome Back"
      desc1="Build skills for today, tomorrow, and beyond."
      desc2="Education to future-proof your career."
      image={loginImg}
      formtype="login"
      setIsLoggedIn={setIsLoggedIn}
    />
    </div>
  )
}

export default Login
