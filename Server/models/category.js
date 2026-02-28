const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name : {
        type:String,
        required : true,
    },
    description : {
    type:String,    
    },
    courses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref : "Courses",  // ye jha bhi ref dete vha objectId rkhte hai ham
    }],
});



module.exports = mongoose.model("Category" , categorySchema);
