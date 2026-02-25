import { FiAlertTriangle, FiTrash2 } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { deleteProfile } from "../../../../services/operations/settingAPI"

export default function Deleteaccount() {
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  async function handleDeleteAccount() {
    try {
      dispatch(deleteProfile(token, navigate))
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-pink-500/40 bg-[radial-gradient(circle_at_20%_20%,rgba(236,72,153,0.18),transparent_50%),linear-gradient(140deg,rgba(65,3,31,0.85),rgba(17,24,39,0.96))] p-5 shadow-[0_26px_70px_-40px_rgba(244,114,182,0.7)] sm:p-6">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-pink-300/20" />
      <div className="absolute -bottom-10 -left-8 h-36 w-36 rounded-full border border-pink-300/20" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-pink-400/60 bg-pink-600/25">
          <FiTrash2 className="text-2xl text-pink-200" />
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <FiAlertTriangle className="text-pink-200" />
            <h2 className="text-lg font-semibold text-richblack-5">Danger Zone: Delete Account</h2>
          </div>

          <p className="max-w-2xl text-sm leading-6 text-pink-100">
            This is a permanent command. Deleting the account removes profile data, enrolled courses, progress history, and connected resources.
          </p>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-pink-400 bg-pink-500/20 px-4 py-2 text-sm font-semibold text-pink-100 transition-all hover:bg-pink-500/30"
            onClick={handleDeleteAccount}
          >
            <FiTrash2 />
            Execute Account Deletion
          </button>
        </div>
      </div>
    </div>
  )
}
