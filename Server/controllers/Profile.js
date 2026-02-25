const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("../models/Courses");
const CourseProgress = require("../models/CourseProgress");
const convertSecondsToDuration = require("../utils/convertSecondsToDuration");
const { uploadImageToCloudinary } = require("../utils/imageUploader")

exports.updateProfile = async (req, res) => {
  try {
    // fetch all data
    const { dateofBirth = "", about = "", gender, contactNumber } = req.body; // dob and about optional hao milega toh thik otherwise we take it as empty
    // get userId --> we take it from auth middleware  :-  req.user = decode kra tha decode me jwt tha jwt me payload and payload me user._id thi
    const userId = req.user.id;

    // validation
    if (!contactNumber || !gender) {
      return res.status(400).json({
        success: false,
        message: "Alll fields are required",
      });
    }
    // find profile 
    const userDetails = await User.findById(userId);
    //  ab hame user ki detials me se profile id mil skti hai (jo hmne Auth.js me signup case me profileDetails ko null null kiya tha)
    const profileId = userDetails.additionalDetails;
    //  now we can bring the whole profiledata because now we have profileId
    // const profileDetails = await Profile.findById(profileId);   --> (optional)

    await Profile.findByIdAndUpdate(
      profileId,
      {
        dateofBirth,
        gender,
        contactNumber,
        about,
      },
      { new: true }
    );
    const updatedUserDetails = await User.findById(userId)
      .populate("additionalDetails")
      .exec()

    /* const updatedUser = await User.findById(userId)
.populate("additionalDetails")
// .exec();   */  //this use for return / to show the profike data in postman but for prefer only for testing not good at production level

    /* update profile(another method)

profileDetails.dateofBirth = dateofBirth;
profileDetails.gender = gender;
profileDetails.contactNumber = contactNumber;
profileDetails.about = about;
await profileDetails.save(); // this save the profileDetails in the database

// it is the another method to update the profile because object of  profile is already cerated (by null previously)
//previous method to update the profile 
*/
    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      updatedUserDetails,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

exports.deleteAccount = async (req, res) => {
  try {
    // get Id
    const userId = req.user.id;
    // validation
    const userDetails = await User.findById(userId);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }
    // delete profile
    await Profile.findByIdAndDelete(userDetails.additionalDetails);

    // delete user
    await User.findByIdAndDelete(userId);
    // TODO||HW : how to uneroll user from all unerolled courses 
    // TODO||HW : how to schedule the delete request let user delete the account but we dont allow to delete immidaitely we perform deletion after 3days --> find this method how we can do this 
    // HW : find chronjob


    // return response
    return res.status(200).json({
      success: true,
      message: "Account Deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}


//  optional--> getHandler funtion to knowledge

exports.getAllUserDetails = async (req, res) => {
  try {
    // get userDteails
    const userId = req.user.id;
    // validation
    const userDetails = await User.findById(userId)
      .select("firstName lastName email image accountType additionalDetails")
      .populate("additionalDetails")
      .exec();
    // why we populate here because user me profile ki id hogi profile ka data nhi ==> additionalDetails me profile ka refrence tha toh profile data ko fetch krne ke liye hmne popute kr diya ans.
    return res.status(200).json({
      success: true,
      message: "Profile Data Fetched Successfully",
      data: userDetails,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: userDetails,
    });
  }
}





// provided by BHAIYA needs to understand

exports.updateDisplayPicture = async (req, res) => {
  try {
    if (!req.files || !req.files.displayPicture) {
      return res.status(400).json({
        success: false,
        message: "Display picture file is required",
      })
    }
    const displayPicture = req.files.displayPicture
    const userId = req.user.id
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    )
    console.log(image)
    const updatedUserDetails = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    )
      .populate("additionalDetails")
      .exec()
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedUserDetails,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id
    const userDetailsDoc = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec()

    if (!userDetailsDoc) {
      return res.status(404).json({
        success: false,
        message: `Could not find user with id: ${userId}`,
      })
    }

    const userDetails = userDetailsDoc.toObject()
    userDetails.courses = Array.isArray(userDetails.courses) ? userDetails.courses : []

    const enrolledCourseIds = userDetails.courses.map((course) => course?._id).filter(Boolean)
    const progressDocs = await CourseProgress.find({
      userId,
      courseID: { $in: enrolledCourseIds },
    })
      .select("courseID completedVideos")
      .lean()

    const progressByCourseId = new Map(
      progressDocs.map((doc) => [String(doc.courseID), Array.isArray(doc.completedVideos) ? doc.completedVideos.length : 0])
    )

    var SubsectionLength = 0
    for (var i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0
      SubsectionLength = 0
      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        const subSections = Array.isArray(userDetails.courses[i].courseContent[j].subSection)
          ? userDetails.courses[i].courseContent[j].subSection
          : []
        totalDurationInSeconds += subSections.reduce(
          (acc, curr) => acc + (Number.parseInt(curr.timeDuration, 10) || 0),
          0
        )
        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
        )
        SubsectionLength += subSections.length
      }
      const courseProgressCount =
        progressByCourseId.get(String(userDetails.courses[i]._id)) || 0
      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2)
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier
          ) / multiplier
      }
    }

    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id })

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = Array.isArray(course.studentEnrolled)
        ? course.studentEnrolled.length
        : 0
      const totalAmountGenerated = totalStudentsEnrolled * course.price

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      }

      return courseDataWithStats
    })

    res.status(200).json({ courses: courseData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}
