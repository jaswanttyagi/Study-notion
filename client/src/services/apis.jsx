const rawBaseUrl = import.meta.env.VITE_BASE_URL || "";
const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, "");

// If env is set to domain only, append API prefix expected by backend.
const BASE_URL = normalizedBaseUrl.endsWith("/api/v1")
  ? normalizedBaseUrl
  : `${normalizedBaseUrl}/api/v1`;

export const categories = {
    CATEGORIES_API: BASE_URL + "/course/showAllcategorys",
};

export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/sendOTP",  // auth ke folder me jao and then sendOTP vale function me jao
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/Login",
  RESETPASSTOKEN_API: BASE_URL + "/auth/resetPasswordToken",
  RESETPASSWORD_API: BASE_URL + "/auth/resetPassword",

};

// profileEndpoints

export const profileEndpoints = {
  GET_USER_DETAILS_API : BASE_URL +  "/profile/getAllUserDetails",
  GET_USER_ENROLLED_COURSES_API : BASE_URL + "/profile/getEnrolledCourses",
  GET_USER_INSTRUCTOR_DATA_API : BASE_URL + "/profile/instructorDashboard"
};

// STUDENTS ENDPOINTS
export const studentEndpoints = {
  COURSE_PAYMENT_API: BASE_URL + "/payment/capturePayment",
  COURSE_VERIFY_API: BASE_URL + "/payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendPaymentSuccessEmail",
}

// setting Endpoints 
// SETTINGS PAGE API
export const settingsEndpoints = {
  UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
  CHANGE_PASSWORD_API: BASE_URL + "/auth/changePassword",
  DELETE_PROFILE_API: BASE_URL + "/profile/deleteAccount",
}


// courseEndpoints
export const courseEndpoints = {
    GET_ALL_COURSE_API: BASE_URL + "/course/getAllCourses",
  COURSE_DETAILS_API: BASE_URL + "/course/getCourseDetails",
  EDIT_COURSE_API: BASE_URL + "/course/editCourse",
  COURSE_CATEGORIES_API: BASE_URL + "/course/showAllcategorys",
  CREATE_COURSE_API: BASE_URL + "/course/createCourse",
  CREATE_SECTION_API: BASE_URL + "/course/addSection",
  CREATE_SUBSECTION_API: BASE_URL + "/course/addSubSection",
  UPDATE_SECTION_API: BASE_URL + "/course/updateSection",
  UPDATE_SUBSECTION_API: BASE_URL + "/course/updateSubSection",
  GET_ALL_INSTRUCTOR_COURSES_API: BASE_URL + "/course/getInstructorCourses",
  DELETE_SECTION_API: BASE_URL + "/course/deleteSection",
  DELETE_SUBSECTION_API: BASE_URL + "/course/deleteSubSection",
  DELETE_COURSE_API: BASE_URL + "/course/deleteCourse",
  GET_FULL_COURSE_DETAILS_AUTHENTICATED:
    BASE_URL + "/course/getFullCourseDetails",
  LECTURE_COMPLETION_API: BASE_URL + "/course/updateCourseProgress",
  CREATE_RATING_API: BASE_URL + "/course/createRating",
}


// RATINGS AND REVIEWS
export const ratingsEndpoints = {
  REVIEWS_DETAILS_API: BASE_URL + "/course/getReviews",
}