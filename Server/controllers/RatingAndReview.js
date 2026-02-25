const RatingAndReviews = require("../models/RatingAndReviews");
const Course = require("../models/Courses");
const User = require("../models/User");
const { default: mongoose } = require("mongoose");

// create rating
exports.createRating = async (req, res) => {
    try {
        //fethc the userId
        const userId = req.user.id;
        // fetch data from the request body
        const { rating, review, courseId } = req.body;
        if (!courseId || rating === undefined || !review) {
            return res.status(400).json({
                success: false,
                message: "courseId, rating and review are required",
            });
        }
        // check if user is enrolled or not
        /* const courseDetails = await Course.findOne(
            {id:courseId,
                studentEnrolled : {$elemMatch : {$eq : userId } },

    }); another mthod to find the courseDetails and we use the simple one*/

        const courseDetails = await Course.findOne({
            _id: courseId,
            studentEnrolled: userId,
        });

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Student is not enrolled in the course",
            });
        }
        // check if user Already enrolled in the course
        // agr koi bhi student with same courseIda and userId se RatingAndReview me present hai which means it already reviewed the course
        const alreadyReviewed = await RatingAndReviews.findOne({
            user: userId,
            course: courseId,
        });
        if (alreadyReviewed) {
            return res.status(403).json({

                success: false,
                message: "Course is already reviewed by the user",
            });
        }
        // create the review
        const Createreview = await RatingAndReviews.create({
            rating: Number(rating),
            review,
            course: courseId,
            user: userId,
        })
        // attach it with the course --> update the course
        await Course.findByIdAndUpdate({ _id: courseId },
            {
                $push: {
                    ratingAndReviews: Createreview._id,  // ratingAndReviews (course ke model me hai)
                },
            },
            { new: true });
        // return response
        return res.status(200).json({
            success: true,
            message: "Rating done successfully",
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}



// get Avergae Rating   --> here we learn Aggerate functions

exports.getAvergaeRating = async (req, res) => {
    try {
        // get courseId 
        const { courseId } = req.body;
        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "courseId is required",
            });
        }
        // calculate the average rating  
        const result = await RatingAndReviews.aggregate([ // aggreagate function return the array
            {
                // step1  --> find match (we perform matching on the basis of courseId)
                $match: {
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                // now we perform grouping 
                $group: {
                    // jb hme pta hi nhi grouping kis basis pr krni hai toh hmne all id ko null mark kr diya
                    _id: null,
                    averageRating: { $avg: "$rating" },  //again for aggregate syntax we can visit the 
                }
            }
        ])

        // return rating
        if (result.length > 0) { // means we got the rating and reviews
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,  // result[0] use hua because aggregate function array return kr rha hai
            })
        }

        // if no rating review exist
        return res.status(200).json({
            success: true,
            averageRating: 0,  // result[0] use hua because aggregate function array return kr rha hai and averageRating toh aggregate ke andar hi hai
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}


// get Allratingandreviews


exports.getAllRating = async (req, res) => {
    try {
        const allReviews = await RatingAndReviews.find({})
            .sort({ rating: "desc" })
            .populate({
                path: "user",
                select: "firstName lastName email image",
            })
            .populate({
                path: "course",
                select: "courseName",
            })
            .exec();
        return res.status(200).json({
            success: true,
            message: "All reviews fetched successfully",
            data: allReviews,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}


// if you want then you can also write the controller for get RatingAndReviews for specific course
