import { useEffect, useRef, useState } from "react"
import { FiUpload, FiImage, FiAperture } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"

import { updateDisplayPicture } from "../../../../services/operations/settingAPI"
import IconBtn from "../../../core/HomePage/common/Iconbtn"

export default function ChangeProfilePicture() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(null)

  const fileInputRef = useRef(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      previewFile(file)
    }
  }

  const previewFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPreviewSource(reader.result)
    }
  }

  const handleFileUpload = () => {
    if (!imageFile) {
      fileInputRef.current?.click()
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append("displayPicture", imageFile)

    dispatch(updateDisplayPicture(token, formData)).finally(() => {
      setLoading(false)
    })
  }

  useEffect(() => {
    if (imageFile) {
      previewFile(imageFile)
    }
  }, [imageFile])

  return (
    <div className="group relative rounded-3xl border border-cyan-300/20 bg-[linear-gradient(160deg,rgba(15,23,42,0.95),rgba(17,24,39,0.92))] p-[1px] shadow-[0_28px_70px_-45px_rgba(34,211,238,0.7)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_36px_90px_-45px_rgba(34,211,238,0.9)]">
      <div className="rounded-3xl border border-richblack-700/80 bg-richblack-900/90 p-5 backdrop-blur-sm sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <FiImage className="text-cyan-100" />
            <h2>Avatar Matrix</h2>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100">
            <FiAperture /> Visual Identity
          </span>
        </div>

        <div className="grid gap-5 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <div className="relative">
            <div className="absolute -inset-2 rounded-full border border-cyan-300/30" />
            <img
              src={previewSource || user?.image}
              alt={`profile-${user?.firstName || "user"}`}
              className="relative h-24 w-24 rounded-full border-2 border-richblack-600 object-cover sm:h-28 sm:w-28"
            />
          </div>

          <div>
            <p className="font-medium text-richblack-5">Upload a new profile hologram</p>
            <p className="mt-1 text-sm text-richblack-300">Supported formats: PNG, JPG, GIF. Best ratio: 1:1.</p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/gif, image/jpeg"
            />
            <button
              onClick={handleClick}
              disabled={loading}
              className="rounded-md border border-richblack-600 bg-richblack-700 py-2 px-4 text-sm font-semibold text-richblack-50 transition-all hover:border-cyan-200/50 hover:text-cyan-100"
            >
              Select Image
            </button>
            <IconBtn text={loading ? "Uploading..." : "Upload"} onClick={handleFileUpload}>
              {!loading && <FiUpload className="text-lg text-richblack-900" />}
            </IconBtn>
          </div>
        </div>
      </div>
    </div>
  )
}
