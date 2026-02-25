import { useForm } from "react-hook-form"
import { FiUser, FiPhone, FiCalendar, FiInfo, FiEdit3 } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { updateProfile } from "../../../../services/operations/settingAPI"
import IconBtn from "../../../core/HomePage/common/Iconbtn"

const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"]

const FieldShell = ({ icon, children }) => (
  <div className="rounded-xl border border-richblack-700 bg-richblack-900/70 p-3 transition-all duration-300 hover:border-cyan-200/40 hover:shadow-[0_16px_40px_-24px_rgba(34,211,238,0.8)]">
    <div className="mb-2 text-cyan-100">{icon}</div>
    {children}
  </div>
)

export default function EditProfile() {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const submitProfileForm = async (data) => {
    dispatch(updateProfile(token, data))
  }

  return (
    <form
      onSubmit={handleSubmit(submitProfileForm)}
      className="group relative rounded-3xl border border-cyan-300/20 bg-[linear-gradient(160deg,rgba(15,23,42,0.95),rgba(17,24,39,0.92))] p-[1px] shadow-[0_28px_70px_-45px_rgba(34,211,238,0.7)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_36px_90px_-45px_rgba(34,211,238,0.9)]"
    >
      <div className="rounded-3xl border border-richblack-700/80 bg-richblack-900/90 p-5 backdrop-blur-sm sm:p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <FiEdit3 className="text-cyan-100" />
            <h2>Profile Core Data</h2>
          </div>
          <span className="rounded-full border border-cyan-200/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100">
            Editable Fields
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FieldShell icon={<FiUser />}>
            <label htmlFor="firstName" className="text-xs uppercase tracking-widest text-richblack-300">First Name</label>
            <input
              type="text"
              id="firstName"
              placeholder="Enter first name"
              className="form-style mt-2 w-full"
              {...register("firstName", { required: true })}
              defaultValue={user?.firstName}
            />
            {errors.firstName && <span className="mt-1 text-xs text-yellow-100">Please enter your first name.</span>}
          </FieldShell>

          <FieldShell icon={<FiUser />}>
            <label htmlFor="lastName" className="text-xs uppercase tracking-widest text-richblack-300">Last Name</label>
            <input
              type="text"
              id="lastName"
              placeholder="Enter last name"
              className="form-style mt-2 w-full"
              {...register("lastName", { required: true })}
              defaultValue={user?.lastName}
            />
            {errors.lastName && <span className="mt-1 text-xs text-yellow-100">Please enter your last name.</span>}
          </FieldShell>

          <FieldShell icon={<FiCalendar />}>
            <label htmlFor="dateOfBirth" className="text-xs uppercase tracking-widest text-richblack-300">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              className="form-style mt-2 w-full"
              {...register("dateOfBirth", {
                required: { value: true, message: "Please enter your Date of Birth." },
                max: { value: new Date().toISOString().split("T")[0], message: "Date of Birth cannot be in the future." },
              })}
              defaultValue={user?.additionalDetails?.dateOfBirth}
            />
            {errors.dateOfBirth && <span className="mt-1 text-xs text-yellow-100">{errors.dateOfBirth.message}</span>}
          </FieldShell>

          <FieldShell icon={<FiUser />}>
            <label htmlFor="gender" className="text-xs uppercase tracking-widest text-richblack-300">Gender</label>
            <select
              id="gender"
              className="form-style mt-2 w-full"
              {...register("gender", { required: true })}
              defaultValue={user?.additionalDetails?.gender}
            >
              {genders.map((ele, i) => (
                <option key={i} value={ele}>{ele}</option>
              ))}
            </select>
            {errors.gender && <span className="mt-1 text-xs text-yellow-100">Please select your gender.</span>}
          </FieldShell>

          <FieldShell icon={<FiPhone />}>
            <label htmlFor="contactNumber" className="text-xs uppercase tracking-widest text-richblack-300">Contact Number</label>
            <input
              type="tel"
              id="contactNumber"
              placeholder="Enter contact number"
              className="form-style mt-2 w-full"
              {...register("contactNumber", {
                required: { value: true, message: "Please enter your Contact Number." },
                maxLength: { value: 12, message: "Invalid Contact Number" },
                minLength: { value: 10, message: "Invalid Contact Number" },
              })}
              defaultValue={user?.additionalDetails?.contactNumber}
            />
            {errors.contactNumber && <span className="mt-1 text-xs text-yellow-100">{errors.contactNumber.message}</span>}
          </FieldShell>

          <FieldShell icon={<FiInfo />}>
            <label htmlFor="about" className="text-xs uppercase tracking-widest text-richblack-300">About</label>
            <textarea
              id="about"
              placeholder="Write a short bio"
              className="form-style mt-2 min-h-[44px] w-full resize-y"
              {...register("about", { required: true })}
              defaultValue={user?.additionalDetails?.about}
            />
            {errors.about && <span className="mt-1 text-xs text-yellow-100">Please enter your About.</span>}
          </FieldShell>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/dashboard/my-profile")}
            className="rounded-md border border-richblack-600 bg-richblack-700 py-2 px-5 font-semibold text-richblack-50 transition-all hover:border-cyan-200/40 hover:text-cyan-100"
          >
            Cancel
          </button>
          <IconBtn type="submit" text="Save Changes" customClasses="justify-center" />
        </div>
      </div>
    </form>
  )
}
