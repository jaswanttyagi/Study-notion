const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = async () => {
    try {
        const connection = await mongoose.connect(process.env.DATABASE_URL, {
            maxPoolSize: 10,
            minPoolSize: 2,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000,
        });
        console.log(`DB connected successfully: ${connection?.connection?.host}`);
    } catch (err) {
        console.log("DB connection failed");
        console.log(err);
        process.exit(1);
    }
}
module.exports = dbConnect;
