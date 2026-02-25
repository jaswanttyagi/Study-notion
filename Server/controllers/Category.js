const Category = require("../models/category");

// create a tag handler function

exports.createCategory = async(req , res)=>{
    try{
        // fetch the data of tag
        const{name , description} = req.body;

        // performing the validation
        if(!name){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }
        // create the entry in the database if data is valid
        const CategoryDetails = await Category.create({
            name:name,
            description:description,
        });
        console.log(CategoryDetails);
        // return the response
        return res.status(200).json({
            success:true,
            message:"category created Sucessfully",
        });

    }catch(err){
        return res.status(500).josn({
            success:false,
            message:err.message,
        });
    }
};


// Create the handle to fetch the all tag

exports.showAllcategorys = async(req,res)=>{
    try{
        // we use the find function to fetch all the data from the databse,
        // but we have to ensure the name and description should present in all tag then it is valid only
        const allcategorys = await Category.find({} , {name:true , description:true})
        // return resposne
        return res.status(200).json({
            success:true,
            message:"All Tag Returned Sucessfully",
            allcategorys,
        });
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message,
        });
    }
}



exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body

    // Get courses for the specified category
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "Courses",
        match: { status: "Published" },
        populate: "ratingAndReviews",
      })
      .exec()

    console.log("SELECTED COURSE", selectedCategory)
    // Handle the case when the category is not found
    if (!selectedCategory) {
      console.log("Category not found.")
      return res
        .status(404)
        .json({ success: false, message: "Category not found" })
    }
    // Handle the case when there are no courses
    if (selectedCategory.courses.length === 0) {
      console.log("No courses found for the selected category.")
      return res.status(404).json({
        success: false,
        message: "No courses found for the selected category.",
      })
    }

    // Get courses for other categories
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    })
    let differentCategory = await Category.findOne(
      categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
        ._id
    )
      .populate({
        path: "Courses",
        match: { status: "Published" },
      })
      .exec()
    console.log()
    // Get top-selling courses across all categories
    const allCategories = await Category.find()
      .populate({
        path: "Courses",
        match: { status: "Published" },
      })
      .exec()
    const allCourses = allCategories.flatMap((category) => category.courses)
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10)

    res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}