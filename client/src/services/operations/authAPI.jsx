import { toast } from "react-hot-toast"

import { setLoading, setToken } from "../../Slices/authSlice"
import { setUser } from "../../Slices/profileSlice"
import { resetCart } from "../../Slices/cartSlice"
import { apiConnector } from "../apiconnector"
import { endpoints } from "../apis"

const { SENDOTP_API, SIGNUP_API, LOGIN_API, RESETPASSTOKEN_API, RESETPASSWORD_API } = endpoints

// SENDOTP concept in authAPI

export function sendOTP(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      })
      console.log("Send OTP API Response", response)
      console.log(response.data.success)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("OTP Send Sucessfully")
      if (typeof navigate === "function") {
        navigate("/verify-email")
      }
    } catch (err) {
      console.log("SENDOTP API ERROR............", err)
      toast.error(err?.response?.data?.message || err?.message || "Could Not Send OTP")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

//  signup concept in authAPI

export function signUp(accountType, firstName, lastName, email, password, confirmPassword, otp, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      })

      if (!response.data.success) {
        throw new Error(response.data.message || "Signup Failed")
      }
      toast.success("Signup Successfull")
      navigate("/login")
    } catch (error) {
      console.log("SIGNUP API ERROR............", error)
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Signup Failed"
      toast.error(errorMessage)
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      })

      console.log("LOGIN API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Login Successful")
      dispatch(setToken(response.data.token))
      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`
      dispatch(setUser({ ...response.data.user, image: userImage }))

      localStorage.setItem("token", JSON.stringify(response.data.token))
      localStorage.setItem(
        "user",
        JSON.stringify({ ...response.data.user, image: userImage })
      )
      navigate("/dashboard/my-profile")
    } catch (error) {
      console.log("LOGIN API ERROR............", error)
      const message =
        error?.response?.data?.message ||
        (error?.message === "Network Error" ? "Server unreachable. Please try again shortly." : "Login Failed")
      toast.error(message)
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

// logout
export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    dispatch(resetCart())
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("totalItems")
    toast.success("Logged Out")
    navigate("/")
  }
}

export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {
    const toastId = toast.loading("loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {
        email,
      })
      console.log("Reset password response", response)
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Reset Email Sent")
      setEmailSent(true)
    } catch (err) {
      console.log("Error in fetching token")
      toast.error("Something Wrong")
      console.log(err)
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

// Reset password

export function resetPassword(password, confirmpassword, token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        password,
        confirmpassword,
        token,
      })
      console.log("Password Reset Sucessfully", response)
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Password Reset Successfully")
      navigate("/login")
    } catch (err) {
      console.log("Password not reset", err)
      toast.error("Unable to reset password")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}
