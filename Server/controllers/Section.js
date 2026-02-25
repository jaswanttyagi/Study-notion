const Section = require("../models/Section");
const Course = require("../models/Courses");
const SubSection = require("../models/SubSection");
const mongoose = require("mongoose");

// we need the course model because we need to update the course model after create the section

exports.createSection = async(req , res)=>{
    try{
        // data fetch
        const{sectionName , courseId} = req.body;  // mongo db create the courseId automatically in req body when the course is created because section create krne se phle couse bn chuka hoga tbhi tum seection bnane aaye ho 
        // data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"All fileds are required",
            });
        }
        // create section
        const newSection = await Section.create({sectionName});
        // and then update the section in courseschema
        const updateCourseDetails = await Course.findByIdAndUpdate(courseId,
            {
            $push:{
                courseContent:newSection._id,  // yha couse ke model me courseContent ke andar hi section ka array hai hence we are updating here courseContent(it only the name where section array is present)
            },
        },
            {new:true},
      )
            .populate({
              path : "courseContent",
              populate :{path : "subSection"}
            }).exec()
            // TODO || HW: use populate to replace section and sub-section both in the updatecourseDetails 
        
                
        return res.status(200).json({
            success:true,
            message:"section created successfully",
            updateCourseDetails,
        });
    }catch(err){
        return res.status(500).json({
            success:false,
            message:err.message,
        });
    }
}

// NOTE --> course me section ki id pdi hai

exports.updateSection = async(req,res)=>{
    try{
        // data input
        const{sectionName , sectionId , courseId} = req.body;
        // data validate 
        if(!sectionName || !sectionId || !courseId){
            return res.status(400).json({
                success:false,
                message:"Missing properties",
            });
        }
        // update the section 
        await Section.findByIdAndUpdate(sectionId , {sectionName} , {new:true}).exec();
        const updatedCourseDetails = await Course.findById(courseId)
          .populate({
            path: "courseContent",
            populate: { path: "subSection" },
          })
          .exec()

        return res.status(200).json({
            success:true,
            message:"Section updated Successfully",
            updatedCourseDetails,
        });

    }catch(err){
        return res.status(500).json({
            success:false,
            message:err.message,
        });
    }
}

/// DELETE a section
exports.deleteSection = async (req, res) => {
  try {
    const { sectionId, courseId } = req.body

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(sectionId) || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sectionId or courseId",
      })
    }

    // Remove section from course
    await Course.findByIdAndUpdate(courseId, {
      $pull: { courseContent: sectionId },
    })

    // Find section
    const section = await Section.findById(sectionId)
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      })
    }

    // Delete all subsections of this section
    await SubSection.deleteMany({
      _id: { $in: section.subSection },
    })

    // Delete the section itself
    await Section.findByIdAndDelete(sectionId)

    // Return updated course
    const updatedCourse = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: { path: "subSection" }, // nested: get subSections for each section
      })
      .exec()

    res.status(200).json({
      success: true,
      message: "Section deleted successfully",
      data: updatedCourse,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
