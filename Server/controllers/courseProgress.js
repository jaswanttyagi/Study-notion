const SubSection = require("../models/SubSection")
const CourseProgress = require("../models/CourseProgress")
const User = require("../models/User")

exports.updateCourseProgress = async (req, res) => {
  const { courseId, subsectionId } = req.body
  const userId = req.user.id

  try {
    // Check if the subsection is valid
    const subsection = await SubSection.findById(subsectionId)
    if (!subsection) {
      return res.status(404).json({ error: "Invalid subsection" })
    }

    // Ensure progress doc exists and update once (no duplicates)
    const courseProgress = await CourseProgress.findOneAndUpdate(
      { courseID: courseId, userId: userId },
      {
        $setOnInsert: { courseID: courseId, userId: userId },
        $addToSet: { completedVideos: subsectionId },
      },
      { upsert: true, new: true }
    )

    await User.findByIdAndUpdate(userId, {
      $addToSet: { courseProgress: courseProgress._id },
    })

    return res.status(200).json({
      success: true,
      message: "Course progress updated",
      completedVideos: courseProgress.completedVideos,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}
