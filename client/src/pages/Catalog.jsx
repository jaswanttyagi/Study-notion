import React, { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"

import Footer from "../components/core/HomePage/common/Footer"
import RatingStars from "../components/core/HomePage/common/RatingStars"
import GetAvgRating from "../utils/Avgrating"
import { fetchCourseCategories, getAllCourses } from "../services/operations/courseDetailsAPI"

function Catalog() {
  const { catalogName } = useParams()
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [courses, setCourses] = useState([])

  const slugify = (value) =>
    String(value || "")
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")

  useEffect(() => {
    const loadCatalogData = async () => {
      setLoading(true)
      const [categoryData, courseData] = await Promise.all([
        fetchCourseCategories(),
        getAllCourses(),
      ])
      setCategories(Array.isArray(categoryData) ? categoryData : [])
      setCourses(Array.isArray(courseData) ? courseData : [])
      setLoading(false)
    }

    loadCatalogData()
  }, [])

  const selectedCategory = useMemo(() => {
    const currentSlug = slugify(catalogName)
    return categories.find((item) => slugify(item?.name) === currentSlug)
  }, [categories, catalogName])

  const filteredCourses = useMemo(() => {
    if (!selectedCategory) return []

    return courses.filter((course) => {
      const category = course?.category
      if (!category) return false

      if (typeof category === "string") {
        return category === selectedCategory?._id
      }

      if (category?._id === selectedCategory?._id) return true

      // Fallback match by category name slug when backend returns partial category data.
      return slugify(category?.name) === slugify(selectedCategory?.name)
    })
  }, [courses, selectedCategory])

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <>
      <div className="w-full bg-richblack-800 text-white">
        <div className="mx-auto w-11/12 max-w-maxContent py-10">
          <p className="text-sm text-richblack-300">Home / Catalog / {selectedCategory?.name || "Category"}</p>
          <h1 className="mt-3 text-3xl font-semibold">{selectedCategory?.name || "Catalog"}</h1>

          <div className="mt-6 flex flex-wrap gap-3">
            {categories.map((item) => (
              <Link
                key={item?._id}
                to={`/catalog/${slugify(item?.name)}`}
                className={`rounded-full border px-4 py-2 text-sm ${
                  item?._id === selectedCategory?._id
                    ? "border-yellow-50 bg-yellow-50 text-richblack-900"
                    : "border-richblack-600 bg-richblack-700 text-richblack-25"
                }`}
              >
                {item?.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto w-11/12 max-w-maxContent py-10 text-white">
        <h2 className="text-2xl font-semibold">
          Courses in {selectedCategory?.name || "this category"} ({filteredCourses.length})
        </h2>

        {filteredCourses.length === 0 ? (
          <p className="mt-4 text-richblack-300">No courses found in this category.</p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => {
              const avgRating = GetAvgRating(course?.ratingAndReviews)
              return (
                <Link
                  to={`/courses/${course?._id}`}
                  key={course?._id}
                  className="overflow-hidden rounded-lg border border-richblack-700 bg-richblack-800 transition hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(0,0,0,0.35)]"
                >
                  <img src={course?.thumbnail} alt={course?.courseName} className="h-44 w-full object-cover" />
                  <div className="space-y-3 p-4">
                    <h3 className="line-clamp-1 text-lg font-semibold">{course?.courseName}</h3>
                    <p className="line-clamp-2 text-sm text-richblack-300">{course?.courseDescription}</p>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-yellow-50">{avgRating}</span>
                      <RatingStars Review_Count={avgRating} Star_Size={16} />
                      <span className="text-xs text-richblack-300">({course?.ratingAndReviews?.length || 0})</span>
                    </div>
                    <p className="text-xl font-semibold text-yellow-50">Rs. {course?.price}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      <Footer />
    </>
  )
}

export default Catalog
