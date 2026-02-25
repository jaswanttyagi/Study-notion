const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = async () => {
    try {
        const connection = await mongoose.connect(process.env.DATABASE_URL, {});
        console.log(`DB connected successfully: ${connection?.connection?.host}`);
    } catch (err) {
        console.log("DB connection failed");
        console.log(err);
        process.exit(1);
    }
}
module.exports = dbConnect;
