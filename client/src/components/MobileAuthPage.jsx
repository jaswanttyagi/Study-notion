import React from "react";
import { FcGoogle } from "react-icons/fc";
import frameimg from "../assest/images/frame.png";
import MobileLoginForm from "./MobileLoginForm";
import MobileSignupForm from "./MobileSignupForm";

const MobileAuthPage = ({ title, desc1, desc2, image, formtype }) => {
  return (
    <div className="mobile-auth-page">
      <div className="mobile-auth-visual">
        <div className="mobile-auth-glow mobile-auth-glow-left"></div>
        <div className="mobile-auth-glow mobile-auth-glow-right"></div>
        <div className="mobile-auth-frame">
          <div className="mobile-auth-chip">
            {formtype === "signup" ? "LAUNCH PROFILE" : "RETURN TO DASHBOARD"}
          </div>
          <img src={frameimg} alt="" className="mobile-auth-frame-image" />
          <img src={image} alt={formtype} className="mobile-auth-main-image" />
          <div className="mobile-auth-badge">
            <div className="mobile-auth-badge-caption">STUDY FLOW</div>
            <div className="mobile-auth-badge-title">Fast onboarding</div>
          </div>
        </div>
      </div>

      <div className="mobile-auth-card">
        <h1 className="mobile-auth-title">{title}</h1>
        <p className="mobile-auth-subtitle">
          <span>{desc1}</span>
          <span className="mobile-auth-subtitle-accent">{desc2}</span>
        </p>

        {formtype === "signup" ? <MobileSignupForm /> : <MobileLoginForm />}

        <div className="mobile-auth-divider">
          <span></span>
          <p>OR</p>
          <span></span>
        </div>

        <button className="mobile-auth-google">
          <FcGoogle />
          <span>{formtype === "signup" ? "Sign up with Google" : "Sign in with Google"}</span>
        </button>
      </div>
    </div>
  );
};

export default MobileAuthPage;
