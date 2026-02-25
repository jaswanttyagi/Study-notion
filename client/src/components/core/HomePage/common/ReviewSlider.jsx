import React, { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"

import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import "../../../../App.css"

import { Autoplay, FreeMode, Pagination } from "swiper/modules"

import { apiConnector } from "../../../../services/apiconnector"
import { ratingsEndpoints } from "../../../../services/apis"
import RatingStars from "./RatingStars"

function ReviewSlider() {
  const [reviews, setReviews] = useState([])
  const truncateWords = 15

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await apiConnector("GET", ratingsEndpoints.REVIEWS_DETAILS_API)
        if (data?.success) {
          setReviews(Array.isArray(data?.data) ? data.data : [])
        } else {
          setReviews([])
        }
      } catch (error) {
        console.log("Could not fetch reviews", error)
        setReviews([])
      }
    })()
  }, [])

  if (!reviews.length) {
    return (
      <div className="my-10 text-center text-richblack-300">
        Reviews will appear here soon.
      </div>
    )
  }

  return (
    <div className="w-full text-white">
      <div className="my-[40px] w-full">
        <Swiper
          slidesPerView={1}
          spaceBetween={16}
          loop={true}
          freeMode={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 18,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 25,
            },
          }}
          modules={[FreeMode, Pagination, Autoplay]}
          className="w-full"
        >
          {reviews.map((review, i) => {
            const reviewText = review?.review || ""
            const rating = Number(review?.rating) || 0
            return (
              <SwiperSlide key={review?._id || i}>
                <div className="flex min-h-[190px] flex-col gap-3 bg-richblack-800 p-3 text-[14px] text-richblack-25">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        review?.user?.image
                          ? review.user.image
                          : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName || "User"} ${review?.user?.lastName || ""}`
                      }
                      alt="Reviewer"
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <h1 className="font-semibold text-richblack-5">{`${review?.user?.firstName || ""} ${review?.user?.lastName || ""}`.trim() || "Learner"}</h1>
                      <h2 className="text-[12px] font-medium text-richblack-500">
                        {review?.course?.courseName || "Course"}
                      </h2>
                    </div>
                  </div>

                  <p className="font-medium text-richblack-25">
                    {reviewText.split(" ").length > truncateWords
                      ? `${reviewText.split(" ").slice(0, truncateWords).join(" ")} ...`
                      : reviewText}
                  </p>

                  <div className="mt-auto flex items-center gap-2">
                    <h3 className="font-semibold text-yellow-100">{rating.toFixed(1)}</h3>
                    <RatingStars Review_Count={rating} Star_Size={18} />
                  </div>
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
    </div>
  )
}

export default ReviewSlider
