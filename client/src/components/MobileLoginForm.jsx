import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../services/operations/authAPI";

const MobileLoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  function changeHandler(event) {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  }

  function submitHandler(event) {
    event.preventDefault();
    dispatch(login(formData.email, formData.password, navigate));
  }

  return (
    <form onSubmit={submitHandler} className="mobile-auth-form">
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
          placeholder="Enter email id"
          className="mobile-auth-input"
        />
      </label>

      <label className="mobile-auth-field mobile-auth-password-wrap">
        <span className="mobile-auth-label">
          Password <sup className="mobile-auth-required">*</sup>
        </span>
        <input
          required
          type={showPassword ? "text" : "password"}
          value={formData.password}
          name="password"
          onChange={changeHandler}
          placeholder="Enter password"
          className="mobile-auth-input"
        />
        <button
          type="button"
          className="mobile-auth-visibility"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
        </button>
        <Link to="/forgot-password" className="mobile-auth-forgot">
          Forgot Password
        </Link>
      </label>

      <button type="submit" className="mobile-auth-submit">
        Sign in
      </button>
    </form>
  );
};

export default MobileLoginForm;
