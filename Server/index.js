const express = require("express");
const app = express();

// Routes
const userRoutes = require("./routes/User");
const courseRoutes = require("./routes/Course");
const profileRoutes = require("./routes/Profile");
const contactRoutes = require("./routes/contact");
const PaymentRoutes = require("./routes/Payment");

// importing the database
const db = require("./config/database");
const cookieParser = require("cookie-parser");

// cors allow to acess the frontend to backend means it allow the frontend to entairn the backend
// or we can say it allow the backend to run the same port at the port in which frontend is running

const cors = require("cors");
const{cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const os = require("os");
require("dotenv").config();

// find the port
const PORT = process.env.PORT || 4000;
db();
cloudinaryConnect();
// adding middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_BASE_URL,
  })
)

app.use(
    fileUpload({
        useTempFiles: true,  // temp files instead of memory
        tempFileDir: os.tmpdir(), // cross-platform temp directory
    })
);


// mounting the api routes
app.use("/api/v1/auth" , userRoutes);
app.use("/api/v1/profile" , profileRoutes);
app.use("/api/v1/course" , courseRoutes);
app.use("/api/v1/contact" , contactRoutes);
app.use("/api/v1/payment" , PaymentRoutes);

// Testing the server
app.get("/", (req, res) => {
	return res.json({
		success: true,
		message: "Your server is up and running ...",
	});
});

// Listening to the server
app.listen(PORT, () => {
	console.log(`App is listening at ${PORT}`);
});
