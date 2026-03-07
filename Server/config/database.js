const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = async () => {
    const databaseUrl = (process.env.DATABASE_URL || "").trim();
    if (!databaseUrl) {
        const error = new Error("DATABASE_URL is missing");
        error.code = "DATABASE_URL_MISSING";
        throw error;
    }

    try {
        const connection = await mongoose.connect(databaseUrl, {
            maxPoolSize: 10,
            minPoolSize: 2,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000,
        });
        console.log(`DB connected successfully: ${connection?.connection?.host}`);
        return connection;
    } catch (err) {
        console.error("DB connection failed:", {
            message: err?.message,
            code: err?.code,
            name: err?.name,
        });
        throw err;
    }
}
module.exports = dbConnect;
