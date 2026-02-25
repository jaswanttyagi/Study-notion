import React from "react"
import { RiEditBoxLine } from "react-icons/ri"
import { FiMail, FiPhone, FiUser, FiCalendar, FiShield } from "react-icons/fi"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { formattedDate } from "../../../utils/formattedDate"
import IconBtn from "../../core/HomePage/common/Iconbtn"

const DetailCard = ({ icon, label, value }) => (
  <div className="rounded-xl border border-richblack-700 bg-richblack-900/60 p-4">
    <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide text-richblack-400">
      <span className="text-sm text-yellow-50">{icon}</span>
      <span>{label}</span>
    </div>
    <p className="text-sm font-medium text-richblack-5">{value}</p>
  </div>
)

const MyProfile = () => {
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()

  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Learner"
  const accountType = user?.accountType || "User"
  const memberSince = user?.createdAt ? formattedDate(user.createdAt) : "N/A"
  const about = user?.additionalDetails?.about?.trim() || "Tell learners about yourself from profile settings."
  const dobRaw = user?.additionalDetails?.dateOfBirth
  const dob = dobRaw ? formattedDate(dobRaw) : "Add Date of Birth"

  return (
    <div className="mx-auto w-full max-w-[1100px] space-y-6 text-richblack-5">
      <div className="relative overflow-hidden rounded-2xl border border-richblack-700 bg-gradient-to-r from-richblack-800 via-richblack-800 to-richblack-900 p-5 sm:p-7">
        <div className="pointer-events-none absolute -top-16 right-[-80px] h-52 w-52 rounded-full bg-yellow-50/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4 sm:gap-5">
            <img
              src={user?.image}
              alt={fullName}
              className="h-20 w-20 rounded-full border-2 border-richblack-600 object-cover sm:h-24 sm:w-24"
            />
            <div>
              <p className="text-2xl font-semibold sm:text-3xl">{fullName}</p>
              <p className="mt-1 flex items-center gap-2 text-sm text-richblack-300">
                <FiMail /> {user?.email || "No email"}
              </p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-yellow-100/40 bg-yellow-100/10 px-3 py-1 text-xs font-medium text-yellow-50">
                <FiShield /> {accountType}
              </div>
            </div>
          </div>

          <IconBtn
            text="Edit Profile"
            onClick={() => navigate("/dashboard/settings")}
            customClasses="justify-center"
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DetailCard icon={<FiUser />} label="Full Name" value={fullName} />
        <DetailCard icon={<FiShield />} label="Account Type" value={accountType} />
        <DetailCard icon={<FiCalendar />} label="Member Since" value={memberSince} />
      </div>

      <div className="rounded-2xl border border-richblack-700 bg-richblack-800 p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold sm:text-xl">About</h2>
          <button
            onClick={() => navigate("/dashboard/settings")}
            className="inline-flex items-center gap-2 rounded-md border border-richblack-600 px-3 py-1.5 text-sm text-richblack-100 transition-all hover:border-yellow-100 hover:text-yellow-50"
          >
            <RiEditBoxLine /> Edit
          </button>
        </div>
        <p className="whitespace-pre-wrap text-sm leading-6 text-richblack-100">{about}</p>
      </div>

      <div className="rounded-2xl border border-richblack-700 bg-richblack-800 p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold sm:text-xl">Personal Details</h2>
          <button
            onClick={() => navigate("/dashboard/settings")}
            className="inline-flex items-center gap-2 rounded-md border border-richblack-600 px-3 py-1.5 text-sm text-richblack-100 transition-all hover:border-yellow-100 hover:text-yellow-50"
          >
            <RiEditBoxLine /> Edit
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <DetailCard icon={<FiUser />} label="First Name" value={user?.firstName || "N/A"} />
          <DetailCard icon={<FiUser />} label="Last Name" value={user?.lastName || "N/A"} />
          <DetailCard icon={<FiMail />} label="Email" value={user?.email || "N/A"} />
          <DetailCard
            icon={<FiPhone />}
            label="Phone Number"
            value={user?.additionalDetails?.contactNumber || "Add Contact Number"}
          />
          <DetailCard
            icon={<FiUser />}
            label="Gender"
            value={user?.additionalDetails?.gender || "Add Gender"}
          />
          <DetailCard icon={<FiCalendar />} label="Date Of Birth" value={dob} />
        </div>
      </div>
    </div>
  )
}

export default MyProfile
