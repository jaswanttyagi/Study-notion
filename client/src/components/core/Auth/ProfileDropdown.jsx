import React, { useState, useRef, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { logout } from "../../../services/operations/authAPI"

const ProfileDropdown = () => {
  const { user } = useSelector((state) => state.profile)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  if (!user) return null

  const fallbackImage = `https://api.dicebear.com/5.x/initials/svg?seed=${user.firstName || "User"} ${user.lastName || ""}`
  const imageSrc = user.image || fallbackImage

  useEffect(() => {
    function handleOutsideClick(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [])

  return (
    <div className="relative flex items-center" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <img
          src={imageSrc}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover"
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-10 z-50 w-44 rounded-md border border-richblack-700 bg-richblack-800 p-2 shadow-lg"
          role="menu"
        >
          <button
            type="button"
            className="w-full rounded px-3 py-2 text-left text-sm text-richblack-100 hover:bg-richblack-700"
            onClick={() => {
              setOpen(false)
              navigate("/dashboard/my-profile")
            }}
          >
            Dashboard
          </button>
          <button
            type="button"
            className="w-full rounded px-3 py-2 text-left text-sm text-red-400 hover:bg-richblack-700"
            onClick={() => {
              setOpen(false)
              dispatch(logout(navigate))
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfileDropdown
