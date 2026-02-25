import { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { FiArrowRight } from "react-icons/fi"
import { IoBagCheckOutline } from "react-icons/io5"

import RenderCartCourses from "./RenderCartCourses"
import RenderTotalAmount from "./RenderTotalAmount"

export default function Cart() {
  const { cart, totalItems } = useSelector((state) => state.cart)
  const [selectedCourseIds, setSelectedCourseIds] = useState([])
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const cartIds = cart.map((course) => course._id)

    if (!initialized) {
      setSelectedCourseIds(cartIds)
      setInitialized(true)
      return
    }

    setSelectedCourseIds((prev) => {
      const stillPresent = prev.filter((id) => cartIds.includes(id))
      const newlyAdded = cartIds.filter((id) => !prev.includes(id))
      return [...stillPresent, ...newlyAdded]
    })
  }, [cart, initialized])

  const selectedCourses = useMemo(
    () => cart.filter((course) => selectedCourseIds.includes(course._id)),
    [cart, selectedCourseIds]
  )

  const selectedTotal = useMemo(
    () => selectedCourses.reduce((sum, course) => sum + (Number(course?.price) || 0), 0),
    [selectedCourses]
  )

  const toggleCourseSelection = (courseId) => {
    setSelectedCourseIds((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
    )
  }

  const selectAllCourses = () => {
    setSelectedCourseIds(cart.map((course) => course._id))
  }

  const deselectAllCourses = () => {
    setSelectedCourseIds([])
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] text-richblack-5">
      <div className="mb-8 rounded-2xl border border-richblack-700 bg-gradient-to-r from-richblack-800 to-richblack-900 p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">Your Cart</h1>
            <p className="mt-2 text-sm text-richblack-300">Manage selected courses and pay only for what you want.</p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-richblack-700 bg-richblack-800 px-4 py-3">
            <IoBagCheckOutline className="text-xl text-yellow-50" />
            <div>
              <p className="text-xs text-richblack-300">Items in cart</p>
              <p className="text-lg font-semibold text-yellow-50">{totalItems}</p>
            </div>
          </div>
        </div>
      </div>

      {!cart.length ? (
        <div className="grid min-h-[320px] place-items-center rounded-2xl border border-dashed border-richblack-700 bg-richblack-800 p-6 text-center">
          <div>
            <h2 className="text-2xl font-semibold">Your cart is empty</h2>
            <p className="mt-2 text-richblack-300">Browse courses and add them here to continue.</p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-yellow-50 px-5 py-3 font-semibold text-richblack-900"
            >
              Explore Courses <FiArrowRight />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <RenderCartCourses
            selectedCourseIds={selectedCourseIds}
            onToggleSelection={toggleCourseSelection}
            onSelectAll={selectAllCourses}
            onDeselectAll={deselectAllCourses}
          />

          <RenderTotalAmount selectedCourses={selectedCourses} selectedTotal={selectedTotal} />
        </div>
      )}
    </div>
  )
}
