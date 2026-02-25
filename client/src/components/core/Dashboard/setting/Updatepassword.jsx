import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { FiKey } from "react-icons/fi"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { changePassword } from "../../../../services/operations/settingAPI"
import IconBtn from "../../../core/HomePage/common/Iconbtn"

export default function Updatepassword() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const submitPasswordForm = async (data) => {
    try {
      await changePassword(token, data)
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(submitPasswordForm)}
      className="group relative rounded-3xl border border-cyan-300/20 bg-[linear-gradient(160deg,rgba(15,23,42,0.95),rgba(17,24,39,0.92))] p-[1px] shadow-[0_28px_70px_-45px_rgba(34,211,238,0.7)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_36px_90px_-45px_rgba(34,211,238,0.9)]"
    >
      <div className="rounded-3xl border border-richblack-700/80 bg-richblack-900/90 p-5 backdrop-blur-sm sm:p-6">
        <div className="mb-6 flex items-center gap-2 text-lg font-semibold">
          <FiKey className="text-cyan-100" />
          <h2>Security Credentials</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="relative rounded-xl border border-richblack-700 bg-richblack-900/70 p-3 transition-all duration-300 hover:border-cyan-200/40">
            <label htmlFor="oldPassword" className="text-xs uppercase tracking-widest text-richblack-300">Current Password</label>
            <input
              type={showOldPassword ? "text" : "password"}
              id="oldPassword"
              placeholder="Enter current password"
              className="form-style mt-2 w-full"
              {...register("oldPassword", { required: true })}
            />
            <span
              onClick={() => setShowOldPassword((prev) => !prev)}
              className="absolute right-6 top-[40px] z-[10] cursor-pointer"
            >
              {showOldPassword ? (
                <AiOutlineEyeInvisible fontSize={22} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={22} fill="#AFB2BF" />
              )}
            </span>
            {errors.oldPassword && (
              <span className="mt-1 block text-xs text-yellow-100">Please enter your current password.</span>
            )}
          </div>

          <div className="relative rounded-xl border border-richblack-700 bg-richblack-900/70 p-3 transition-all duration-300 hover:border-cyan-200/40">
            <label htmlFor="newPassword" className="text-xs uppercase tracking-widest text-richblack-300">New Password</label>
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              placeholder="Enter new password"
              className="form-style mt-2 w-full"
              {...register("newPassword", { required: true })}
            />
            <span
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-6 top-[40px] z-[10] cursor-pointer"
            >
              {showNewPassword ? (
                <AiOutlineEyeInvisible fontSize={22} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={22} fill="#AFB2BF" />
              )}
            </span>
            {errors.newPassword && (
              <span className="mt-1 block text-xs text-yellow-100">Please enter your new password.</span>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/dashboard/my-profile")}
            className="rounded-md border border-richblack-600 bg-richblack-700 py-2 px-5 font-semibold text-richblack-50 transition-all hover:border-cyan-200/40 hover:text-cyan-100"
          >
            Cancel
          </button>
          <IconBtn type="submit" text="Update Password" customClasses="justify-center" />
        </div>
      </div>
    </form>
  )
}
