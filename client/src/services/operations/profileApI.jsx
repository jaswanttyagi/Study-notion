import { setLoading, setUser } from "../../Slices/profileSlice";
import { apiConnector } from "../apiconnector";
import { profileEndpoints } from "../apis";
import { logout } from "./authAPI";
import { toast } from "react-hot-toast"

const { GET_USER_DETAILS_API, GET_USER_ENROLLED_COURSES_API, GET_USER_INSTRUCTOR_DATA_API } = profileEndpoints;

export function getUserDetails(token, navigate) {
    return async (dispatch, getState) => {
       const toastId = toast.loading("loading...")
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
                Authorization: `Bearer ${token}`,
            })
            console.log("Response is here : ",  response);
            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            const existingUser =
              getState()?.profile?.user ??
              (localStorage.getItem("user")
                ? JSON.parse(localStorage.getItem("user"))
                : null)
            const responseImage = response.data.data.image
            const existingImage = existingUser?.image
            const dicebearFallback = `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`
            const userImage =
              responseImage && !responseImage.includes("api.dicebear.com")
                ? responseImage
                : existingImage || responseImage || dicebearFallback
            const mergedUser = { ...response.data.data, image: userImage }
            dispatch(setUser(mergedUser))
            localStorage.setItem("user", JSON.stringify(mergedUser))
        } catch (err) {
            console.log("Error in fetching user details", err);
            dispatch(logout(navigate));
            console.log("GET_USER_DETAILS API ERROR............", err);
            toast.error("Could Not Get User Details")
        }
        toast.dismiss(toastId);
        dispatch(setLoading(false));
    }
}

export async function getUserEnrolledCourses(token) {
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    // console.log("BEFORE Calling BACKEND API FOR ENROLLED COURSES");
    const response = await apiConnector(
      "GET",
      GET_USER_ENROLLED_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )
    // console.log("AFTER Calling BACKEND API FOR ENROLLED COURSES");
    // console.log(
    //   "GET_USER_ENROLLED_COURSES_API API RESPONSE............",
    //   response
    // )

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response.data.data
  } catch (error) {
    console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error)
    toast.error("Could Not Get Enrolled Courses")
  }
  toast.dismiss(toastId)
  return result
}

export async function getInstructorData(token) {
  const toastId = toast.loading("Loading...");
  let result = [];
  try{
    const response = await apiConnector("GET", GET_USER_INSTRUCTOR_DATA_API, null, 
    {
      Authorization: `Bearer ${token}`,
    })

    console.log("GET_INSTRUCTOR_API_RESPONSE");
    result = response?.data?.courses

  }
  catch(error) {
    console.log("GET_INSTRUCTOR_API ERROR", error);
    toast.error("Could not Get Instructor Data")
  }
  toast.dismiss(toastId);
  return result;
}
