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
const normalizeOrigin = (value = "") => value.trim().replace(/\/+$/, "");
const toHost = (value = "") => {
  const cleaned = normalizeOrigin(value);
  if (!cleaned) return "";
  try {
    const withProtocol = /^https?:\/\//i.test(cleaned) ? cleaned : `https://${cleaned}`;
    return new URL(withProtocol).host.toLowerCase();
  } catch {
    return cleaned.replace(/^https?:\/\//i, "").toLowerCase();
  }
};

const allowedOrigins = (process.env.FRONTEND_BASE_URL || "")
  .split(",")
  .map(normalizeOrigin)
  .filter(Boolean);
const allowedHosts = allowedOrigins.map(toHost).filter(Boolean);
const allowVercelPreviews = (process.env.ALLOW_VERCEL_PREVIEWS || "true").toLowerCase() === "true";

const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server and same-origin requests with no Origin header.
    if (!origin) {
      return callback(null, true);
    }
    const normalizedOrigin = normalizeOrigin(origin);
    const originHost = toHost(origin);
    if (allowedOrigins.includes(normalizedOrigin) || allowedHosts.includes(originHost)) {
      return callback(null, true);
    }
    if (allowVercelPreviews && originHost.endsWith(".vercel.app")) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

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
