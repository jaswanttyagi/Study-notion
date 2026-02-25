import React from 'react'

const Iconbtn = ({
  text,
  onClick,
  onclick,
  children,
  disabled,
  outline = false,
  customClasses,
  type = "button",
}) => {
  const handleClick = onClick ?? onclick;
  const baseClasses = "flex items-center gap-x-2 rounded-md px-5 py-2 font-semibold";
  const variantClasses = outline
    ? "border border-richblack-700 bg-transparent text-richblack-100"
    : "bg-yellow-50 text-richblack-900";
  const classes = `${baseClasses} ${variantClasses} ${customClasses ?? ""}`.trim();
  return (
    <div>
      <button
      disabled={disabled}
      onClick={handleClick}
      type={type}
      className={classes}
      >
           {
            children ? (
            <>
             <span>
                {text}
            </span>
            {children}
            </>
           ) : (text)
        }
      </button>
    </div>
  )
}

export default Iconbtn
