import React, { useEffect, useState } from 'react'
import { Link, matchPath } from 'react-router-dom'
import Logo from "../../../../assest/Logo/Logo-Full-Light.png"
import { NavbarLinks } from '../../../../data/navbar-links'
import { useLocation } from 'react-router-dom'
import { useSelector } from "react-redux"
import { AiOutlineShoppingCart } from 'react-icons/ai'
import ProfileDropdown from '../../Auth/ProfileDropdown'
import { IoIosArrowDropdown } from 'react-icons/io'
import { apiConnector } from '../../../../services/apiconnector'
import { courseEndpoints } from '../../../../services/apis'

const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { COURSE_CATEGORIES_API, GET_ALL_COURSE_API } = courseEndpoints

  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)

  const location = useLocation()

  const [subLinks, setSubLinks] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  useEffect(() => {
    const slugify = (value) =>
      String(value || "")
        .toLowerCase()
        .trim()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")

    const parseCategories = (payload) => {
      const responseData = payload?.data

      const candidates = [
        responseData?.data,
        responseData?.allcategorys,
        responseData?.allCategorys,
        responseData?.allCategories,
        responseData?.categories,
        payload?.allcategorys,
        payload?.allCategorys,
        payload?.allCategories,
        payload?.categories,
      ]

      const firstArray = candidates.find((entry) => Array.isArray(entry))
      if (!firstArray) return []

      return firstArray
        .map((item) => {
          if (typeof item === "string") {
            return {
              id: item,
              title: item,
              link: `/catalog/${slugify(item)}`,
            }
          }

          const name = item?.name || item?.title || item?.categoryName || item?.category
          if (!name) return null

          return {
            id: item?._id || item?.id || name,
            title: name,
            link: `/catalog/${slugify(name)}`,
          }
        })
        .filter(Boolean)
    }

    const deriveCategoriesFromCourses = (payload) => {
      const responseData = payload?.data
      const courses = responseData?.data || responseData?.courses || []
      if (!Array.isArray(courses)) return []

      const categoryMap = new Map()
      courses.forEach((course) => {
        const category = course?.category
        if (!category) return

        if (typeof category === "object" && category?.name) {
          const key = category?._id || category?.id || category?.name
          if (!categoryMap.has(key)) {
            categoryMap.set(key, {
              id: key,
              title: category.name,
              link: `/catalog/${slugify(category.name)}`,
            })
          }
          return
        }

        if (typeof category === "string") {
          const key = category
          if (!categoryMap.has(key)) {
            categoryMap.set(key, {
              id: key,
              title: category,
              link: `/catalog/${slugify(category)}`,
            })
          }
        }
      })

      return Array.from(categoryMap.values())
    }

    const requestCategoriesFromApi = async () => {
      const response = await apiConnector("GET", COURSE_CATEGORIES_API)
      return parseCategories(response)
    }

    const fetchCatalogCourseLinks = async () => {
      setCategoriesLoading(true)
      try {
        const categories = await requestCategoriesFromApi()

        if (categories.length > 0) {
          setSubLinks(categories)
          setCategoriesLoading(false)
          return
        }

        // DB fallback: derive category names from courses collection.
        const allCoursesResponse = await apiConnector("GET", GET_ALL_COURSE_API)
        const derived = deriveCategoriesFromCourses(allCoursesResponse)
        setSubLinks(derived)
      } catch (error) {
        console.log("Could not map catalog categories", error)
        setSubLinks([])
      } finally {
        setCategoriesLoading(false)
      }
    }

    fetchCatalogCourseLinks()
  }, [COURSE_CATEGORIES_API, GET_ALL_COURSE_API])

  const matchRoute = (route) => { //route means path
    return matchPath({ path: route }, location.pathname)
  }
  return (
    <div className='flex h-14 max-lg:h-auto items-center justify-center border-b-[1px] border-b-richblack-700'>

      <div className='lg:w-11/12 max-lg:w-11/12 flex justify-between items-center max-w-maxContent max-lg:flex-col max-lg:gap-3 max-lg:py-3'>
        <Link to={"/"}>
          <img width={160} height={42} loading='lazy' src={Logo} alt="Edtech" />
        </Link>

        {/* nav-links */}
        <nav className="max-lg:hidden">
          <ul className='flex gap-x-6 text-richblack-25'>
            {
              NavbarLinks.map((link, index) => (
                <li key={index}>{
                  link.title === "Catalog" ? (
                    <div className='flex justify-center items-center gap-3 group relative'>
                      <p>{link.title}</p>
                      <IoIosArrowDropdown />
                      {/* rectangle shape div */}
                      <div className="invisible absolute left-[50%] top-[50%] z-[1000] w-[220px] translate-x-[-50%] translate-y-[3em] rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[320px]">
                        {/* diamond shape div */}
                        <div className="absolute lg:left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                        {
                          subLinks.length > 0 ? (
                            <div className="grid gap-2">
                              {subLinks.map((sublink) => {
                                const title = sublink?.title ?? "Category"
                                const linkPath = sublink?.link ?? "#"
                                const key = sublink?.id || title
                                return (
                                  <Link
                                    to={linkPath}
                                    key={key}
                                    className="block rounded-md border border-richblack-200 bg-richblack-50 px-3 py-2 text-sm font-medium text-richblack-900 hover:bg-richblack-100"
                                  >
                                    {title}
                                  </Link>
                                )
                              })}
                            </div>
                          ) : categoriesLoading ? (
                            <div className="py-2 text-center text-sm text-richblack-400">Loading...</div>
                          ) : (
                            <div className="py-2 text-center text-sm text-richblack-400">No categories</div>
                          )
                        }
                      </div>


                    </div>
                  ) : (
                    <Link to={link?.path}>
                      <p className={`${matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"}`}>
                        {link.title}
                      </p>
                    </Link>
                  )
                }
                </li>
              ))
            }
          </ul>
        </nav>

        {/* Login/signup/Dashoard */}
        <div className='flex gap-4 items-center max-lg:hidden'>

          {
            user && user?.accountType !== "Instructor" && (
              <Link to="/dashboard/cart" className='text-white relative' >

                <AiOutlineShoppingCart />
                {
                  totalItems > 0 && (
                    <span>
                      {totalItems}
                    </span>
                  )
                }
              </Link>
            )
          }

          {
            token === null && (
              <Link to={"/login"}>
                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">Log in</button>
              </Link>
            )
          }

          {
            token === null && (
              <Link to={"/signup"}>
                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">Sign Up</button>
              </Link>
            )
          }
          {
            token !== null && <ProfileDropdown />
          }

        </div>

        {/* Mobile menu button */}
        <button
          className="hidden max-lg:flex items-center justify-center rounded-md border border-richblack-700 px-3 py-2 text-richblack-100"
          onClick={() => setIsMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {isMobileOpen ? "Close" : "Menu"}
        </button>

      </div>

      {/* Mobile menu */}
      {isMobileOpen && (
        <div className="hidden max-lg:block absolute top-14 left-0 z-50 w-full border-b border-richblack-700 bg-richblack-900">
          <div className="w-11/12 mx-auto py-4 flex flex-col gap-4 text-richblack-25">
            <div className="flex flex-col gap-3">
              {NavbarLinks.map((link, index) => (
                <div key={index}>
                  {link.title === "Catalog" ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <p>{link.title}</p>
                        <IoIosArrowDropdown />
                      </div>
                      <div className="grid gap-2 rounded-lg bg-richblack-800 p-3">
                        {subLinks.length > 0 ? (
                          subLinks.map((sublink) => {
                            const title = sublink?.title ?? "Category"
                            const linkPath = sublink?.link ?? "#"
                            const key = sublink?.id || title
                            return (
                              <Link
                                to={linkPath}
                                key={key}
                                className="block rounded-md bg-richblack-900 px-3 py-2 text-sm font-medium text-richblack-100"
                                onClick={() => setIsMobileOpen(false)}
                              >
                                {title}
                              </Link>
                            )
                          })
                        ) : categoriesLoading ? (
                          <p className="text-sm text-richblack-300">Loading...</p>
                        ) : (
                          <p className="text-sm text-richblack-300">No categories</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Link to={link?.path} onClick={() => setIsMobileOpen(false)}>
                      <p className={`${matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"}`}>
                        {link.title}
                      </p>
                    </Link>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 border-t border-richblack-700 pt-4">
              {user && user?.accountType !== "Instructor" && (
                <Link to="/dashboard/cart" className='text-white relative' onClick={() => setIsMobileOpen(false)}>
                  <div className="flex items-center gap-2">
                    <AiOutlineShoppingCart />
                    <span>Cart</span>
                    {totalItems > 0 && (
                      <span className="ml-1 rounded-full bg-yellow-25 px-2 py-[2px] text-xs text-richblack-900">
                        {totalItems}
                      </span>
                    )}
                  </div>
                </Link>
              )}

              {token === null && (
                <Link to={"/login"} onClick={() => setIsMobileOpen(false)}>
                  <button className="w-full rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                    Log in
                  </button>
                </Link>
              )}

              {token === null && (
                <Link to={"/signup"} onClick={() => setIsMobileOpen(false)}>
                  <button className="w-full rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                    Sign Up
                  </button>
                </Link>
              )}

              {token !== null && (
                <div className="w-fit">
                  <ProfileDropdown />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Navbar
