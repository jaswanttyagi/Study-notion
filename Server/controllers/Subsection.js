const Section = require("../models/Section");
const Subsection = require("../models/SubSection");
// const{uploadImageToCloudinary} = require("../utils/imageUploader");
const {uploadVideoToCloudinary} = require("../utils/uploadVideoToCloudinary ");
require("dotenv").config();

exports.createSubsection = async (req, res) => {
    try {
        // fetch data from the request body
        const { sectionId, title, description, timeduration, timeDuration } = req.body;
        // sectionId hm khud se send kr rhe honge
        // extract file/video
        const video = req.files?.videofile || req.files?.video;// accept both keys for compatibility
        const duration = timeduration || timeDuration;
        // validate data
        if (!sectionId || !title || !description || !duration || !video) {
            return res.status(400).json({
                success: false,
                message: "All feilds are required",
            });
        }
        // upload file to cloudinary(when we need videourl to save in the database) --> when we upload any file to the any media platfom then in resposne it return a secure_url that we use to store in database
        const uploadDetails = await uploadVideoToCloudinary(video, process.env.FOLDER_NAME);  //now as response i can access the secure_url through uploadDetails

        // create subsection
        const subSectionDetails = await Subsection.create({
            title: title,
            description: description,
            timeDuration: duration,
            videoUrl: uploadDetails.secure_url,
            section: sectionId,   // optional but recommended (reference back)
        });

        // push subsection id into Section (means adding the subsection into the section)
        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            {
                $push: {
                    subSection: subSectionDetails._id,
                },
            },
            { new: true }
        ).populate("subSection");

        // return response
        return res.status(200).json({
            success:true,
            message:"SubSection created Successfully",
            updatedSection
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

// update subsection   --> chatgpt se likhwaya hai need to check if not run
exports.updateSubsection = async (req, res) => {
    try {
        // fetch data from request body
        const { subSectionId, newtitle, newdescription } = req.body;

        // validate required field
        if (!subSectionId) {
            return res.status(400).json({
                success: false,
                message: "subSectionId is required",
            });
        }

        // update subsection
        const updatedSubSection = await Subsection.findByIdAndUpdate(
            subSectionId,
            {
                title: newtitle,
                description: newdescription,
            },
            { new: true }
        );

        // check if subsection exists
        if (!updatedSubSection) {
            return res.status(404).json({
                success: false,
                message: "Subsection not found",
            });
        }

        // success response
        return res.status(200).json({
            success: true,
            message: "Subsection Updated Successfully",
            data: updatedSubSection,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};



exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;

    const subSection = await Subsection.findById(subSectionId);
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $pull: { subSection: subSectionId } },
      { new: true }
    ).populate("subSection");

    await Subsection.findByIdAndDelete(subSectionId);

    return res.status(200).json({
      success: true,
      message: "SubSection deleted successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

