const mailSender = require("../utils/mailSender");
const mongoose = require("mongoose")
const OtpSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
    },
    otp : {
        type : String,
        required : true,
    },
    createdAt : {
        type : Date,
        default : Date.now,
        expires : 5*60,
    }
});

// a function to send mail

/* async function sendVerificationEmail(email , otp){
    try{
        const mailResponse = await mailSender(email , "Verification Mail From Edtech-Notion" , otp);
        console.log("Email Sent Successfully" , mailResponse);

    }catch(err){
        console.log("Error Occured While Sending Mails" , err);
        throw err;
    }
}

OtpSchema.pre("save" , async function(next){
    await sendVerificationEmail(this.email , this.otp);
    next(); 
})  */

module.exports = mongoose.model("OTP" , OtpSchema);
