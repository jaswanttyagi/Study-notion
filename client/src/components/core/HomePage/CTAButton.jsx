import React from 'react'
import { Link } from 'react-router-dom'

const Button = ({children , active , linkto}) => {
  return (
    <div>
      <Link to={linkto}>

      <div className={`text-center text-[13px] px-6 py-3 rounded-md font-bold 
        ${active ? "bg-yellow-50 text-richblack-900 hover:scale-95 " : "bg-richblack-800 text-richblack-200 hover:scale-95 border border-richblack-700 "}`}>
        {children}
      </div>
      
      </Link>
    </div>
  )
}

export default Button
