const Course = require("../models/Courses");
const Category = require("../models/category");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const CourseProgress = require("../models/CourseProgress");
const convertSecondsToDuration = require("../utils/convertSecondsToDuration");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
require("dotenv").config();

const parseDurationToSeconds = (rawDuration) => {
  if (rawDuration === undefined || rawDuration === null) return 0
  if (typeof rawDuration === "number") return Number.isFinite(rawDuration) ? rawDuration : 0

  const value = String(rawDuration).trim().toLowerCase()
  if (!value) return 0

  // hh:mm:ss or mm:ss
  if (value.includes(":")) {
    const parts = value.split(":").map((part) => Number.parseInt(part, 10))
    if (parts.some((part) => Number.isNaN(part) || part < 0)) return 0
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
    if (parts.length === 2) return parts[0] * 60 + parts[1]
  }

  // "1h 20m 30s", "90m", "45s"
  const tokenMatches = [...value.matchAll(/(\d+)\s*(h|hr|hrs|hour|hours|m|min|mins|minute|minutes|s|sec|secs|second|seconds)/g)]
  if (tokenMatches.length > 0) {
    return tokenMatches.reduce((total, [, amount, unit]) => {
      const numeric = Number.parseInt(amount, 10)
      if (unit.startsWith("h")) return total + numeric * 3600
      if (unit.startsWith("m")) return total + numeric * 60
      return total + numeric
    }, 0)
  }

  // fallback: raw seconds string
  const seconds = Number.parseInt(value, 10)
  return Number.isNaN(seconds) ? 0 : seconds
}


// create course handler function
exports.createCourse = async (req, res) => {
  try {
    // fetch data from body
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag, // fixed: use `tag` directly
      category,
      status = "Draft", // default value if not provided
      // instructions, // expecting array of strings
    } = req.body;
    //  jb course create hoga toh ye hi names use honge
    // get Thumbnail
    const thumbnail = req.files?.thumbnailImage;

    //     console.log("Body:", req.body);
    // console.log("Files:", req.files);


    if (typeof tag === "string") {
      try {
        const parsedTag = JSON.parse(tag)
        tag = Array.isArray(parsedTag) ? parsedTag : [String(parsedTag)]
      } catch {
        tag = tag
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      }
    }

    // validation
    if (!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !tag || !thumbnail) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // check for instructor
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    if (!instructorDetails) {
      return res.status(400).json({
        success: false,
        message: "Instructor Details not found",
      });
    }

    // check if category exists
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // upload image to cloudinary
    let thumbnailImage;
    try {
      thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      );
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Thumbnail upload failed",
      });
    }

    // create course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      category: categoryDetails._id,
      tag, // fixed: use tag directly
      // instructions,
      status,
      thumbnail: thumbnailImage.secure_url,
    });

    // update instructor courses
    await User.findByIdAndUpdate(
      instructorDetails._id,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    // update category courses
    await Category.findByIdAndUpdate(
      categoryDetails._id,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// Get Course List
exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      { status: "Published" },
      {
        courseName: true,
        courseDescription: true,
        price: true,
        thumbnail: true,
        instructor: true,
        category: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .populate("category")
      .exec()

    return res.status(200).json({
      success: true,
      data: allCourses,
    })
  } catch (error) {
    console.log(error)
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Course Data`,
      error: error.message,
    })
  }
}

// get full courseDetails
exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user.id
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      // .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    console.log("courseProgressCount : ", courseProgressCount)

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseDurationToSeconds(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}


exports.getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.user.id

    const instructorCourses = await Course.find({
      instructor: instructorId,
    })
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
          select: "timeDuration",
        },
      })
      .sort({ createdAt: -1 })
      .lean()

    const coursesWithDuration = instructorCourses.map((course) => {
      const totalDurationInSeconds = (course.courseContent || []).reduce(
        (courseAcc, section) =>
          courseAcc +
          (section.subSection || []).reduce((sectionAcc, subSection) => {
            const seconds = parseDurationToSeconds(subSection.timeDuration)
            return sectionAcc + seconds
          }, 0),
        0
      )

      return {
        ...course,
        totalDuration: convertSecondsToDuration(totalDurationInSeconds),
      }
    })

    res.status(200).json({
      success: true,
      data: coursesWithDuration,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    })
  }
}

exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate({
        path: "ratingAndReviews",
        populate: {
          path: "user",
          select: "firstName lastName image",
        },
      })
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
          select: "videoUrl timeDuration title",
        },
      })
      .exec()

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseDurationToSeconds(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body
    const updates = req.body
    const course = await Course.findById(courseId)

    if (!course) {
      return res.status(404).json({ error: "Course not found" })
    }

    // If Thumbnail Image is found, update it
    if (req.files?.thumbnailImage) {
      const thumbnail = req.files.thumbnailImage
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
      course.thumbnail = thumbnailImage.secure_url
    }

    const parseListField = (value) => {
      if (Array.isArray(value)) return value
      if (typeof value !== "string") return []
      try {
        const parsed = JSON.parse(value)
        return Array.isArray(parsed) ? parsed : [String(parsed)]
      } catch {
        return value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      }
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = parseListField(updates[key])
        } else if (key === "price") {
          course.price = Number(updates[key])
        } else if (key === "whatYouWillLearn") {
          course.whatYouWillLearn = updates[key]
        } else {
          course[key] = updates[key]
        }
      }
    }

    await course.save()

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate({
        path: "ratingAndReviews",
        populate: {
          path: "user",
          select: "firstName lastName image",
        },
      })
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

// Delete the Course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body

    // Find the course
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentEnrolled
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      })
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId)
      if (section) {
        const subSections = section.subSection
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId)
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId)
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}
