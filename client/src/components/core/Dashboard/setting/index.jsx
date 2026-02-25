import React from "react"
import { FiCpu, FiSettings } from "react-icons/fi"

import UpdatePassword from "./Updatepassword"
import ChangeProfilePicture from "./ChangeProfilePicture"
import EditProfile from "./EditProfile"
import Deleteaccount from "./Deleteaccount"

const Setting = () => {
  return (
    <div className="relative mx-auto w-full max-w-[1120px] space-y-6 text-richblack-5">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-3xl">
        <div className="absolute -left-20 top-8 h-60 w-60 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-yellow-200/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-cyan-300/30 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.16),transparent_55%),radial-gradient(circle_at_80%_0%,rgba(250,204,21,0.14),transparent_45%),linear-gradient(135deg,#0b1220,#111827,#0f172a)] p-6 shadow-[0_24px_70px_-40px_rgba(34,211,238,0.6)] sm:p-8">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full border border-cyan-300/20" />
        <div className="absolute -bottom-16 -left-16 h-52 w-52 rounded-full border border-yellow-100/20" />

        <div className="relative flex flex-wrap items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-cyan-100">
              <FiCpu /> Robotics Console
            </div>
            <h1 className="text-3xl font-bold sm:text-4xl">Account Control Center</h1>
            <p className="max-w-2xl text-sm leading-6 text-richblack-200 sm:text-base">
              Configure your identity, security, and account behavior in a futuristic command surface.
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-200/30 bg-richblack-900/70 p-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-cyan-300/30 bg-cyan-400/10 p-3 text-cyan-100">
                <FiSettings className="text-xl" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-richblack-300">Mode</p>
                <p className="font-semibold text-yellow-50">Cyber Configuration</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ChangeProfilePicture />
      <EditProfile />
      <UpdatePassword />
      <Deleteaccount />
    </div>
  )
}

export default Setting
