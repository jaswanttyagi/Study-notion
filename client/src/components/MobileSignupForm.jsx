import React, { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { sendOTP } from "../services/operations/authAPI";
import { setSignupData } from "../Slices/authSlice";

const MobileSignupForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accountType, setAccountType] = useState("Student");

  function changeHandler(event) {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  }

  function submitHandler(event) {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const signupData = {
      ...formData,
      accountType,
    };

    dispatch(setSignupData(signupData));
    dispatch(sendOTP(formData.email, navigate));
  }

  return (
    <div>
      <div className="mobile-auth-toggle">
        <button
          type="button"
          className={`mobile-auth-toggle-btn ${accountType === "Student" ? "active" : ""}`}
          onClick={() => setAccountType("Student")}
        >
          Student
        </button>
        <button
          type="button"
          className={`mobile-auth-toggle-btn ${accountType === "Instructor" ? "active" : ""}`}
          onClick={() => setAccountType("Instructor")}
        >
          Instructor
        </button>
      </div>

      <form onSubmit={submitHandler} className="mobile-auth-form">
        <div className="mobile-auth-row">
          <label className="mobile-auth-field">
            <span className="mobile-auth-label">
              First Name <sup className="mobile-auth-required">*</sup>
            </span>
            <input
              required
              type="text"
              name="firstName"
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={changeHandler}
              className="mobile-auth-input"
            />
          </label>

          <label className="mobile-auth-field">
            <span className="mobile-auth-label">
              Last Name <sup className="mobile-auth-required">*</sup>
            </span>
            <input
              required
              type="text"
              name="lastName"
              placeholder="Enter last name"
              value={formData.lastName}
              onChange={changeHandler}
              className="mobile-auth-input"
            />
          </label>
        </div>

        <label className="mobile-auth-field">
          <span className="mobile-auth-label">
            Email Address <sup className="mobile-auth-required">*</sup>
          </span>
          <input
            required
            type="email"
            value={formData.email}
            name="email"
            onChange={changeHandler}
            placeholder="Enter email address"
            className="mobile-auth-input"
          />
        </label>

        <div className="mobile-auth-row">
          <label className="mobile-auth-field mobile-auth-password-wrap">
            <span className="mobile-auth-label">
              Create Password <sup className="mobile-auth-required">*</sup>
            </span>
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create your password"
              value={formData.password}
              onChange={changeHandler}
              className="mobile-auth-input"
            />
            <button
              type="button"
              className="mobile-auth-visibility"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
            </button>
          </label>

          <label className="mobile-auth-field mobile-auth-password-wrap">
            <span className="mobile-auth-label">
              Confirm Password <sup className="mobile-auth-required">*</sup>
            </span>
            <input
              required
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={changeHandler}
              className="mobile-auth-input"
            />
            <button
              type="button"
              className="mobile-auth-visibility"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
            </button>
          </label>
        </div>

        <button type="submit" className="mobile-auth-submit">
          Create Account
        </button>
      </form>
    </div>
  );
};

export default MobileSignupForm;
